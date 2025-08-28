import { NextResponse } from 'next/server';
import { supabaseServer as supabase } from '@/lib/supabase/server';

export async function PUT(
  req: Request,
  context: { params: Promise<{ id: string }> },
) {
  const { id } = await context.params;
  const timId = Number(id);

  if (Number.isNaN(timId)) {
    return NextResponse.json({ error: 'Invalid team id' }, { status: 400 });
  }

  const body = await req.json();
  const { nama, ketua, anggota } = body as {
    nama: string;
    ketua: string;
    anggota: { id: string; name: string | null }[];
  };

  if (!nama || !ketua) {
    return NextResponse.json({ error: 'nama & ketua wajib' }, { status: 400 });
  }

  const newMemberIds = Array.from(new Set((anggota ?? []).map((a) => a.id)));

  try {
    // Ambil anggota lama
    const { data: existing, error: existingErr } = await supabase
      .from('TimKerjaUser')
      .select('userId')
      .eq('timkerjaId', timId); // 👈 pakai timkerjaId sesuai schema

    if (existingErr) throw existingErr;

    const oldMemberIds = existing?.map((e) => e.userId) ?? [];

    const toAdd = newMemberIds.filter((x) => !oldMemberIds.includes(x));
    const toRemove = oldMemberIds.filter((x) => !newMemberIds.includes(x));

    // Update header tim
    const { error: updateErr } = await supabase
      .from('TimKerja')
      .update({ nama, ketuaTimId: ketua })
      .eq('id', timId);

    if (updateErr) throw updateErr;

    // Hapus anggota lama
    if (toRemove.length > 0) {
      const { error: delErr } = await supabase
        .from('TimKerjaUser')
        .delete()
        .eq('timkerjaId', timId)
        .in('userId', toRemove);

      if (delErr) throw delErr;
    }

    // Tambah anggota baru
    if (toAdd.length > 0) {
      const { error: addErr } = await supabase
        .from('TimKerjaUser')
        .insert(toAdd.map((userId) => ({ timkerjaId: timId, userId })));

      if (addErr) throw addErr;
    }

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error('Gagal update tim:', e);
    return NextResponse.json({ error: 'Gagal update tim' }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await context.params;

    // await supabase.from('TimKerjaUser').delete().eq('timkerjaId', id);

    // Hapus tim kerja
    const { error } = await supabase.from('TimKerja').delete().eq('id', id);

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
