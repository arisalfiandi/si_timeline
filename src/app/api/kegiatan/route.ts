import { NextRequest, NextResponse } from 'next/server';
import { supabaseServer as supabase } from '@/lib/supabase/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { format } from 'date-fns';

interface UserProfile {
  id: string;
  name: string | null;
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
    const jobsData = peserta.map((participant: UserProfile) => ({
      user_id: participant.id,
      kegiatan_id: kegiatan.id,
      // phone_number: participant.nomor_hp,
      message: `Halo ${
        participant.name || 'Peserta'
      }, Anda baru saja ditambahkan ke kegiatan "${nama}".\n\n🗓️ Waktu mulai: ${tanggalMulai}\n⏳ Tenggat waktu: ${tanggalSelesai}`,
      status: 'PENDING',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }));

    const { error: jobsError } = await supabase.from('Jobs').insert(jobsData);

    if (jobsError) {
      console.error(jobsError);
      return NextResponse.json({ error: jobsError.message }, { status: 500 });
    }

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
