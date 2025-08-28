import PageBreadcrumb from '@/components/common/PageBreadCrumb';
import TimKerjaComponent from '@/components/timkerja/TimKerjaComponent';
import BuatTimKerja from '@/components/timkerja/BuatTimKerja';
import { Metadata } from 'next';
import React from 'react';

// get data
import { prisma } from '@/lib/prisma';
// import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';

export const metadata: Metadata = {
  title: 'Tim Kerja - Sipete',
  description:
    'This is Next.js Form Elements page for TailAdmin - Next.js Tailwind CSS Admin Dashboard Template',
};

export default async function TimKerja() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    redirect('/signin');
  }
  const users = await prisma.user.findMany({
    select: { id: true, name: true },
    where: {
      role: {
        not: 'admin',
      },
    },
    orderBy: {
      name: 'asc',
    },
  });

  const tims = await prisma.timKerja.findMany({
    select: {
      id: true,
      nama: true,
      ketuaTimId: true,
      ketuaTim: {
        select: {
          id: true,
          name: true,
        },
      },
      anggota: {
        select: {
          user: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      },
    },
    orderBy: {
      nama: 'asc',
    },
  });

  const usersData = users.map((u) => ({ ...u, name: u.name ?? '' }));

  return (
    <div>
      <PageBreadcrumb pageTitle="Tim Kerja" />
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-1">
        <div className="space-y-12 flex justify-end">
          <BuatTimKerja data={usersData} />
        </div>
        <div className="space-y-12">
          <TimKerjaComponent data={usersData} dataTim={tims} />
        </div>
      </div>
    </div>
  );
}
