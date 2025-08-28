import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';
// app/page.tsx
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    redirect('/signin');
  }

  const user = await prisma.user.findUnique({
    where: {
      email: session.user.email,
    },
    select: {
      id: true,
      name: true,
      email: true,
      nomor_hp: true,
      role: true,
      timKerjaUser: {
        select: {
          timKerja: {
            select: {
              id: true,
              nama: true,
            },
          },
        },
      },
    },
  });

  return NextResponse.json(user);
}
