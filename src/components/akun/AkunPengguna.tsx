'use client';
import * as React from 'react';
// import ComponentCard from '../common/ComponentCard';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import {
  Box,
  Typography,
  // Chip,
  // useTheme,
  // Link,
  Button,
  // Modal,
  // TextField,
  // Radio,
  // RadioGroup,
  // FormControl,
  // FormControlLabel,
  // FormLabel,
} from '@mui/material';
import { TrashBinIcon } from '@/icons';

// ** MUI Imports
import FormControl from '@mui/material/FormControl';
// import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
// import { redirect } from 'next/navigation';

// swall
import Swal from 'sweetalert2';

interface UserProfile {
  id: string;
  name: string | null;
  email: string;
  nomor_hp: string;
  role: string | null;
}

interface Props {
  data: UserProfile[];
}

export default function AkunPengguna({ data }: Props) {
  const [isMounted, setIsMounted] = React.useState(false);
  // const [akun, setAkun] = React.useState<UserProfile[] | null>(data);

  React.useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleChangeRole = async (
    email: string | null,
    role: string | null,
  ) => {
    try {
      const res = await fetch('/api/user/role', {
        method: 'PATCH',
        body: JSON.stringify({
          email: email,
          role: role,
        }),
        headers: { 'Content-Type': 'application/json' },
      });

      if (res.status === 200) {
        Swal.fire({
          title: 'Berhasil Mengubah Peran Pegawai',
          text: '',
          icon: 'success',
          confirmButtonColor: '#68B92E',
          confirmButtonText: 'OK',
        }).then(() => {
          window.location.reload();
        });
      }
    } catch (error) {
      console.log(error);
      Swal.fire({
        title: 'Gagal Mengubah Peran Pegawai',
        text: 'Coba lagi nanti',
        icon: 'error',
        confirmButtonColor: '#d33',
        confirmButtonText: 'OK',
      });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/user/${id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        Swal.fire({
          title: 'Berhasil Menghapus Pegawai',
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
          title: 'Gagal Menghapus Pegawai',
          text: error.error,
          icon: 'error',
          confirmButtonColor: '#d33',
          confirmButtonText: 'OK',
        });
      }
    } catch (error) {
      console.log(error);
      Swal.fire({
        title: 'Gagal Menghapus Pegawai',
        text: 'Coba lagi nanti',
        icon: 'error',
        confirmButtonColor: '#d33',
        confirmButtonText: 'OK',
      });
    }
  };

  const columns: GridColDef<(typeof rows)[number]>[] = [
    {
      field: 'shownId',
      headerName: 'No',
      flex: 0.5,
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
      headerName: 'Nama',
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
          Nama
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
      field: 'email',
      headerName: 'Email',
      flex: 2,
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
          Email
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
            {params.row.email}
          </Typography>
        </Box>
      ),
    },
    {
      field: 'nohp',
      headerName: 'Nomor HP',
      flex: 1.5,
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
          Nomor HP
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
            {params.row.nohp}
          </Typography>
        </Box>
      ),
    },

    {
      field: 'role',
      renderHeader: () => (
        <Typography
          sx={{ fontSize: '0.875rem !important', textAlign: 'center' }}
        >
          Role
        </Typography>
      ),
      minWidth: 160,
      flex: 1,
      renderCell: (params) => (
        <form>
          <>
            <FormControl fullWidth>
              {/* <InputLabel id="form-layouts-separator-select-label">
                role
              </InputLabel> */}
              <Select
                // sx={{ height: 50 }}
                value={params.row.role}
                // label="role"
                id="form-layouts-separator-role"
                labelId="form-layouts-separator-role-label"
                onChange={(e) =>
                  handleChangeRole(params.row.email, e.target.value)
                }
              >
                <MenuItem value="superAdmin">Kepala BPS</MenuItem>
                <MenuItem value="ketuaTim">Ketua Tim</MenuItem>
                <MenuItem value="pegawai">Pegawai</MenuItem>
              </Select>
            </FormControl>
          </>
        </form>
      ),
    },

    {
      field: 'aksi',
      headerName: 'Aksi',
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
      flex: 1,
      renderCell: (params) => (
        <Button
          variant="contained"
          color="error"
          onClick={() => {
            Swal.fire({
              title: 'Yakin Hapus Akun ' + params.row.nama + '?',
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
      ),
    },
  ];

  // const rows = [
  //   { id: 1, nama: 'Snow', role: "pegawai", email: 'Jon', nohp: 14 },
  //   { id: 2, nama: 'Lannister', role: "pegawai", email: 'Cersei', nohp: 31 },
  //   { id: 3, nama: 'Lannister', role: "pegawai", email: 'Jaime', nohp: 31 },
  //   { id: 4, nama: 'Stark', role: "pegawai", email: 'Arya', nohp: 11 },
  //   { id: 5, nama: 'Targaryen', role: "pegawai", email: 'Daenerys', nohp: null },
  //   { id: 6, nama: 'Melisandre', role: "pegawai", email: null, nohp: 150 },
  //   { id: 7, nama: 'Clifford', role: "pegawai", email: 'Ferrara', nohp: 44 },
  //   { id: 8, nama: 'Frances', role: "pegawai", email: 'Rossini', nohp: 36 },
  //   { id: 9, nama: 'Roxie', role: "pegawai", email: 'Harvey', nohp: 65 },
  // ];

  const rows = data.map((user: UserProfile, i = 1) => {
    return {
      id: user.id,
      shownId: i + 1,
      nama: user.name,
      email: user.email,
      role: user.role,
      nohp: user.nomor_hp,
    };
  });

  return (
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
          showToolbar
          disableRowSelectionOnClick
        />
      )}
    </Box>
  );
}
