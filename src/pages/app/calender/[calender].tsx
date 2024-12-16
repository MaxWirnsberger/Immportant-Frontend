// // 'use client';

// // import React, { useEffect, useState } from 'react';
// // import axiosInstance from '@/lib/axiosInstance';
// // import styles from './calender.module.css';
// // import globalstyle from '../globalApp.module.css';
// // import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
// // import { Calendar } from '@/components/ui/calendar';
// // import { format } from 'date-fns';
// // import { de } from 'date-fns/locale';

// // interface Appointment {
// //   id: string;
// //   daily_availability: string;
// //   date: string;
// //   start_time: string;
// //   end_time: string;
// //   max_bookings: number;
// //   is_mass_viewing: boolean;
// //   current_bookings: number;
// //   is_fully_booked: boolean;
// // }

// // export default function CalenderPage() {
// //   const [calenderData, setCalenderData] = useState<Appointment[] | null>(null);
// //   const [loading, setLoading] = useState<boolean>(false);
// //   const [error, setError] = useState<string | null>(null);
// //   const realEstateId = sessionStorage.getItem('selectedRealEstateId') || '';

// //   const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
// //   const [isDialogOpen, setIsDialogOpen] = useState(false);
// //   const [selectedTime, setSelectedTime] = useState<string | null>(null);

// //   const handleDateSelect = (date: Date | undefined) => {
// //     setSelectedDate(date);
// //   };

// //   const handleAppointmentClick = (time: string) => {
// //     setSelectedTime(time);
// //     setIsDialogOpen(true);
// //   };

// //   const handleBookAppointment = () => {
// //     if (selectedTime && calenderData) {
// //       const updatedAppointments = calenderData.map((app) =>
// //         app.start_time === selectedTime ? { ...app, is_fully_booked: true, current_bookings: app.current_bookings + 1 } : app
// //       );
// //       setCalenderData(updatedAppointments);
// //       setIsDialogOpen(false);
// //     }
// //   };

// //   useEffect(() => {
// //     const fetchCalenderData = async () => {
// //       setLoading(true);
// //       try {
// //         const currentDate = new Date();
// //         const currentYear = currentDate.getFullYear();
// //         const currentMonth = currentDate.getMonth() + 1;
// //         const response = await axiosInstance.get(`/appointments/public/${realEstateId}/slots/?year=${currentYear}&month=${currentMonth}`);
// //         setCalenderData(response.data);
// //         setLoading(false);
// //       } catch (err) {
// //         setError('Fehler beim Laden der Kalender-Daten');
// //         setLoading(false);
// //       }
// //     };

// //     if (realEstateId) {
// //       fetchCalenderData();
// //     } else {
// //       setError('Keine Immobilie ausgewählt.');
// //       setLoading(false);
// //     }
// //   }, [realEstateId]);

// //   if (loading) {
// //     return (
// //       <div className={globalstyle.appMainContainer}>
// //         <div className={styles.calenderContainer}>
// //           <div className={styles.calenderHeader}>
// //             <h2 className={styles.pageTitle}>Kalender</h2>
// //           </div>
// //           <div>Lade Daten...</div>
// //         </div>
// //       </div>
// //     );
// //   }

// //   if (error) {
// //     return (
// //       <div className={globalstyle.appMainContainer}>
// //         <div className={styles.calenderContainer}>
// //           <div className={styles.calenderHeader}>
// //             <h2 className={styles.pageTitle}>Kalender</h2>
// //           </div>
// //           <div>{error}</div>
// //         </div>
// //       </div>
// //     );
// //   }

// //   if (!calenderData || calenderData.length === 0) {
// //     return (
// //       <div className={globalstyle.appMainContainer}>
// //         <div className={styles.calenderContainer}>
// //           <div className={styles.calenderHeader}>
// //             <h2 className={styles.pageTitle}>Kalender</h2>
// //           </div>
// //           <div>Keine Daten verfügbar</div>
// //         </div>
// //       </div>
// //     );
// //   }

// //   const filteredAppointments = selectedDate
// //     ? calenderData.filter((app) => app.date === format(selectedDate, 'yyyy-MM-dd'))
// //     : [];

