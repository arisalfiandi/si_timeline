import { NextRequest, NextResponse } from 'next/server';
import { supabaseServer as supabase } from '@/lib/supabase/server';

interface UserProfile {
  id: string;
  name: string | null;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { nama, ketua, anggota } = body;

    // Insert/Update tim kerja
    const { data: timkerjaData, error: timError } = await supabase
      .from('TimKerja')
      .upsert({
        nama,
        ketuaTimId: ketua,
      })
      .select();

    if (timError) {
      console.error(timError);
      return NextResponse.json({ error: timError.message }, { status: 500 });
    }

    const timkerja = timkerjaData?.[0];
    if (!timkerja) {
      return NextResponse.json(
        { error: 'Gagal membuat tim kerja' },
        { status: 400 },
      );
    }

    // Masukkan anggota ke tabel relasi TimKerjaAnggota
    if (Array.isArray(anggota) && anggota.length > 0) {
      const insertData = anggota.map((participant: UserProfile) => ({
        timkerjaId: timkerja.id,
        userId: participant.id,
      }));

      const { error: anggotaError } = await supabase
        .from('TimKerjaUser') // <- pastikan tabel relasi namanya ini
        .upsert(insertData);

      if (anggotaError) {
        console.error(anggotaError);
        return NextResponse.json(
          { error: anggotaError.message },
          { status: 500 },
        );
      }
    }

    return NextResponse.json(
      { message: 'Tim kerja berhasil dibuat', timkerja },
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
