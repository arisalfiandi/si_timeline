import { NextRequest, NextResponse } from 'next/server';
import { supabaseServer as supabase } from '@/lib/supabase/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { format } from 'date-fns';

interface UserProfile {
  id: string;
  name: string | null;
}

interface JobInsert {
  user_id: string;
  kegiatan_id: string;
  message: string;
  status: string;
  created_at: string;
  updated_at: string;
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  try {
    const body = await req.json();
    const {
      nama,
      deskripsi,
      tanggal_mulai,
      tanggal_selesai,
      timkerjaId,
      timKerjaNama,
      is_lima_hari,
      is_tiga_hari,
      is_satu_hari,
      is_hari_h,
      peserta,
    } = body;

    const tanggalMulai = format(new Date(tanggal_mulai), 'yyyy-MM-dd HH:mm');
    const tanggalSelesai = format(
      new Date(tanggal_selesai),
      'yyyy-MM-dd HH:mm',
    );

    const { data: userData } = await supabase
      .from('User')
      .select('id')
      .eq('email', session?.user?.email)
      .single();

    const colors = ['Success', 'Primary', 'Danger'];

    const randomColor = colors[Math.floor(Math.random() * colors.length)];

    const data = [
      {
        nama,
        deskripsi,
        tanggal_mulai: tanggalMulai,
        tanggal_selesai: tanggalSelesai,
        timkerjaId: timkerjaId != '0' ? timkerjaId : null,
        created_by: userData?.id,
        calender: randomColor,
        is_lima_hari: is_lima_hari,
        is_tiga_hari: is_tiga_hari,
        is_satu_hari: is_satu_hari,
        is_hari_h: is_hari_h,
      },
    ];

    // Insert/Update tim kerja
    const { data: kegiatanData, error: timError } = await supabase
      .from('Kegiatan')
      .upsert(data)
      .select();

    if (timError) {
      console.error(timError);
      return NextResponse.json({ error: timError.message }, { status: 500 });
    }

    const kegiatan = kegiatanData?.[0];
    if (!kegiatan) {
      return NextResponse.json(
        { error: 'Gagal membuat kegiatan' },
        { status: 400 },
      );
    }

    // Masukkan anggota ke tabel relasi kegiatanAnggota
    // if (Array.isArray(peserta) && peserta.length > 0) {
    // const insertData = peserta.map((participant: UserProfile) => ({
    //   kegiatanId: kegiatan.id,
    //   userId: participant.id,
    // }));

    // const { error: anggotaError } = await supabase
    //   .from('KegiatanUser')
    //   .upsert(insertData);

    // if (anggotaError) {
    //   console.error(anggotaError);
    //   return NextResponse.json(
    //     { error: anggotaError.message },
    //     { status: 500 },
    //   );
    // }

    // }

    // ==== Fungsi refresh token Google ====
    async function refreshAccessToken(refreshToken: string) {
      const response = await fetch('https://oauth2.googleapis.com/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          client_id: process.env.GOOGLE_CLIENT_ID!,
          client_secret: process.env.GOOGLE_CLIENT_SECRET!,
          refresh_token: refreshToken,
          grant_type: 'refresh_token',
        }),
      });

      const tokens = await response.json();
      if (!response.ok) {
        console.error('Gagal refresh token Google:', tokens);
        throw new Error(tokens.error || 'Refresh token gagal');
      }

      return tokens.access_token as string;
    }

    // ---- Insert ke Google Calendar tiap peserta ----
    async function insertEventGoogleCalendar(
      accessToken: string,
      event: {
        summary: string;
        description?: string;
        start: string;
        end: string;
      },
    ) {
      const response = await fetch(
        'https://www.googleapis.com/calendar/v3/calendars/primary/events',
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            summary: event.summary,
            description: event.description,
            start: {
              dateTime: new Date(event.start).toISOString(),
              timeZone: 'Asia/Jayapura',
            },
            end: {
              dateTime: new Date(event.end).toISOString(),
              timeZone: 'Asia/Jayapura',
            },
          }),
        },
      );

      if (!response.ok) {
        const error = await response.json();
        console.error('Gagal insert Google Calendar:', error);
        throw new Error(error.error?.message || 'Google Calendar API error');
      }

      return response.json();
    }

    // insert google calendar dan supabase
    if (Array.isArray(peserta) && peserta.length > 0) {
      for (const participant of peserta) {
        const { data: userToken } = await supabase
          .from('User')
          .select('google_access_token, google_refresh_token')
          .eq('id', participant.id)
          .single();

        if (userToken?.google_refresh_token) {
          try {
            const accessToken = await refreshAccessToken(
              userToken.google_refresh_token,
            );

            const data = await insertEventGoogleCalendar(accessToken, {
              summary: nama,
              description: deskripsi,
              start: tanggal_mulai,
              end: tanggal_selesai,
            });

            // console.log(data);

            // Simpan eventId ke tabel KegiatanUser
            await supabase.from('KegiatanUser').insert({
              userId: participant.id,
              google_event_id: data.id,
              kegiatanId: kegiatan.id,
            });
          } catch (err) {
            console.error(
              `Gagal insert calendar untuk user ${participant.id}:`,
              err,
            );
          }
        } else {
          console.warn(
            `User ${participant.id} tidak punya access token Google`,
          );
        }
      }
    }

    // Insert template message ke tabel Jobs
    if (
      (timkerjaId == '0' &&
        (is_hari_h || is_lima_hari || is_tiga_hari || is_satu_hari)) ||
      timkerjaId != '0'
    ) {
      const selesai = new Date(tanggalSelesai.replace(' ', 'T'));
      // const created_at = new Date(selesai); // clone

      const jobsData: JobInsert[] = [];

      if (timkerjaId != '0') {
        const mulaiTanggal = new Date(tanggalMulai.replace(' ', 'T'));
        const selesaiTanggal = new Date(selesai);

        jobsData.push(
          ...peserta.map((participant: UserProfile) => ({
            user_id: participant.id,
            kegiatan_id: kegiatan.id,
            message: `[Tidak Perlu Dibalas]\nHalo ${
              participant.name || 'Peserta'
            }, anda baru saja ditambahkan ke kegiatan baru.\n\n📊 Nama: ${nama}\n🗓️ Waktu kegiatan: ${mulaiTanggal.getDate()}-${
              mulaiTanggal.getMonth() + 1
            }-${mulaiTanggal.getFullYear()} s.d. ${selesaiTanggal.getDate()}-${
              selesaiTanggal.getMonth() + 1
            }-${selesaiTanggal.getFullYear()}\n⏳ Tenggat waktu: ${tanggalSelesai}\n👤 Tim: ${timKerjaNama}\n\nSemangat!`,
            status: 'PENDING',
            created_at: new Date().toISOString().split('T')[0],
            updated_at: new Date().toISOString(),
          })),
        );
      }

      // ============== Reminder rules ==============
      const reminders = [
        { flag: is_lima_hari, offset: -5, text: '*5 hari lagi*' },
        { flag: is_tiga_hari, offset: -3, text: '*3 hari lagi*' },
        { flag: is_satu_hari, offset: -1, text: '*1 hari lagi*' },
        { flag: is_hari_h, offset: 0, text: '*hari ini*' },
      ];

      reminders.forEach(({ flag, offset, text }) => {
        if (!flag) return;
        const reminderDate = new Date(selesai);
        reminderDate.setDate(selesai.getDate() + offset);

        jobsData.push(
          ...peserta.map((participant: UserProfile) => ({
            user_id: participant.id,
            kegiatan_id: kegiatan.id,
            message: `[Tidak Perlu Dibalas]\nHalo ${
              participant.name || 'Peserta'
            }, kegiatan ${nama} memiliki tenggat waktu ${text}.\nTerimakasih`,
            status: 'PENDING',
            created_at: reminderDate.toISOString().split('T')[0],
            updated_at: new Date().toISOString(),
          })),
        );
      });

      // ============== Insert sekali ==============
      if (jobsData.length > 0) {
        const { error: jobsError } = await supabase
          .from('Jobs')
          .insert(jobsData);

        if (jobsError) {
          console.error(jobsError);
          return NextResponse.json(
            { error: jobsError.message },
            { status: 500 },
          );
        }
      }
    }

    // if (
    //   (timkerjaId == '0' &&
    //     (is_hari_h || is_lima_hari || is_tiga_hari || is_satu_hari)) ||
    //   timkerjaId != '0'
    // ) {
    //   const selesai = new Date(tanggalSelesai.replace(' ', 'T'));
    //   const created_at = new Date(selesai); // clone biar tidak merusak selesai
    //   if (timkerjaId != '0') {
    //     const selesai = new Date(tanggalSelesai.replace(' ', 'T'));
    //     const selesaiTanggal = new Date(selesai); // clone biar tidak merusak selesai
    //     selesaiTanggal.setDate(selesai.getDate()); // mundurkan 5 hari
    //     const mulai = new Date(tanggalMulai.replace(' ', 'T'));
    //     const mulaiTanggal = new Date(mulai); // clone biar tidak merusak selesai
    //     mulaiTanggal.setDate(selesai.getDate()); // mundurkan 5 hari
    //     const jobsData = peserta.map((participant: UserProfile) => ({
    //       user_id: participant.id,
    //       kegiatan_id: kegiatan.id,
    //       // phone_number: participant.nomor_hp,
    //       message: `*[Tidak Perlu Dibalas]*\nHalo ${
    //         participant.name || 'Peserta'
    //       }, anda baru saja ditambahkan ke kegiatan baru.\n\n📊 Nama: ${nama}\n🗓️ Waktu kegiatan: ${mulaiTanggal} s.d. ${selesaiTanggal}\n⏳ Tenggat waktu: ${tanggalSelesai}\n👤 Tim: ${timKerjaNama}\n\nSemangat!`,
    //       status: 'PENDING',
    //       created_at: new Date().toISOString().split('T')[0],
    //       updated_at: new Date().toISOString(),
    //     }));
    //     const { error: jobsError } = await supabase
    //       .from('Jobs')
    //       .insert(jobsData);

    //     if (jobsError) {
    //       console.error(jobsError);
    //       return NextResponse.json(
    //         { error: jobsError.message },
    //         { status: 500 },
    //       );
    //     }
    //   }
    //   if (is_lima_hari) {
    //     const created_5 = created_at.setDate(selesai.getDate() - 5);
    //     const jobsData = peserta.map((participant: UserProfile) => ({
    //       user_id: participant.id,
    //       kegiatan_id: kegiatan.id,
    //       // phone_number: participant.nomor_hp,
    //       message: `Halo ${
    //         participant.name || 'Peserta'
    //       }, kegiatan *${nama}* memiliki tenggat waktu *5 hari lagi*.\nTerimakasih`,
    //       status: 'PENDING',
    //       created_at: created_5,
    //       updated_at: new Date().toISOString(),
    //     }));
    //     const { error: jobsError } = await supabase
    //       .from('Jobs')
    //       .insert(jobsData);

    //     if (jobsError) {
    //       console.error(jobsError);
    //       return NextResponse.json(
    //         { error: jobsError.message },
    //         { status: 500 },
    //       );
    //     }
    //   }
    //   if (is_tiga_hari) {
    //     const created_3 = created_at.setDate(selesai.getDate() - 3);
    //     const jobsData = peserta.map((participant: UserProfile) => ({
    //       user_id: participant.id,
    //       kegiatan_id: kegiatan.id,
    //       // phone_number: participant.nomor_hp,
    //       message: `Halo ${
    //         participant.name || 'Peserta'
    //       }, kegiatan *${nama}* memiliki tenggat waktu *3 hari lagi*.\nTerimakasih`,
    //       status: 'PENDING',
    //       created_at: created_3,
    //       updated_at: new Date().toISOString(),
    //     }));
    //     const { error: jobsError } = await supabase
    //       .from('Jobs')
    //       .insert(jobsData);

    //     if (jobsError) {
    //       console.error(jobsError);
    //       return NextResponse.json(
    //         { error: jobsError.message },
    //         { status: 500 },
    //       );
    //     }
    //   }
    //   if (is_satu_hari) {
    //     const created_1 = created_at.setDate(selesai.getDate() - 1);
    //     const jobsData = peserta.map((participant: UserProfile) => ({
    //       user_id: participant.id,
    //       kegiatan_id: kegiatan.id,
    //       // phone_number: participant.nomor_hp,
    //       message: `Halo ${
    //         participant.name || 'Peserta'
    //       }, kegiatan *${nama}* memiliki tenggat waktu *1 hari lagi*.\nTerimakasih`,
    //       status: 'PENDING',
    //       created_at: created_1,
    //       updated_at: new Date().toISOString(),
    //     }));
    //     const { error: jobsError } = await supabase
    //       .from('Jobs')
    //       .insert(jobsData);

    //     if (jobsError) {
    //       console.error(jobsError);
    //       return NextResponse.json(
    //         { error: jobsError.message },
    //         { status: 500 },
    //       );
    //     }
    //   }
    //   if (is_hari_h) {
    //     const jobsData = peserta.map((participant: UserProfile) => ({
    //       user_id: participant.id,
    //       kegiatan_id: kegiatan.id,
    //       // phone_number: participant.nomor_hp,
    //       message: `Halo ${
    //         participant.name || 'Peserta'
    //       }, kegiatan *${nama}* memiliki tenggat waktu *hari ini*.\nTerimakasih`,
    //       status: 'PENDING',
    //       created_at: created_at,
    //       updated_at: new Date().toISOString(),
    //     }));
    //     const { error: jobsError } = await supabase
    //       .from('Jobs')
    //       .insert(jobsData);

    //     if (jobsError) {
    //       console.error(jobsError);
    //       return NextResponse.json(
    //         { error: jobsError.message },
    //         { status: 500 },
    //       );
    //     }
    //   }
    // }

    return NextResponse.json(
      { message: 'Kegiatan berhasil dibuat', kegiatan },
      { status: 200 },
    );
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 },
    );
  }
}
