'use client';
import React, { useState, useRef, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import multiMonthPlugin from '@fullcalendar/multimonth';
import {
  EventInput,
  DateSelectArg,
  EventClickArg,
  EventContentArg,
} from '@fullcalendar/core';
import { useModal } from '@/hooks/useModal';
import { Modal } from '@/components/ui/modal';
import DatePicker from '@/components/form/date-picker';
import idLocale from '@fullcalendar/core/locales/id';

import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

// import Chip from '@mui/material/Chip';
// import Box from '@mui/material/Box';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';

// swall
import Swal from 'sweetalert2';

import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

interface CalendarEvent extends EventInput {
  extendedProps: {
    calendar: string;
  };
}

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
  dibuat_oleh: {
    email: string;
  };
  timKerja: {
    id: string;
    nama: string;
  } | null;
  peserta: {
    google_event_id: string | null;
    user: UserProfile;
  }[];
}

interface GoogleEventId {
  id: string;
  name: string | null;
  google_event_id: string | null;
}

interface UserCalendar {
  id: string;
  // google_event_id: string | null;
  kegiatan: CalendarProfile; // bukan array!
}

interface Props {
  data: UserCalendar[];
}

export default function DefaultInputs({ data }: Props) {
  const router = useRouter();

  const { data: session } = useSession();
  // const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(
  //   null,
  // );
  const [eventTitle, setEventTitle] = useState('');
  const [eventId, setEventId] = useState('0');
  const [eventMaker, setEventMaker] = useState('');
  const [eventDeskripsi, setEventDeskripsi] = useState('');
  const [eventStartDate, setEventStartDate] = useState('');
  const [eventEndDate, setEventEndDate] = useState('');
  const [eventTimName, setEventTimName] = useState('');
  const [peserta, setPeserta] = useState<GoogleEventId[]>([]);
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  // const [googleId, setGoogleId] = useState<GoogleEventId[]>([]);
  const calendarRef = useRef<FullCalendar>(null);
  const { isOpen, openModal, closeModal } = useModal();

  useEffect(() => {
    if (data && data.length > 0) {
      const colors = ['success', 'primary', 'danger']; // daftar pilihan

      const mappedEvents: CalendarEvent[] = data.map((item) => {
        const kegiatan = item.kegiatan;

        // pilih acak salah satu warna
        const randomColor = colors[Math.floor(Math.random() * colors.length)];

        return {
          id: kegiatan.id.toString(),
          title: kegiatan.nama,
          start: kegiatan.tanggal_mulai.toISOString(),
          end: kegiatan.tanggal_selesai.toISOString(),
          extendedProps: {
            calendar: kegiatan.calender ? kegiatan.calender : randomColor, // isi acak
            deskripsi: kegiatan.deskripsi,
            timkerjaId: kegiatan.timKerja?.nama
              ? kegiatan.timKerja?.nama
              : 'Pribadi',
            peserta: kegiatan.peserta.map((p) => ({
              id: p.user.id,
              name: p.user.name,
              google_event_id: p.google_event_id,
            })),
            // google_event_id: kegiatan.peserta.map((p) => p.google_event_id),
            dibuat_oleh: kegiatan.dibuat_oleh.email,
            // google_event_id: item.google_event_id,
          },
        };
      });

      // const google_event_id: GoogleEventId[] = data.map((event) => ({
      //   google_event_id: event.google_event_id,
      // }));
      // setGoogleId(google_event_id);

      setEvents(mappedEvents);
    }
  }, [data]);

  const handleDateSelect = (selectInfo: DateSelectArg) => {
    console.log(selectInfo);
    resetModalFields();
    openModal();
  };

  const handleEventClick = (clickInfo: EventClickArg) => {
    const event = clickInfo.event;
    setEventId(event.id || '0');
    setEventTitle(event.title);
    setEventMaker(event.extendedProps.dibuat_oleh || '');
    setEventDeskripsi(event.extendedProps.deskripsi || '');
    setEventStartDate(event.start?.toISOString() || '');
    setEventEndDate(event.end?.toISOString() || '');
    setEventTimName(event.extendedProps.timkerjaId || '');
    setPeserta(event.extendedProps.peserta || []);
    // setGoogleId(event.extendedProps.google_event_id || []);
    openModal();
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/kegiatan/${id}`, {
        method: 'DELETE',
        body: JSON.stringify({
          google_event_id: peserta,
        }),
        headers: { 'Content-Type': 'application/json' },
      });

      if (res.ok) {
        Swal.fire({
          title: 'Berhasil Menghapus Kegiatan!',
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
          title: 'Gagal Menghapus Kegiatan!',
          text: error.error,
          icon: 'error',
          confirmButtonColor: '#d33',
          confirmButtonText: 'OK',
        });
      }
    } catch (error) {
      console.log(error);
      Swal.fire({
        title: 'Gagal Menghapus Kegiatan!',
        text: 'Coba lagi nanti',
        icon: 'error',
        confirmButtonColor: '#d33',
        confirmButtonText: 'OK',
      });
    }
  };

  // const handleAddOrUpdateEvent = () => {
  //   if (selectedEvent) {
  //     // Update existing event
  //     setEvents((prevEvents) =>
  //       prevEvents.map((event) =>
  //         event.id === selectedEvent.id
  //           ? {
  //               ...event,
  //               title: eventTitle,
  //               start: eventStartDate,
  //               end: eventEndDate,
  //               extendedProps: { calendar: eventLevel },
  //             }
  //           : event,
  //       ),
  //     );
  //   } else {
  //     // Add new event
  //     const newEvent: CalendarEvent = {
  //       id: Date.now().toString(),
  //       title: eventTitle,
  //       start: eventStartDate,
  //       end: eventEndDate,
  //       allDay: true,
  //       extendedProps: { calendar: eventLevel },
  //     };
  //     setEvents((prevEvents) => [...prevEvents, newEvent]);
  //   }
  //   closeModal();
  //   resetModalFields();
  // };

  const resetModalFields = () => {
    setEventTitle('');
    setEventStartDate('');
    setEventEndDate('');
    // setEventLevel('');
    // setSelectedEvent(null);
  };

  return (
    <div className="rounded-2xl border  border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
      <div className="custom-calendar">
        <FullCalendar
          ref={calendarRef}
          locale={idLocale}
          plugins={[
            dayGridPlugin,
            timeGridPlugin,
            interactionPlugin,
            multiMonthPlugin,
          ]}
          initialView="dayGridMonth"
          headerToolbar={{
            left: 'prev,next',
            center: 'title',
            right: 'multiMonthYear,dayGridMonth,timeGridWeek,timeGridDay',
          }}
          events={events}
          selectable={true}
          select={handleDateSelect}
          eventClick={handleEventClick}
          eventContent={renderEventContent}
          // customButtons={{
          //   addEventButton: {
          //     text: "Add Event +",
          //     click: openModal,
          //   },
          // }}
        />
      </div>
      <Modal
        isOpen={isOpen}
        onClose={closeModal}
        className="max-w-[700px] p-6 lg:p-10"
      >
        <div className="flex flex-col px-2 overflow-y-auto custom-scrollbar">
          <div>
            {/* <h5 className="mb-2 font-semibold text-gray-800 modal-title text-theme-xl dark:text-white/90 lg:text-2xl">
              {selectedEvent ? 'Edit Event' : 'Add Event'}
            </h5> */}
            {/* <p className="text-sm text-gray-500 dark:text-gray-400">
              Plan your next big moment: schedule or edit an event to stay on
              track
            </p> */}
          </div>
          <div className="mt-2">
            <div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                  Nama Kegiatan
                </label>
                <input
                  disabled
                  id="event-title"
                  type="text"
                  value={eventTitle}
                  onChange={(e) => setEventTitle(e.target.value)}
                  className="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
                />
              </div>
            </div>
            <div className="mt-3">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                  Deskripsi Kegiatan
                </label>
                <input
                  disabled
                  id="event-title"
                  type="text"
                  value={eventDeskripsi}
                  onChange={(e) => setEventDeskripsi(e.target.value)}
                  className="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
                />
              </div>
            </div>
            {/* <div className="mt-3">
              <label className="block mb-4 text-sm font-medium text-gray-700 dark:text-gray-400">
                Warna Kegiatan
              </label>
              <div className="flex flex-wrap items-center gap-4 sm:gap-5">
                {Object.entries(calendarsEvents).map(([key, value]) => (
                  <div key={key} className="n-chk">
                    <div
                      className={`form-check form-check-${value} form-check-inline`}
                    >
                      <label
                        className="flex items-center text-sm text-gray-700 form-check-label dark:text-gray-400"
                        htmlFor={`modal${key}`}
                      >
                        <span className="relative">
                          <input
                            className="sr-only form-check-input"
                            type="radio"
                            name="event-level"
                            disabled
                            value={key}
                            id={`modal${key}`}
                            checked={eventLevel === key}
                            onChange={() => setEventLevel(key)}
                          />
                          <span className="flex items-center justify-center w-5 h-5 mr-2 border border-gray-300 rounded-full box dark:border-gray-700">
                            <span
                              className={`h-2 w-2 rounded-full bg-white ${
                                eventLevel === key ? 'block' : 'hidden'
                              }`}
                            ></span>
                          </span>
                        </span>
                        {key}
                      </label>
                    </div>
                  </div>
                ))}
              </div>
            </div> */}

            <div className="mt-3">
              <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                Tanggal Mulai
              </label>
              <div>
                <DatePicker
                  id="date-picker"
                  value={eventStartDate}
                  placeholder="Select a date"
                  disabled
                  onChange={(dates, currentDateString) => {
                    // Handle your logic
                    console.log({ dates, currentDateString });
                  }}
                />
              </div>
            </div>

            <div className="mt-3">
              <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                Tanggal Berhenti
              </label>
              <DatePicker
                id="date-picker"
                value={eventEndDate}
                disabled
                placeholder="Select a date"
                onChange={(dates, currentDateString) => {
                  // Handle your logic
                  console.log({ dates, currentDateString });
                }}
              />
            </div>
            <div className="mt-3">
              <FormControl variant="standard" fullWidth disabled>
                <InputLabel id="demo-multiple-chip-label">Tim Kerja</InputLabel>
                <Select
                  labelId="demo-multiple-chip-label"
                  id="demo-multiple-chip"
                  value={eventTimName}
                  // renderValue={
                  //   <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  //     <Chip label={eventTimName} />
                  //   </Box>
                  // }
                >
                  <MenuItem
                    value={eventTimName}
                    // style={getStyles(name, personName, theme)}
                  >
                    {eventTimName}
                  </MenuItem>
                </Select>
              </FormControl>
            </div>

            <div className="mt-3">
              <Autocomplete
                disabled
                multiple
                id="anggota-tim"
                options={peserta}
                getOptionLabel={(option) => option.name || ''}
                value={peserta}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    variant="standard"
                    label="Peserta Kegiatan"
                    placeholder="Pilih anggota"
                  />
                )}
              />
            </div>
          </div>
          {eventMaker === session?.user?.email ? (
            <div className="flex items-center gap-3 mt-6 modal-footer sm:justify-end">
              <button
                onClick={() => {
                  closeModal();
                  Swal.fire({
                    title: 'Yakin hapus kegiatan ' + eventTitle + '?',
                    text: '',
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonColor: '#3085d6',
                    cancelButtonColor: '#d33',
                    confirmButtonText: 'Ya, Hapus',
                  }).then((result) => {
                    if (result.isConfirmed) {
                      handleDelete(eventId);
                    }
                  });
                }}
                type="button"
                className="flex w-full justify-center rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] sm:w-auto"
              >
                Hapus
              </button>
              <button
                onClick={() => router.push(`/form-kegiatan/edit/${eventId}`)}
                type="button"
                className="flex w-full justify-center rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] sm:w-auto"
              >
                Edit
              </button>
              {/* <button
              onClick={handleAddOrUpdateEvent}
              type="button"
              className="btn btn-success btn-update-event flex w-full justify-center rounded-lg bg-brand-500 px-4 py-2.5 text-sm font-medium text-white hover:bg-brand-600 sm:w-auto"
            >
              {selectedEvent ? 'Update Changes' : 'Add Event'}
            </button> */}
            </div>
          ) : null}
        </div>
      </Modal>
    </div>
  );
}

const renderEventContent = (eventInfo: EventContentArg) => {
  const colorClass = `fc-bg-${eventInfo.event.extendedProps.calendar.toLowerCase()}`;
  return (
    <div
      className={`event-fc-color flex fc-event-main ${colorClass} p-1 rounded-sm`}
    >
      <div className="fc-daygrid-event-dot"></div>
      <div className="fc-event-time">{eventInfo.timeText}</div>
      <div className="fc-event-title">{eventInfo.event.title}</div>
    </div>
  );
};
