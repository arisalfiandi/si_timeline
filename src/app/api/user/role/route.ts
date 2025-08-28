import { NextRequest, NextResponse } from 'next/server';
// import { prisma } from '@/lib/prisma';
import { supabaseServer as supabase } from '@/lib/supabase/server';

// const prisma = new PrismaClient();

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, role } = body;

    // if (!email || !nomor_hp) {
    //   return NextResponse.json(
    //     { error: 'Email dan role harus diisi' },
    //     { status: 400 },
    //   );
    // }

    // update role user berdasarkan email
    const { data, error } = await supabase
      .from('User')
      .update({ role })
      .eq('email', email)
      .select(); // biar return user setelah update

    if (error) {
      console.error(error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(
      { message: 'Nomor HP updated successfully', user: data?.[0] },
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