// //   return (
// //     <div className={globalstyle.appMainContainer}>
// //       <div className={styles.calenderContainer}>
// //         <div className={styles.calenderHeader}>
// //           <h2 className={styles.pageTitle}>Kalender</h2>
// //         </div>
// //         <div className={styles.container}>
// //           <Calendar
// //             mode="single"
// //             selected={selectedDate}
// //             onSelect={handleDateSelect}
// //             locale={de}
// //             className={styles.calendar}
// //             classNames={{
// //               day_selected: styles['calendar-day-selected'],
// //               day_today: styles['calendar-day-today'],
// //             }}
// //           />
// //           <div className={styles.appointments}>
// //             <h2 className={styles['appointment-title']}>
// //               {selectedDate && format(selectedDate, 'dd. MMMM yyyy', { locale: de })}
// //             </h2>
// //             <div>
// //               {filteredAppointments.map((app) => (
// //                 <button
// //                   key={app.id}
// //                   onClick={() => handleAppointmentClick(app.start_time)}
// //                   disabled={app.is_fully_booked}
// //                   className={`${styles['appointment-button']} ${
// //                     app.is_fully_booked
// //                       ? styles['appointment-button-booked']
// //                       : styles['appointment-button-available']
// //                   }`}
// //                 >
// //                   {app.start_time} - {app.is_fully_booked ? 'Gebucht' : 'Verfügbar'}
// //                 </button>
// //               ))}
// //             </div>
// //           </div>
// //           <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
// //             <DialogContent>
// //               <DialogHeader>
// //                 <DialogTitle className={styles['dialog-title']}>
// //                   Termin bestätigen
// //                 </DialogTitle>
// //                 <DialogDescription className={styles['dialog-description']}>
// //                   Möchten Sie den folgenden Termin buchen?
// //                   <br />
// //                   Datum: {selectedDate && format(selectedDate, 'dd. MMMM yyyy', { locale: de })}
// //                   <br />
// //                   Uhrzeit: {selectedTime}
// //                 </DialogDescription>
// //               </DialogHeader>
// //               <DialogFooter>
// //                 <button
// //                   onClick={() => setIsDialogOpen(false)}
// //                   className={styles['dialog-cancel-button']}
// //                 >
// //                   Abbrechen
// //                 </button>
// //                 <button
// //                   onClick={handleBookAppointment}
// //                   className={styles['dialog-book-button']}
// //                 >
// //                   Buchen
// //                 </button>
// //               </DialogFooter>
// //             </DialogContent>
// //           </Dialog>
// //         </div>
// //       </div>
// //     </div>
// //   );
// // }

// 'use client';

// import React, { useEffect, useState } from 'react';
// import axiosInstance from '@/lib/axiosInstance';
// import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
// import { Calendar } from '@/components/ui/calendar';
// import { format } from 'date-fns';
// import { de } from 'date-fns/locale';
// import { Button } from '@/components/ui/button';

// interface Appointment {
//   id: string;
//   daily_availability: string;
//   date: string;
//   start_time: string;
//   end_time: string;
//   max_bookings: number;
//   is_mass_viewing: boolean;
//   current_bookings: number;
//   is_fully_booked: boolean;
// }

// export default function CalenderPage() {
//   const [calenderData, setCalenderData] = useState<Appointment[]>([]);
//   const [loading, setLoading] = useState<boolean>(false);
//   const [error, setError] = useState<string | null>(null);
//   const realEstateId = sessionStorage.getItem('selectedRealEstateId') || '';

//   const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
//   const [isDialogOpen, setIsDialogOpen] = useState(false);
//   const [selectedTime, setSelectedTime] = useState<string | null>(null);

//   const handleDateSelect = (date: Date | undefined) => {
//     setSelectedDate(date);
//   };

//   const handleAppointmentClick = (time: string) => {
//     setSelectedTime(time);
//     setIsDialogOpen(true);
//   };

//   const handleBookAppointment = () => {
//     if (selectedTime) {
//       const updatedAppointments = calenderData.map((app) =>
//         app.start_time === selectedTime ? { ...app, is_fully_booked: true, current_bookings: app.current_bookings + 1 } : app
//       );
//       setCalenderData(updatedAppointments);
//       setIsDialogOpen(false);
//     }
//   };

