import PageBreadcrumb from '@/components/common/PageBreadCrumb';
// import CheckboxComponents from '@/components/form/form-elements/CheckboxComponents';
import DefaultInputs from '@/components/form/form-elements/DefaultInputs';
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

export const metadata: Metadata = {
  title: 'Edit Kegiatan - Sipete',
  description:
    'This is Next.js Form Elements page for TailAdmin - Next.js Tailwind CSS Admin Dashboard Template',
};

export default async function FormElements() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    redirect('/signin'); // ✅ aman, pakai redirect bawaan Next.js
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
          nomor_hp: true,
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
      <PageBreadcrumb pageTitle="Buat Kegiatan" />
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-1">
        <div className="space-y-12">
          <DefaultInputs dataUser={usersData} dataTim={tims} />
        </div>
        {/* <div className="space-y-12">
          <InputGroup />
          <FileInputExample />
          <CheckboxComponents />
          <RadioButtons />
          <ToggleSwitch />
          <DropzoneComponent />
        </div> */}
      </div>
    </div>
  );
}
