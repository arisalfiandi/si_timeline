import PageBreadcrumb from '@/components/common/PageBreadCrumb';
// import CheckboxComponents from '@/components/form/form-elements/CheckboxComponents';
import EditForm from '@/components/form/form-elements/EditForm';
// import DropzoneComponent from '@/components/form/form-elements/DropZone';
// import FileInputExample from '@/components/form/form-elements/FileInputExample';
// import InputGroup from '@/components/form/form-elements/InputGroup';
// import InputStates from "@/components/form/form-elements/InputStates";
// import RadioButtons from '@/components/form/form-elements/RadioButtons';
// import SelectInputs from "@/components/form/form-elements/SelectInputs";
// import TextAreaInput from "@/components/form/form-elements/TextAreaInput";
// import ToggleSwitch from '@/components/form/form-elements/ToggleSwitch';
import { Metadata } from 'next';
import React from 'react';

// get data
import { prisma } from '@/lib/prisma';
// import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';

interface Props {
  params: Promise<{ id: string }>;
}

export const metadata: Metadata = {
  title: 'Edit Kegiatan - Sipete',
  description:
    'This is Next.js Form Elements page for TailAdmin - Next.js Tailwind CSS Admin Dashboard Template',
};

export default async function FormEditElements({ params }: Props) {
  const session = await getServerSession(authOptions);
  const { id } = await params;

  if (!session?.user?.email) {
    redirect('/signin');
  }

  const kegiatan = await prisma.kegiatan.findUnique({
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
          user: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      },
    },
    where: { id: id },
  });

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

  const usersData = users.map((u) => ({ ...u, nomor_hp: u.name ?? '' }));

  return (
    <div>
      <PageBreadcrumb pageTitle="Edit Kegiatan" />
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-1">
        <div className="space-y-12">
          <EditForm data={kegiatan} dataUser={usersData} dataTim={tims} />
        </div>
      </div>
    </div>
  );
}