//   useEffect(() => {
//     const fetchCalenderData = async () => {
//       setLoading(true);
//       try {
//         const currentDate = new Date();
//         const currentYear = currentDate.getFullYear();
//         const currentMonth = currentDate.getMonth() + 1;
//         const response = await axiosInstance.get(`/appointments/public/${realEstateId}/slots/?year=${currentYear}&month=${currentMonth}`);
//         setCalenderData(response.data || []);
//         setLoading(false);
//       } catch (err) {
//         setError('Fehler beim Laden der Kalender-Daten');
//         setLoading(false);
//       }
//     };

//     if (realEstateId) {
//       fetchCalenderData();
//     } else {
//       setError('Keine Immobilie ausgewählt.');
//       setLoading(false);
//     }
//   }, [realEstateId]);

//   if (loading) {
//     return (
//       <div className="flex flex-col items-center justify-center min-h-screen text-primary">
//         <h2 className="text-2xl font-bold mb-4">Kalender</h2>
//         <div>Lade Daten...</div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="flex flex-col items-center justify-center min-h-screen text-primary">
//         <h2 className="text-2xl font-bold mb-4">Kalender</h2>
//         <div>{error}</div>
//       </div>
//     );
//   }

//   if (calenderData.length === 0) {
//     return (
//       <div className="flex flex-col items-center justify-center min-h-screen text-primary">
//         <h2 className="text-2xl font-bold mb-4">Kalender</h2>
//         <div>Keine Daten verfügbar</div>
//       </div>
//     );
//   }

//   const filteredAppointments = selectedDate
//     ? calenderData.filter((app) => app.date === format(selectedDate, 'yyyy-MM-dd'))
//     : [];

//   return (
//     <div className="flex flex-col items-center p-8 text-primary">
//       <h1 className="text-3xl font-bold text-primary mb-8">Terminbuchung</h1>
//       <div className="flex flex-col md:flex-row space-y-8 md:space-y-0 md:space-x-8">
//         <Calendar
//           mode="single"
//           selected={selectedDate}
//           onSelect={handleDateSelect}
//           locale={de}
//           className="rounded-md border shadow bg-white"
//           classNames={{
//             day_selected: "bg-primary text-white hover:bg-primary hover:text-white focus:bg-primary focus:text-white",
//             day_today: "bg-primary text-white",
//           }}
//         />
//         <div className="w-full md:w-64 space-y-4">
//           <h2 className="text-xl font-semibold text-primary">
//             {selectedDate && format(selectedDate, 'dd. MMMM yyyy', { locale: de })}
//           </h2>
//           <div className="space-y-2">
//             {filteredAppointments.map((app) => (
//               <Button
//                 key={app.id}
//                 onClick={() => handleAppointmentClick(app.start_time)}
//                 disabled={app.is_fully_booked}
//                 variant={app.is_fully_booked ? 'secondary' : 'outline'}
//                 className={`w-full justify-start ${
//                   app.is_fully_booked
//                     ? "bg-gray-200 text-primary cursor-not-allowed"
//                     : "bg-accent text-primary hover:bg-accent/80"
//                 }`}
//               >
//                 {app.start_time} - {app.is_fully_booked ? 'Gebucht' : 'Verfügbar'}
//               </Button>
//             ))}
//           </div>
//         </div>
//       </div>
//       <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
//         <DialogContent>
//           <DialogHeader>
//             <DialogTitle className="text-primary">Termin bestätigen</DialogTitle>
//             <DialogDescription className="text-primary">
//               Möchten Sie den folgenden Termin buchen?
//               <br />
//               Datum: {selectedDate && format(selectedDate, 'dd. MMMM yyyy', { locale: de })}
//               <br />
//               Uhrzeit: {selectedTime}
//             </DialogDescription>
//           </DialogHeader>
//           <DialogFooter>
//             <Button
//               variant="outline"
//               onClick={() => setIsDialogOpen(false)}
//               className="border-primary text-primary hover:bg-primary/10"
//             >
//               Abbrechen
//             </Button>
//             <Button
//               onClick={handleBookAppointment}
//               className="bg-accent text-primary hover:bg-accent/80"
//             >
//               Buchen
//             </Button>
//           </DialogFooter>
//         </DialogContent>
//       </Dialog>
//     </div>
//   );
// }

