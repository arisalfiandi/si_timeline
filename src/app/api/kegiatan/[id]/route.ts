import { NextResponse } from 'next/server';
import { supabaseServer as supabase } from '@/lib/supabase/server';
import { format } from 'date-fns';

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

// ---- Update ke Google Calendar tiap peserta ----
async function updateEventGoogleCalendar(
  accessToken: string,
  eventId: string,
  updates: {
    summary?: string;
    description?: string;
    start?: string;
    end?: string;
  },
) {
  const response = await fetch(
    `https://www.googleapis.com/calendar/v3/calendars/primary/events/${eventId}`,
    {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        summary: updates.summary,
        description: updates.description,
        start: updates.start
          ? {
              dateTime: new Date(updates.start).toISOString(),
              timeZone: 'Asia/Jayapura',
            }
          : undefined,
        end: updates.end
          ? {
              dateTime: new Date(updates.end).toISOString(),
              timeZone: 'Asia/Jayapura',
            }
          : undefined,
      }),
    },
  );

  if (!response.ok) {
    const error = await response.json();
    console.error('Gagal update Google Calendar:', error);
    throw new Error(error.error?.message || 'Google Calendar API error');
  }

  return response.json();
}

// ==== Fungsi delete event Google ====
async function deleteEventGoogleCalendar(accessToken: string, eventId: string) {
  const response = await fetch(
    `https://www.googleapis.com/calendar/v3/calendars/primary/events/${eventId}`,
    {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
  );

  if (!response.ok) {
    const error = await response.json();
    console.error('Gagal hapus Google Calendar:', error);
    throw new Error(error.error?.message || 'Google Calendar API error');
  }

  return true; // sukses hapus
}

export async function PUT(
  req: Request,
  context: { params: Promise<{ id: string }> },
) {
  const { id } = await context.params;
  const kegiatanId = id;

  if (Number.isNaN(kegiatanId)) {
    return NextResponse.json({ error: 'Invalid team id' }, { status: 400 });
  }

  const body = await req.json();
  const {
    nama,
    deskripsi,
    tanggal_mulai,
    tanggal_selesai,
    timkerjaId,
    anggota,
    isIsi,
  } = body as {
    nama: string;
    deskripsi: string;
    tanggal_mulai: string;
    tanggal_selesai: string;
    timkerjaId: string;
    isIsi: number;
    anggota: { id: string; name: string }[];
  };

  const tanggalMulai = format(new Date(tanggal_mulai), 'yyyy-MM-dd HH:mm');
  const tanggalSelesai = format(new Date(tanggal_selesai), 'yyyy-MM-dd HH:mm');

  const newMemberIds = Array.from(
    new Set(
      (anggota ?? []).map((a) => ({
        id: a.id,
        name: a.name,
      })),
    ),
  );

  try {
    // Ambil anggota lama
    const { data: existing, error: existingErr } = await supabase
      .from('KegiatanUser')
      .select('userId, google_event_id')
      .eq('kegiatanId', kegiatanId);

    if (existingErr) throw existingErr;

    const oldMemberIds =
      existing?.map((e) => ({
        id: e.userId,
        google_event_id: e.google_event_id,
      })) ?? [];

    const oldIds = oldMemberIds.map((m) => m.id);
    const newIds = newMemberIds.map((m) => m.id);

    const toAdd = newMemberIds.filter((x) => !oldIds.includes(x.id));
    const toRemove = oldMemberIds.filter((x) => !newIds.includes(x.id));
    const toUpdate = oldMemberIds.filter((x) => newIds.includes(x.id));

    // Update Kegiatan or Isi Kegiatan Berubah
    if (isIsi === 1) {
      const { error: updateErr } = await supabase
        .from('Kegiatan')
        .update({
          nama,
          deskripsi,
          tanggal_mulai: tanggalMulai,
          tanggal_selesai: tanggalSelesai,
          timkerjaId: timkerjaId != '0' ? timkerjaId : null,
        })
        .eq('id', kegiatanId);

      // update google calendar
      for (const participant of toUpdate) {
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

            await updateEventGoogleCalendar(
              accessToken,
              participant.google_event_id,
              {
                summary: nama,
                description: deskripsi,
                start: tanggal_mulai,
                end: tanggal_selesai,
              },
            );
          } catch (err) {
            console.error(
              `Gagal delete calendar untuk user ${participant.id}:`,
              err,
            );
          }
        } else {
          console.warn(
            `User ${participant.id} tidak punya access token Google`,
          );
        }
      }

      // Insert template message ke tabel Jobs
      const jobsData = toUpdate.map((participant) => ({
        user_id: participant.id,
        kegiatan_id: kegiatanId,
        // phone_number: participant.nomor_hp,
        message: `Ada perubahan informasi kegiatan "${nama}".\n\n🗓️ Waktu mulai: ${tanggalMulai}\n⏳ Tenggat waktu: ${tanggalSelesai}`,
        status: 'PENDING',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }));

      const { error: jobsError } = await supabase.from('Jobs').insert(jobsData);

      if (jobsError) {
        console.error(jobsError);
        return NextResponse.json({ error: jobsError.message }, { status: 500 });
      }

      if (updateErr) throw updateErr;
    }

    // Hapus anggota lama
    if (toRemove.length > 0) {
      const { error: delErr } = await supabase
        .from('KegiatanUser')
        .delete()
        .eq('kegiatanId', kegiatanId)
        .in(
          'userId',
          toRemove.map((x) => x.id),
        );

      // // Insert template message ke tabel Jobs
      // const jobsData = toRemove.map((participant) => ({
      //   user_id: participant.id,
      //   kegiatan_id: kegiatanId,
      //   // phone_number: participant.nomor_hp,
      //   message: `Anda bukan lagi peserta dari kegiatan "${nama}"`,
      //   status: 'PENDING',
      //   created_at: new Date().toISOString(),
      // }));

      // const { error: jobsError } = await supabase.from('Jobs').insert(jobsData);

      // if (jobsError) {
      //   console.error(jobsError);
      //   return NextResponse.json({ error: jobsError.message }, { status: 500 });
      // }

      // Hapus event google
      for (const participant of toRemove) {
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

            await deleteEventGoogleCalendar(
              accessToken,
              participant.google_event_id,
            );
          } catch (err) {
            console.error(
              `Gagal delete calendar untuk user ${participant.id}:`,
              err,
            );
          }
        } else {
          console.warn(
            `User ${participant.id} tidak punya access token Google`,
          );
        }
      }

      if (delErr) throw delErr;
    }

    // Tambah anggota baru
    if (toAdd.length > 0) {
      // const { error: addErr } = await supabase.from('KegiatanUser').insert(
      //   toAdd.map((user) => ({
      //     kegiatanId,
      //     userId: user.id,
      //   })),
      // );

      for (const participant of toAdd) {
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

            // Simpan eventId ke tabel KegiatanUser
            await supabase.from('KegiatanUser').insert({
              userId: participant.id,
              google_event_id: data.id,
              kegiatanId: kegiatanId,
            });
          } catch (err) {
            console.error(
              `Gagal insert calendar untuk user ${participant.name}:`,
              err,
            );
          }
        } else {
          console.warn(
            `User ${participant.name} tidak punya access token Google`,
          );
        }
      }

      // Insert template message ke tabel Jobs
      const jobsData = toAdd.map((participant) => ({
        user_id: participant.id,
        kegiatan_id: kegiatanId,
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

      // if (addErr) throw addErr;
    }

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error('Gagal update kegiatan user:', e);
    return NextResponse.json({ error: 'Gagal update tim' }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await context.params;

    // Hapus tim kerja
    const { error } = await supabase.from('Kegiatan').delete().eq('id', id);

    const body = await req.json();
    const { google_event_id } = body as {
      google_event_id: {
        id: string;
        name: string;
        google_event_id: string;
      }[];
    };

    if (Array.isArray(google_event_id) && google_event_id.length > 0) {
      for (const participant of google_event_id) {
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

            await deleteEventGoogleCalendar(
              accessToken,
              participant.google_event_id,
            );
          } catch (err) {
            console.error(
              `Gagal delete calendar untuk user ${participant.id}:`,
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

    if (error) {
      console.error(error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ message: 'Tim kerja deleted successfully' });
  } catch (error) {
    console.error('Delete tim kerja error:', error);
    return NextResponse.json(
      { error: 'Failed to delete tim kerja' },
      { status: 500 },
    );
  }
}
