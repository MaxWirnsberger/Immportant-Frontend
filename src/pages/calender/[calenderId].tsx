'use client';

import React, { useEffect, useState } from "react";
import { useRouter } from 'next/router';
import axiosInstance from "@/lib/axiosInstance";
import styles from "./calender.module.css";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { DayPicker } from "react-day-picker";
import { format, isBefore, startOfDay } from "date-fns";
import { de } from "date-fns/locale";
import { Button } from "@/components/ui/button";
import "react-day-picker/dist/style.css";

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
  const router = useRouter(); 
  const { calenderId } = router.query; 
  const [realEstateId, setRealEstateId] = useState<string>('');
  
  const [calenderData, setCalenderData] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState<boolean>(true); 
  const [error, setError] = useState<string | null>(null);

  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [selectedSlotId, setSelectedSlotId] = useState<string>('');
  const [currentYear, setCurrentYear] = useState<number>(new Date().getFullYear());
  const [currentMonth, setCurrentMonth] = useState<number>(new Date().getMonth() + 1);
  const [availableDates, setAvailableDates] = useState<string[]>([]);

  const [firstname, setFirstname] = useState<string>('');
  const [lastname, setLastname] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});

  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date);
  };

  const handleAppointmentClick = (slotId: string, time: string) => {
    setSelectedTime(time);
    setSelectedSlotId(slotId);
    setIsDialogOpen(true);
  };

  const handleBookAppointment = () => {
    if (selectedTime && selectedDate) {
      const formattedDate = format(selectedDate, "yyyy-MM-dd");
      const updatedAppointments = calenderData.map((app) =>
        app.date === formattedDate && app.start_time === selectedTime
          ? {
              ...app,
              is_fully_booked: true,
              current_bookings: app.current_bookings + 1,
            }
          : app
      );
      setCalenderData(updatedAppointments);

      const slotsLeft = updatedAppointments.filter(
        (app) => app.date === formattedDate && !app.is_fully_booked
      );
      if (slotsLeft.length === 0) {
        setAvailableDates((prev) =>
          prev.filter((date) => date !== formattedDate)
        );
      }
      setIsDialogOpen(false);
    }
  };

  const handleMonthChange = (month: Date) => {
    const year = month.getFullYear();
    const monthNumber = month.getMonth() + 1;
    setCurrentYear(year);
    setCurrentMonth(monthNumber);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errors: { [key: string]: string } = {};
    if (!firstname.trim()) errors.firstname = "Vorname ist erforderlich.";
    if (!lastname.trim()) errors.lastname = "Nachname ist erforderlich.";
    if (!email.trim()) {
      errors.email = "E-Mail ist erforderlich.";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errors.email = "Ungültige E-Mail-Adresse.";
    }
    if (!phoneNumber.trim()) {
      errors.phoneNumber = "Telefonnummer ist erforderlich.";
    } else if (!/^\+?\d{10,15}$/.test(phoneNumber)) {
      errors.phoneNumber = "Ungültige Telefonnummer.";
    }

    setFormErrors(errors);

    if (Object.keys(errors).length > 0) {
      return;
    }

    try {
      const response = await axiosInstance.post('/appointments/public/bookings/', {
        slot: selectedSlotId,
        firstname,
        lastname,
        email,
        phone_number: phoneNumber,
      }).then(() => router.push('/thankyou?type=booking'))
      setIsDialogOpen(false);
      setFirstname('');
      setLastname('');
      setEmail('');
      setPhoneNumber('');
      setFormErrors({});
      setSelectedSlotId('');
    } catch (error: any) {
      if (error.response && error.response.data) {
        alert(`Fehler: ${JSON.stringify(error.response.data)}`);
      } else {
        alert('Ein Fehler ist aufgetreten. Bitte versuchen Sie es später erneut.');
      }
    }
  };

  useEffect(() => {
    if (!router.isReady) {
      return;
    }
    const id = Array.isArray(calenderId) ? calenderId[0] : calenderId || '';
    setRealEstateId(id);

    if (id) {
      const fetchCalenderData = async () => {
        setLoading(true);
        try {
          const response = await axiosInstance.get(
            `/appointments/public/${id}/slots/?year=${currentYear}&month=${currentMonth}`
          );
          setCalenderData(response.data || []);
          const datesWithSlots: string[] = response.data.map(
            (app: Appointment) => app.date
          );
          setAvailableDates([...new Set(datesWithSlots)]);
          setError(null);
        } catch (err) {
          console.error("API error:", err);
          setError("Fehler beim Laden der Kalender-Daten");
        } finally {
          setLoading(false);
        }
      };

      fetchCalenderData();
    } else {
      setLoading(false);
    }
  }, [router.isReady, calenderId, currentYear, currentMonth]);

  if (!router.isReady || loading) {
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

  const filteredAppointments = selectedDate
    ? calenderData.filter(
        (app) => app.date === format(selectedDate, "yyyy-MM-dd")
      )
    : [];

  const disablePastDates = (date: Date) => {
    const today = startOfDay(new Date());
    return isBefore(date, today);
  };

  const modifiers = {
    available: (date: Date) => {
      const formattedDate = format(date, "yyyy-MM-dd");
      return availableDates.includes(formattedDate);
    },
  };

  return (
    <div className={styles.mainContainer}>
      <h2 className={styles.pageTitle}>Terminbuchung</h2>
      <div className={styles.calendarContainer}>
        <DayPicker
          mode="single"
          selected={selectedDate}
          onSelect={handleDateSelect}
          locale={de}
          onMonthChange={handleMonthChange}
          month={new Date(currentYear, currentMonth - 1)}
          className={styles.calendar}
          modifiers={modifiers}
          modifiersStyles={{
            available: {
              backgroundColor: "var(--main-green)",
              color: "var(--main-blue)",
            },
            selected: {
              backgroundColor: "var(--main-blue)",
              color: "white",
            },
            today: {
              backgroundColor: "#e7edff",
              color: "var(--main-blue)",
            },
            disabled: {
              backgroundColor: "#f0f0f0",
              color: "#a0a0a0",
              cursor: "not-allowed",
            },
          }}
          styles={{
            root: {
              fontSize: "1.2rem",
              padding: "1.5rem",
            },
            month: {
              margin: "0.5rem",
              padding: "1.5rem",
            },
            day: {
              margin: "0.4rem",
              width: "3rem",
              lineHeight: "3rem",
            },
          }}
          disabled={disablePastDates}
        />
        <div className={styles.appointments}>
          <h3 className={styles.appointmentTitle}>
            {selectedDate
              ? format(selectedDate, "dd. MMMM yyyy", { locale: de })
              : "Bitte wählen Sie ein Datum"}
          </h3>
          <div className={styles.appointmentsList}>
            {selectedDate ? (
              filteredAppointments.length > 0 ? (
                filteredAppointments.map((app) => (
                  <Button
                    key={app.id}
                    onClick={() => handleAppointmentClick(app.id, app.start_time)}
                    disabled={app.is_fully_booked}
                    variant={app.is_fully_booked ? "secondary" : "outline"}
                    className={`${
                      app.is_fully_booked
                        ? styles.appointmentButtonBooked
                        : styles.appointmentButtonAvailable
                    }`}
                  >
                    {app.start_time} -{" "}
                    {app.is_fully_booked ? "Gebucht" : "Verfügbar"}
                  </Button>
                ))
              ) : (
                <div>Keine verfügbaren Termine an diesem Tag.</div>
              )
            ) : (
              <div>Bitte wählen Sie ein Datum aus.</div>
            )}
          </div>
        </div>
      </div>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className={styles.dialogTitle}>
              Termin bestätigen
            </DialogTitle>
            <DialogDescription className={styles.dialogDescription}>
              Möchten Sie den folgenden Termin buchen?
              <br />
              Datum:{" "}
              {selectedDate &&
                format(selectedDate, "dd. MMMM yyyy", { locale: de })}
              <br />
              Uhrzeit: {selectedTime}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className={styles.formGroup}>
              <label htmlFor="firstname">Vorname</label>
              <input
                type="text"
                id="firstname"
                value={firstname}
                onChange={(e) => setFirstname(e.target.value)}
                required
                className={styles.inputField}
              />
              {formErrors.firstname && <span className={styles.errorText}>{formErrors.firstname}</span>}
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="lastname">Nachname</label>
              <input
                type="text"
                id="lastname"
                value={lastname}
                onChange={(e) => setLastname(e.target.value)}
                required
                className={styles.inputField}
              />
              {formErrors.lastname && <span className={styles.errorText}>{formErrors.lastname}</span>}
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="email">E-Mail</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className={styles.inputField}
              />
              {formErrors.email && <span className={styles.errorText}>{formErrors.email}</span>}
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="phoneNumber">Telefonnummer</label>
              <input
                type="tel"
                id="phoneNumber"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                required
                className={styles.inputField}
              />
              {formErrors.phoneNumber && <span className={styles.errorText}>{formErrors.phoneNumber}</span>}
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                type="button"
                onClick={() => setIsDialogOpen(false)}
                className={styles.dialogCancelButton}
              >
                Abbrechen
              </Button>
              <Button
                type="submit"
                className={styles.dialogBookButton}
              >
                Buchen
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
