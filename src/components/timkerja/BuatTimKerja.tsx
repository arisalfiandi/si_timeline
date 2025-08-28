'use client';
import * as React from 'react';
import { Button } from '@mui/material';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
// import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Chip from '@mui/material/Chip';
import Box from '@mui/material/Box';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
// import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { PlusIcon } from '@/icons';

// swall
import Swal from 'sweetalert2';

interface UserProfile {
  id: string;
  name: string | null;
}

interface Props {
  data: UserProfile[];
}

export default function BuatTimKerja({ data }: Props) {
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  // state form
  const [namaTim, setNamaTim] = React.useState<string>('');
  const [ketuaTim, setKetuaTim] = React.useState<string | null>(null);
  const [anggota, setAnggota] = React.useState<UserProfile[]>([]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      const res = await fetch('/api/tim', {
        method: 'POST',
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
          title: 'Berhasil Membuat Tim Kerja',
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
          title: 'Gagal Membuat Tim Kerja',
          text: 'Coba lagi nanti',
          icon: 'error',
          confirmButtonColor: '#d33',
          confirmButtonText: 'OK',
        });
      }
    } catch (error) {
      console.log(error);
      Swal.fire({
        title: 'Gagal Membuat Tim Kerja',
        text: 'Coba lagi nanti',
        icon: 'error',
        confirmButtonColor: '#d33',
        confirmButtonText: 'OK',
      });
    }
  };

  return (
    <>
      <Button
        sx={{ mr: 2 }}
        variant="contained"
        color="info"
        onClick={handleClickOpen}
      >
        <PlusIcon /> {' ' + ' Buat Tim Kerja'}
      </Button>
      <Dialog open={open} onClose={handleClose} fullWidth>
        <DialogTitle>Buat Tim Kerja</DialogTitle>
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
                  value={anggota}
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
          <Button type="submit" variant="contained" form="subscription-form">
            Kirim
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
