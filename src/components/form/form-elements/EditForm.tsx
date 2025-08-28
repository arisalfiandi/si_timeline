'use client';
import React from 'react';
import ComponentCard from '../../common/ComponentCard';
import Label from '../Label';
import Input from '../input/InputField';
import DatePicker from '@/components/form/date-picker';
import Chip from '@mui/material/Chip';
import Box from '@mui/material/Box';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
// import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { Button } from '@mui/material';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

// swall
import Swal from 'sweetalert2';

interface UserProfile {
  id: string;
  name: string | null;
}

interface CalendarProfile {
  id: string;
  nama: string;
  deskripsi: string | null;
  tanggal_mulai: Date;
  tanggal_selesai: Date;
  timkerjaId: string | null;
  calender: string | null;
  timKerja: {
    id: string;
    nama: string;
  } | null;
  peserta: {
    user: UserProfile;
  }[];
}

interface TimProfile {
  id: string;
  nama: string;
  ketuaTimId: string;
  ketuaTim: UserProfile;
  anggota: {
    user: UserProfile; // per item anggota punya 1 user
  }[];
}

interface Props {
  data: CalendarProfile | null;
  dataUser: UserProfile[];
  dataTim: TimProfile[];
}

export default function DefaultInputs({ data, dataUser, dataTim }: Props) {
  const router = useRouter();
  const { data: session } = useSession();

  // state form
  const [kegiatanId, setKegiatanId] = React.useState<string>('0');
  const [namaKegiatan, setNamaKegiatan] = React.useState<string>('');
  const [deskripsi, setDeskripsi] = React.useState<string>('');
  const [tanggalMulai, setTanggalMulai] = React.useState<string>('');
  const [tanggalSelesai, setTanggalSelesai] = React.useState<string>('');
  const [peserta, setPeserta] = React.useState<UserProfile[]>([]);
  const [timKerja, setTimKerja] = React.useState<string>('0');
  const [isIsi, setIsIsi] = React.useState<number>(0);

  React.useEffect(() => {
    if (data) {
      setKegiatanId(data.id || '0');
      setNamaKegiatan(data.nama || '');
      setDeskripsi(data.deskripsi || '');
      setTanggalMulai(data.tanggal_mulai.toISOString() || '');
      setTanggalSelesai(data.tanggal_selesai.toISOString() || '');
      setTimKerja(data.timkerjaId || '0');
      setPeserta(data.peserta.map((a: { user: UserProfile }) => a.user));
    }
  }, [data]);

  const newTim = {
    id: '0',
    nama: 'Pribadi',
    ketuaTimId: 'sadkhjdsaj',
    ketuaTim: {
      id: 'sadkhjdsaj',
      name: session?.user?.name || 'Unknown',
    },
    anggota: [], // kosong dulu, nanti bisa isi
  };

  // React.useEffect(() => {
  //   const userLogin = dataUser.find((u) => u.name === session?.user?.name);
  //   if (userLogin) {
  //     setPeserta([userLogin]);
  //   }
  // }, [dataUser, session?.user?.name]);

  const updatedDataTim = [...dataTim, newTim];

  const handleChangeTim = (event: SelectChangeEvent<string>) => {
    const selectedId = event.target.value;
    // cari tim yang dipilih
    const selectedTim = dataTim.find(
      (t) => t.id === selectedId && t.id !== '0',
    );
    if (selectedTim) {
      setTimKerja(selectedTim.id);
      setPeserta(selectedTim.anggota.map((a) => a.user));
    } else {
      setTimKerja('0');
      const userLogin = dataUser.find((u) => u.name === session?.user?.name);
      if (userLogin) {
        setPeserta([userLogin]); // harus array
      } else {
        setPeserta([]); // fallback kalau ga ketemu
      }
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      const res = await fetch(`/api/kegiatan/${kegiatanId}`, {
        method: 'PUT',
        body: JSON.stringify({
          nama: namaKegiatan,
          deskripsi: deskripsi,
          tanggal_mulai: tanggalMulai,
          tanggal_selesai: tanggalSelesai,
          timkerjaId: timKerja,
          anggota: peserta,
          isIsi: isIsi,
        }),
        headers: { 'Content-Type': 'application/json' },
      });

      if (res.status === 200) {
        Swal.fire({
          title: 'Berhasil Mengedit Kegiatan!',
          text: '',
          icon: 'success',
          confirmButtonColor: '#68B92E',
          confirmButtonText: 'OK',
        }).then(() => {
          router.push('/');
        });
      } else {
        console.log(res);
        Swal.fire({
          title: 'Gagal Mengedit Kegiatan!',
          text: 'Coba lagi nanti',
          icon: 'error',
          confirmButtonColor: '#d33',
          confirmButtonText: 'OK',
        });
      }
    } catch (error) {
      console.log(error);
      Swal.fire({
        title: 'Gagal Mengedit Kegiatan!',
        text: 'Coba lagi nanti',
        icon: 'error',
        confirmButtonColor: '#d33',
        confirmButtonText: 'OK',
      });
    }
  };

  return (
    <ComponentCard title="Form Edit Kegiatan">
      <form onSubmit={handleSubmit} id="subscription-form">
        <div className="space-y-12">
          <div>
            <Label>Nama Kegiatan</Label>
            <Input
              type="text"
              placeholder="Nama Kegiatan"
              value={namaKegiatan}
              onChange={(e) => {
                setNamaKegiatan(e.target.value);
                setIsIsi(1);
              }}
            />
          </div>
          <div>
            <Label>Deskripsi Kegiatan</Label>
            <Input
              type="text"
              placeholder="Deskripsi"
              value={deskripsi}
              onChange={(e) => {
                setDeskripsi(e.target.value);
                setIsIsi(1);
              }}
            />
          </div>

          <div>
            <DatePicker
              id="date-picker-start"
              label="Waktu Mulai"
              placeholder="Pilih Waktu Mulai"
              value={tanggalMulai}
              onClose={(selectedDatesStart: Date[]) => {
                if (selectedDatesStart.length > 0) {
                  setTanggalMulai(selectedDatesStart[0].toISOString()); // simpan string ISO
                }
                setIsIsi(1);
              }}
            />
          </div>

          <div>
            <DatePicker
              id="date-picker-end"
              label="Waktu Selesai"
              placeholder="Pilih Waktu Selesai"
              value={tanggalSelesai}
              onClose={(selectedDates: Date[]) => {
                if (selectedDates.length > 0) {
                  setTanggalSelesai(selectedDates[0].toISOString()); // simpan string ISO
                }
                setIsIsi(1);
              }}
            />
          </div>

          <div>
            <FormControl variant="standard" fullWidth>
              <InputLabel id="demo-multiple-chip-label">Tim Kerja</InputLabel>
              <Select
                labelId="demo-multiple-chip-label"
                id="demo-multiple-chip"
                value={timKerja}
                onChange={handleChangeTim}
                renderValue={(selectedId) => {
                  const selectedTim = updatedDataTim.find(
                    (u) => u.id === selectedId,
                  );
                  return (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      <Chip
                        label={
                          `${selectedTim?.nama} - ${selectedTim?.ketuaTim.name}` ||
                          selectedId
                        }
                      />
                    </Box>
                  );
                }}
              >
                {updatedDataTim.map((tim) => (
                  <MenuItem
                    key={tim.id}
                    value={tim.id}
                    // style={getStyles(name, personName, theme)}
                  >
                    {tim.nama} - {tim.ketuaTim.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>

          <div>
            <Autocomplete
              multiple
              id="anggota-tim"
              options={dataUser}
              getOptionLabel={(option) => option.name || ''}
              value={peserta}
              onChange={(_, newValue) => {
                setPeserta(newValue);
                console.log(peserta);
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  variant="standard"
                  label="Peserta Kegiatan"
                  placeholder="Pilih Peserta"
                />
              )}
            />
          </div>
          <div className="flex justify-end">
            <Button variant="contained" type="submit" form="subscription-form">
              Edit
            </Button>
          </div>
        </div>
      </form>
    </ComponentCard>
  );
}
