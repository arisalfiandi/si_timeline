import PageBreadcrumb from '@/components/common/PageBreadCrumb';
import Akunpengguna from '@/components/akun/AkunPengguna';
import { Metadata } from 'next';
import React from 'react';

// get data
import { prisma } from '@/lib/prisma';
// import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';

export const metadata: Metadata = {
  title: 'Akun Pengguna - Sipete',
  description:
    'This is Next.js Form Elements page for TailAdmin - Next.js Tailwind CSS Admin Dashboard Template',
};

export default async function AkunPengguna() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    redirect('/signin');
  }
  const users = await prisma.user.findMany({
    select: { id: true, name: true, email: true, nomor_hp: true, role: true },
    where: {
      role: {
        not: 'admin',
      },
    },
    orderBy: {
      name: 'asc',
    },
  });
  const usersData = users.map((u) => ({ ...u, nomor_hp: u.nomor_hp ?? '' }));
  return (
    <div>
      <PageBreadcrumb pageTitle="Akun Pengguna" />
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-1">
        <div className="space-y-12">
          <Akunpengguna data={usersData} />
        </div>
      </div>
    </div>
  );
}
