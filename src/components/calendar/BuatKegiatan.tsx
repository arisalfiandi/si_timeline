'use client';
import * as React from 'react';
import { Button } from '@mui/material';
import { PlusIcon } from '@/icons';

import { useRouter } from 'next/navigation';

export default function BuatKegiatan() {
  const router = useRouter();
  return (
    <Button
      sx={{ mr: 2 }}
      variant="contained"
      color="info"
      onClick={() => router.push('/form-kegiatan')}
    >
      <PlusIcon /> {' Buat Kegiatan'}
    </Button>
  );
}
