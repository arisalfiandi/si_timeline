import type { Metadata } from 'next';
// import { EcommerceMetrics } from "@/components/ecommerce/EcommerceMetrics";
import Calendar from '@/components/calendar/Calendar';
import BuatKegiatan from '@/components/calendar/BuatKegiatan';
import React from 'react';

// get data
import { prisma } from '@/lib/prisma';
// import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';

import { supabaseServer as supabase } from '@/lib/supabase/server';

export const metadata: Metadata = {
  title: 'Dashboard - Sipete',
  description: 'This is Next.js Home for TailAdmin Dashboard Template',
};

export default async function Ecommerce() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    redirect('/signin');
  }

  const { data: userData } = await supabase
    .from('User')
    .select('id')
    .eq('email', session?.user?.email)
    .single();

  async function withRetry<T>(
    fn: () => Promise<T>,
    retries = 3,
    delay = 500,
  ): Promise<T> {
    try {
      return await fn();
    } catch (err) {
      if (retries <= 0) throw err;
      await new Promise((res) => setTimeout(res, delay));
      return withRetry(fn, retries - 1, delay * 2);
    }
  }

  const events = await withRetry(() =>
    prisma.kegiatanUser.findMany({
      select: {
        id: true,
        kegiatan: {
          select: {
            id: true,
            nama: true,
            deskripsi: true,
            tanggal_mulai: true,
            tanggal_selesai: true,
            timkerjaId: true,
            calender: true,
            dibuat_oleh: {
              select: {
                email: true,
              },
            },
            timKerja: {
              select: {
                id: true,
                nama: true,
              },
            },
            peserta: {
              select: {
                google_event_id: true,
                user: {
                  select: {
                    id: true,
                    name: true,
                  },
                },
              },
            },
          },
        },
      },
      where: {
        userId: userData?.id,
      },
    }),
  );
  return (
    <div className="grid grid-cols-1 gap-6 xl:grid-cols-1">
      <div className="space-y-12 flex justify-end col-span-12">
        <BuatKegiatan />
      </div>
      <div className="col-span-12 space-y-12 xl:col-span-12">
        <Calendar data={events} />
      </div>

      {/* <div className="col-span-12 xl:col-span-5">
        <MonthlyTarget />
      </div> */}

      {/* <div className="col-span-12">
        <StatisticsChart />
      </div> */}

      {/* <div className="col-span-12 xl:col-span-5">
        <DemographicCard />
      </div>

      <div className="col-span-12 xl:col-span-7">
        <RecentOrders />
      </div> */}
    </div>
  );
}