'use client';

import React, { useEffect, useState } from 'react';
import axiosInstance from '@/lib/axiosInstance';
import styles from './calender.module.css';
import globalstyle from '../globalApp.module.css';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { de } from 'date-fns/locale';
import { Button } from '@/components/ui/button';

interface Appointment {
  id: string;
  daily_availability: string;
  date: string;
  start_time: string;
  end_time: string;
  max_bookings: number;
  is_mass_viewing: boolean;
  current_bookings: number;
  is_fully_booked: boolean;
}

export default function CalenderPage() {
  const [calenderData, setCalenderData] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const realEstateId = sessionStorage.getItem('selectedRealEstateId') || '';

  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);

  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date);
  };

  const handleAppointmentClick = (time: string) => {
    setSelectedTime(time);
    setIsDialogOpen(true);
  };

  const handleBookAppointment = () => {
    if (selectedTime) {
      const updatedAppointments = calenderData.map((app) =>
        app.start_time === selectedTime ? { ...app, is_fully_booked: true, current_bookings: app.current_bookings + 1 } : app
      );
      setCalenderData(updatedAppointments);
      setIsDialogOpen(false);
    }
  };

  useEffect(() => {
    const fetchCalenderData = async () => {
      setLoading(true);
      try {
        const currentDate = new Date();
        const currentYear = currentDate.getFullYear();
        const currentMonth = currentDate.getMonth() + 1;
        const response = await axiosInstance.get(`/appointments/public/${realEstateId}/slots/?year=${currentYear}&month=${currentMonth}`);
        setCalenderData(response.data || []);
        setLoading(false);
      } catch (err) {
        setError('Fehler beim Laden der Kalender-Daten');
        setLoading(false);
      }
    };

    if (realEstateId) {
      fetchCalenderData();
    } else {
      setError('Keine Immobilie ausgewählt.');
      setLoading(false);
    }
  }, [realEstateId]);

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <h2 className={styles.loadingText}>Kalender</h2>
        <div>Lade Daten...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.errorContainer}>
        <h2 className={styles.errorText}>Kalender</h2>
        <div>{error}</div>
      </div>
    );
  }

  if (calenderData.length === 0) {
    return (
      <div className={styles.noDataContainer}>
        <h2 className={styles.noDataText}>Kalender</h2>
        <div>Keine Daten verfügbar</div>
      </div>
    );
  }

  const filteredAppointments = selectedDate
    ? calenderData.filter((app) => app.date === format(selectedDate, 'yyyy-MM-dd'))
    : [];

  return (
    <div className={styles.mainContainer}>
      <h1 className={styles.pageTitle}>Terminbuchung</h1>
      <div className={styles.calendarContainer}>
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={handleDateSelect}
          locale={de}
          className={styles.calendar}
          classNames={{
            day_selected: styles.day_selected,
            day_today: styles.day_today,
          }}
        />
        <div className={styles.appointments}>
          <h2 className={styles.appointmentTitle}>
            {selectedDate && format(selectedDate, 'dd. MMMM yyyy', { locale: de })}
          </h2>
          <div className={styles.appointmentsList}>
            {filteredAppointments.map((app) => (
              <Button
                key={app.id}
                onClick={() => handleAppointmentClick(app.start_time)}
                disabled={app.is_fully_booked}
                variant={app.is_fully_booked ? 'secondary' : 'outline'}
                className={`${app.is_fully_booked ? styles.appointmentButtonBooked : styles.appointmentButtonAvailable}`}
              >
                {app.start_time} - {app.is_fully_booked ? 'Gebucht' : 'Verfügbar'}
              </Button>
            ))}
          </div>
        </div>
      </div>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className={styles.dialogTitle}>Termin bestätigen</DialogTitle>
            <DialogDescription className={styles.dialogDescription}>
              Möchten Sie den folgenden Termin buchen?
              <br />
              Datum: {selectedDate && format(selectedDate, 'dd. MMMM yyyy', { locale: de })}
              <br />
              Uhrzeit: {selectedTime}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDialogOpen(false)}
              className={styles.dialogCancelButton}
            >
              Abbrechen
            </Button>
            <Button
              onClick={handleBookAppointment}
              className={styles.dialogBookButton}
            >
              Buchen
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
