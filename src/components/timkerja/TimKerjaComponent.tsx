'use client';
import * as React from 'react';
// import ComponentCard from '../common/ComponentCard';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { Box, Typography, Button } from '@mui/material';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
// import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Chip from '@mui/material/Chip';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
// icon
import { TrashBinIcon, PencilIcon, EyeIcon } from '@/icons';
// router
// import { useRouter } from 'next/navigation';

import { useSession } from 'next-auth/react';

// swall
import Swal from 'sweetalert2';

interface UserProfile {
  id: string;
  name: string | null;
}

// interface AnggotaProfile {
//   userId: string;
// }

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
  data: UserProfile[];
  dataTim: TimProfile[];
}

export default function TimKerjaComponent({ data, dataTim }: Props) {
  // const router = useRouter();
  const { data: session } = useSession();

  const [isMounted, setIsMounted] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const [opensee, setOpensee] = React.useState(false);
  // state form
  const [namaTim, setNamaTim] = React.useState<string>('');
  const [ketuaTim, setKetuaTim] = React.useState<string | null>(null);
  const [anggota, setAnggota] = React.useState<UserProfile[] | null>([]);
  const [selectedId, setSelectedId] = React.useState<string>('0');

  const handleClickOpensee = (
    id: string | null,
    anggota: UserProfile[] | null,
    nama: string,
  ) => {
    setKetuaTim(id);
    setAnggota(anggota);
    setNamaTim(nama);
    setOpensee(true);
  };

  const handleClosesee = () => {
    setOpensee(false);
  };

  const handleClickOpen = (
    id: string | null,
    anggota: UserProfile[] | null,
    nama: string,
  ) => {
    setKetuaTim(id);
    setAnggota(anggota);
    setNamaTim(nama);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      const res = await fetch(`/api/tim/${selectedId}`, {
        method: 'PUT',
        body: JSON.stringify({
          nama: namaTim,
          ketua: ketuaTim,
          anggota: anggota,
        }),
        headers: { 'Content-Type': 'application/json' },
      });

      if (res.status === 200) {
        setOpen(false);
        Swal.fire({
          title: 'Berhasil Mengubah Tim Kerja',
          text: '',
          icon: 'success',
          confirmButtonColor: '#68B92E',
          confirmButtonText: 'OK',
        }).then(() => {
          window.location.reload();
        });
      } else {
        setOpen(false);
        Swal.fire({
          title: 'Gagal Mengubah Tim Kerja',
          text: 'Coba lagi nanti',
          icon: 'error',
          confirmButtonColor: '#d33',
          confirmButtonText: 'OK',
        });
      }
    } catch (error) {
      console.log(error);
      setOpen(false);
      Swal.fire({
        title: 'Gagal Mengubah Tim Kerja',
        text: 'Coba lagi nanti',
        icon: 'error',
        confirmButtonColor: '#d33',
        confirmButtonText: 'OK',
      });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/tim/${id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        Swal.fire({
          title: 'Berhasil Menghapus Tim Kerja!',
          text: '',
          icon: 'success',
          confirmButtonColor: '#68B92E',
          confirmButtonText: 'OK',
        }).then(() => {
          window.location.reload();
        });
      } else {
        const error = await res.json();
        Swal.fire({
          title: 'Gagal Menghapus Tim Kerja!',
          text: error.error,
          icon: 'error',
          confirmButtonColor: '#d33',
          confirmButtonText: 'OK',
        });
      }
    } catch (error) {
      console.log(error);
      Swal.fire({
        title: 'Gagal Menghapus Tim Kerja!',
        text: 'Coba lagi nanti',
        icon: 'error',
        confirmButtonColor: '#d33',
        confirmButtonText: 'OK',
      });
    }
  };

  // const handleChange = (event: SelectChangeEvent<typeof personName>) => {
  //   const {
  //     target: { value },
  //   } = event;
  //   setPersonName(
  //     // On autofill we get a stringified value.
  //     typeof value === 'string' ? value.split(',') : value,
  //   );
  // };

  const columns: GridColDef<(typeof rows)[number]>[] = [
    {
      field: 'shownId',
      headerName: 'No',
      flex: 0.6,
      renderHeader: () => (
        // session.status === 'authenticated' && (session.data.uid === 1099999 || session.data.role == 'admin') ? (
        //   <>
        <Typography
          sx={{
            fontWeight: 600,
            fontSize: '0.875rem !important',
            textAlign: 'center',
          }}
        >
          No
        </Typography>
      ),
      renderCell: (params) => (
        <Box display="flex" alignItems="center" height="100%">
          <Typography
            sx={{
              fontWeight: 200,
              fontSize: '0.875rem !important',
              textAlign: 'left',
            }}
          >
            {params.row.shownId}
          </Typography>
        </Box>
      ),
    },
    {
      field: 'nama',
      headerName: 'Nama Tim',
      flex: 2.5,
      renderHeader: () => (
        // session.status === 'authenticated' && (session.data.uid === 1099999 || session.data.role == 'admin') ? (
        //   <>
        <Typography
          sx={{
            fontWeight: 600,
            fontSize: '0.875rem !important',
            textAlign: 'center',
          }}
        >
          Nama Tim
        </Typography>
      ),
      renderCell: (params) => (
        <Box display="flex" alignItems="center" height="100%">
          <Typography
            sx={{
              fontWeight: 200,
              fontSize: '0.875rem !important',
              textAlign: 'left',
            }}
          >
            {params.row.nama}
          </Typography>
        </Box>
      ),
    },
    {
      field: 'ketua',
      headerName: 'Ketua Tim',
      flex: 2.5,
      renderHeader: () => (
        // session.status === 'authenticated' && (session.data.uid === 1099999 || session.data.role == 'admin') ? (
        //   <>
        <Typography
          sx={{
            fontWeight: 600,
            fontSize: '0.875rem !important',
            textAlign: 'center',
          }}
        >
          Ketua Tim
        </Typography>
      ),
      renderCell: (params) => (
        <Box display="flex" alignItems="center" height="100%">
          <Typography
            sx={{
              fontWeight: 200,
              fontSize: '0.875rem !important',
              textAlign: 'left',
            }}
          >
            {params.row.ketuaTim}
          </Typography>
        </Box>
      ),
    },

    {
      field: 'aksi',
      renderHeader: () => (
        // session.status === 'authenticated' && (session.data.uid === 1099999 || session.data.role == 'admin') ? (
        //   <>
        <Typography
          sx={{
            fontWeight: 600,
            fontSize: '0.875rem !important',
            textAlign: 'right',
          }}
        >
          Aksi
        </Typography>
      ),
      //   </>
      // ) : (
      //   <></>
      // ),
      flex: 2,
      renderCell: (params) =>
        session?.user.id === params.row.ketuaTimId ? (
          <Box>
            <Button
              sx={{ mr: 2, fontSize: 5 }}
              variant="contained"
              color="primary"
              onClick={() =>
                handleClickOpensee(
                  params.row.ketuaTimId,
                  params.row.anggota.map((a: { user: UserProfile }) => a.user),
                  params.row.nama,
                )
              }
            >
              <EyeIcon />
            </Button>
            <Button
              sx={{ mr: 2 }}
              variant="contained"
              color="warning"
              onClick={() => {
                setSelectedId(params.row.id);
                handleClickOpen(
                  params.row.ketuaTimId,
                  params.row.anggota.map((a: { user: UserProfile }) => a.user),
                  params.row.nama,
                );
              }}
            >
              <PencilIcon />
            </Button>
            <Button
              variant="contained"
              color="error"
              onClick={() => {
                Swal.fire({
                  title: 'Yakin Hapus ' + params.row.nama + '?',
                  text: '',
                  icon: 'warning',
                  showCancelButton: true,
                  confirmButtonColor: '#3085d6',
                  cancelButtonColor: '#d33',
                  confirmButtonText: 'Ya, Hapus',
                }).then((result) => {
                  if (result.isConfirmed) {
                    handleDelete(params.row.id);
                  }
                });
              }}
            >
              <TrashBinIcon />
            </Button>
          </Box>
        ) : (
          <Box>
            <Button
              sx={{ mr: 2, fontSize: 5 }}
              variant="contained"
              color="primary"
              onClick={() =>
                handleClickOpensee(
                  params.row.ketuaTimId,
                  params.row.anggota.map((a: { user: UserProfile }) => a.user),
                  params.row.nama,
                )
              }
            >
              <EyeIcon />
            </Button>
          </Box>
        ),
    },
  ];

  const rows = dataTim.map((tim: TimProfile, i = 1) => {
    return {
      id: tim.id,
      shownId: i + 1,
      nama: tim.nama,
      ketuaTim: tim.ketuaTim.name,
      ketuaTimId: tim.ketuaTim.id,
      anggota: tim.anggota,
    };
  });

  React.useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <>
      <Box>
        {isMounted && (
          <DataGrid
            rowHeight={60}
            rows={rows}
            columns={columns}
            initialState={{
              pagination: {
                paginationModel: {
                  pageSize: 10,
                },
              },
              // sorting: {
              //   sortModel: [
              //     {
              //       field: 'status',
              //       sort: 'asc',
              //     },
              //   ],
              // },
            }}
            pageSizeOptions={[5, 10, 50, 100]}
            // slots={{
            //   toolbar: GridToolbar,
            // }}
            // slotProps={{
            //   toolbar: { showQuickFilter: true },
            // }}
            // checkboxSelection
            disableRowSelectionOnClick
          />
        )}
      </Box>

      {/* Lihat Tim Kerja */}
      <Dialog open={opensee} onClose={handleClosesee} fullWidth>
        <DialogTitle sx={{ fontWeight: 700 }}>{namaTim}</DialogTitle>
        <DialogContent>
          {/* <DialogContentText>
        To subscribe to this website, please enter your email address here. We
        will send updates occasionally.
      </DialogContentText> */}
          <div className="space-y-8">
            {/* Nama tim kerja */}
            {/* <div>
              <TextField
                id="nama-tim"
                label="Nama Tim Kerja"
                variant="standard"
                fullWidth
                value={namaTim}
                onChange={(e) => setNamaTim(e.target.value)}
              />
            </div> */}

            {/* Ketua Tim */}
            <div>
              <FormControl variant="standard" fullWidth disabled>
                <InputLabel id="ketua-label">Ketua Tim Kerja</InputLabel>
                <Select
                  labelId="ketua-label"
                  id="ketua-tim"
                  value={ketuaTim || ''}
                  onChange={(e) => setKetuaTim(e.target.value)}
                  renderValue={(selectedId) => {
                    const selectedUser = data.find((u) => u.id === selectedId);
                    return (
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        <Chip label={selectedUser?.name || selectedId} />
                      </Box>
                    );
                  }}
                >
                  {data.map((user) => (
                    <MenuItem key={user.id} value={user.id}>
                      {user.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </div>

            {/* Anggota Tim */}
            <div>
              <Autocomplete
                multiple
                disabled
                id="anggota-tim"
                options={data}
                getOptionLabel={(option) => option.name || ''}
                value={anggota ?? []}
                onChange={(_, newValue) => setAnggota(newValue)}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    variant="standard"
                    label="Anggota Tim"
                    placeholder="Pilih anggota"
                  />
                )}
              />
            </div>
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClosesee}>Kembali</Button>
        </DialogActions>
      </Dialog>

      {/* Edit Tim Kerja */}
      <Dialog open={open} onClose={handleClose} fullWidth>
        <DialogTitle>Edit Tim Sosial</DialogTitle>
        <DialogContent>
          {/* <DialogContentText>
              To subscribe to this website, please enter your email address here. We
              will send updates occasionally.
            </DialogContentText> */}
          <form onSubmit={handleSubmit} id="subscription-form">
            <div className="space-y-8">
              {/* Nama tim kerja */}
              <div>
                <TextField
                  id="nama-tim"
                  label="Nama Tim Kerja"
                  variant="standard"
                  fullWidth
                  value={namaTim}
                  onChange={(e) => setNamaTim(e.target.value)}
                />
              </div>

              {/* Ketua Tim */}
              <div>
                <FormControl variant="standard" fullWidth>
                  <InputLabel id="ketua-label">Ketua Tim Kerja</InputLabel>
                  <Select
                    labelId="ketua-label"
                    id="ketua-tim"
                    value={ketuaTim || ''}
                    onChange={(e) => setKetuaTim(e.target.value)}
                    renderValue={(selectedId) => {
                      const selectedUser = data.find(
                        (u) => u.id === selectedId,
                      );
                      return (
                        <Box
                          sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}
                        >
                          <Chip label={selectedUser?.name || selectedId} />
                        </Box>
                      );
                    }}
                  >
                    {data.map((user) => (
                      <MenuItem key={user.id} value={user.id}>
                        {user.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </div>

              {/* Anggota Tim */}
              <div>
                <Autocomplete
                  multiple
                  id="anggota-tim"
                  options={data}
                  getOptionLabel={(option) => option.name || ''}
                  value={anggota ?? []}
                  onChange={(_, newValue) => setAnggota(newValue)}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      variant="standard"
                      label="Anggota Tim"
                      placeholder="Pilih anggota"
                    />
                  )}
                />
              </div>
            </div>
          </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button type="submit" form="subscription-form">
            Kirim
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
