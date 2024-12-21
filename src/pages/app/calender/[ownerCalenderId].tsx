"use client";

import React, { useEffect, useState } from "react";
import { format } from "date-fns";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import axiosInstance from "@/lib/axiosInstance";
import { useRouter } from "next/router";
import globalstyle from "../globalApp.module.css";
import styles from "./ownerCalender.module.css";

import {
  BackendAvailability,
  BackendSlot,
  Slot,
  Availability,
  Booking,
  NewAvailabilityState
} from "@/components/appComponents/ownerCalender/types";

import { BookingsTab } from "@/components/appComponents/ownerCalender/BookingsTab";
import { AvailabilityTab } from "@/components/appComponents/ownerCalender/AvailabilityTab";
import { CancelBookingDialog } from "@/components/appComponents/ownerCalender/CancelBookingDialog";
import { DeleteAvailabilityDialog } from "@/components/appComponents/ownerCalender/DeleteAvailabilityDialog";
import { DeleteSlotDialog } from "@/components/appComponents/ownerCalender/DeleteSlotDialog";

function OwnerCalendarPage() {
  const router = useRouter();
  const { ownerCalenderId } = router.query;
  const realEstateId = Array.isArray(ownerCalenderId)
    ? ownerCalenderId[0]
    : ownerCalenderId || "";

  const [slots, setSlots] = useState<Slot[]>([]);
  const [availabilities, setAvailabilities] = useState<Availability[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [newAvailability, setNewAvailability] = useState<NewAvailabilityState>({
    date: "",
    startTime: "",
    endTime: "",
    appointmentLength: 30,
    maxBookingsPerSlot: 1,
    massViewingsEnabled: false,
    cancellationDeadlineHours: 0,
  });
  const [editingAvailability, setEditingAvailability] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState<boolean>(false);
  const [availabilityToDelete, setAvailabilityToDelete] = useState<string | null>(null);
  const [deleteAvailabilityError, setDeleteAvailabilityError] = useState<string | null>(null);
  const [deleteAvailabilityLoading, setDeleteAvailabilityLoading] = useState<boolean>(false);

  const [isCancelDialogOpen, setIsCancelDialogOpen] = useState<boolean>(false);
  const [bookingToCancel, setBookingToCancel] = useState<string | null>(null);
  const [cancelError, setCancelError] = useState<string | null>(null);
  const [cancelLoading, setCancelLoading] = useState<boolean>(false);

  const [isDeleteSlotDialogOpen, setIsDeleteSlotDialogOpen] = useState<boolean>(false);
  const [slotToDelete, setSlotToDelete] = useState<string | null>(null);
  const [deleteSlotError, setDeleteSlotError] = useState<string | null>(null);
  const [deleteSlotLoading, setDeleteSlotLoading] = useState<boolean>(false);

  const [activeTab, setActiveTab] = useState<"bookings" | "availability">("bookings");
  const [availableDates, setAvailableDates] = useState<string[]>([]);
  const [displayedMonth, setDisplayedMonth] = useState<Date>(new Date());

  const fetchAvailabilities = async () => {
    try {
      const response = await axiosInstance.get<BackendAvailability[]>(
        `/appointments/properties/${realEstateId}/availabilities/`
      );
      setAvailabilities(response.data);
      const datesWithAvailability = response.data.map((a) => a.date);
      setAvailableDates([...new Set(datesWithAvailability)]);
      setError(null);
    } catch (err: any) {
      console.error("Fehler beim Laden der Verfügbarkeiten:", err);
      setError("Fehler beim Laden der Verfügbarkeiten.");
    }
  };

  const fetchSlotsByDate = async (date: Date) => {
    setLoading(true);
    try {
      const year = date.getFullYear();
      const month = date.getMonth() + 1;
      const day = date.getDate();

      const response = await axiosInstance.get<BackendSlot[]>(
        `/appointments/properties/${realEstateId}/slots/`,
        {
          params: { year, month, day },
        }
      );

      const mappedSlots: Slot[] = response.data.map((slot) => ({
        id: slot.id,
        daily_availability: slot.daily_availability,
        date: slot.date,
        start_time: slot.start_time,
        end_time: slot.end_time,
        max_bookings: slot.max_bookings,
        is_mass_viewing: slot.is_mass_viewing,
        bookings: slot.bookings.map((b) => ({
          id: b.id,
          firstname: b.firstname,
          lastname: b.lastname,
          email: b.email,
          phoneNumber: b.phone_number,
          bookedAt: new Date(b.booked_at),
          reminderSent: b.reminder_sent,
          cancelled: b.cancelled,
          token: b.token,
        })),
      }));
      setSlots(mappedSlots);
      setError(null);
    } catch (err: any) {
      console.error("Fehler beim Laden der Slots:", err);
      setError("Fehler beim Laden der Slots.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!realEstateId) return;
    fetchAvailabilities();
  }, [realEstateId]);

  useEffect(() => {
    if (!realEstateId) return;
    if (activeTab === "bookings" && selectedDate) {
      const formattedSelectedDate = format(selectedDate, "yyyy-MM-dd");
      if (availableDates.includes(formattedSelectedDate)) {
        fetchSlotsByDate(selectedDate);
      } else {
        setSlots([]);
      }
    }
  }, [realEstateId, activeTab, selectedDate, availableDates]);

  const handleTabChange = (tab: string) => {
    if (tab === "bookings" || tab === "availability") {
      setActiveTab(tab as "bookings" | "availability");
    }
  };

  const handleAddAvailability = async () => {
    const {
      date,
      startTime,
      endTime,
      appointmentLength,
      maxBookingsPerSlot,
      massViewingsEnabled,
      cancellationDeadlineHours,
    } = newAvailability;

    if (date && startTime && endTime) {
      const start = new Date(`${date}T${startTime}`);
      const end = new Date(`${date}T${endTime}`);

      if (start >= end) {
        alert("Die Startzeit muss vor der Endzeit liegen.");
        return;
      }

      if (
        appointmentLength <= 0 ||
        maxBookingsPerSlot <= 0 ||
        cancellationDeadlineHours < 0
      ) {
        alert("Bitte gültige positive Werte eingeben.");
        return;
      }

      try {
        const availabilityData = {
          date,
          start_time: `${startTime}:00`,
          end_time: `${endTime}:00`,
          appointment_length: appointmentLength,
          max_bookings_per_slot: maxBookingsPerSlot,
          mass_viewings_enabled: massViewingsEnabled,
          cancellation_deadline_hours: cancellationDeadlineHours,
        };
        const response = await axiosInstance.post<BackendAvailability>(
          `/appointments/properties/${realEstateId}/availabilities/`,
          availabilityData
        );
        setAvailabilities([...availabilities, response.data]);
        setAvailableDates((prev) => [...prev, response.data.date]);
        setNewAvailability({
          date: "",
          startTime: "",
          endTime: "",
          appointmentLength: 30,
          maxBookingsPerSlot: 1,
          massViewingsEnabled: false,
          cancellationDeadlineHours: 0,
        });
      } catch (err: any) {
        console.error("Fehler beim Hinzufügen der Verfügbarkeit:", err);
        alert("Fehler beim Hinzufügen der Verfügbarkeit.");
      }
    } else {
      alert("Bitte alle Felder ausfüllen.");
    }
  };

  const handleEditAvailability = (id: string) => {
    setEditingAvailability(id);
    const availabilityToEdit = availabilities.find((a) => a.id === id);
    if (availabilityToEdit) {
      setNewAvailability({
        date: availabilityToEdit.date,
        startTime: availabilityToEdit.start_time.slice(0, 5),
        endTime: availabilityToEdit.end_time.slice(0, 5),
        appointmentLength: availabilityToEdit.appointment_length,
        maxBookingsPerSlot: availabilityToEdit.max_bookings_per_slot,
        massViewingsEnabled: availabilityToEdit.mass_viewings_enabled,
        cancellationDeadlineHours: availabilityToEdit.cancellation_deadline_hours,
      });
    }
  };

  const handleUpdateAvailability = async () => {
    if (editingAvailability) {
      const {
        date,
        startTime,
        endTime,
        appointmentLength,
        maxBookingsPerSlot,
        massViewingsEnabled,
        cancellationDeadlineHours,
      } = newAvailability;

      if (date && startTime && endTime) {
        const start = new Date(`${date}T${startTime}`);
        const end = new Date(`${date}T${endTime}`);

        if (start >= end) {
          alert("Die Startzeit muss vor der Endzeit liegen.");
          return;
        }

        if (
          appointmentLength <= 0 ||
          maxBookingsPerSlot <= 0 ||
          cancellationDeadlineHours < 0
        ) {
          alert("Bitte gültige positive Werte eingeben.");
          return;
        }

        try {
          const availabilityData = {
            date,
            start_time: `${startTime}:00`,
            end_time: `${endTime}:00`,
            appointment_length: appointmentLength,
            max_bookings_per_slot: maxBookingsPerSlot,
            mass_viewings_enabled: massViewingsEnabled,
            cancellation_deadline_hours: cancellationDeadlineHours,
          };
          const response = await axiosInstance.put<BackendAvailability>(
            `/appointments/properties/${realEstateId}/availabilities/${editingAvailability}/`,
            availabilityData
          );
          setAvailabilities(
            availabilities.map((a) =>
              a.id === editingAvailability ? response.data : a
            )
          );

          const oldAvailability = availabilities.find(
            (a) => a.id === editingAvailability
          );

          if (oldAvailability && response.data.date !== oldAvailability.date) {
            setAvailableDates((prev) => [
              ...prev.filter((d) => d !== oldAvailability.date),
              response.data.date,
            ]);
          }

          setEditingAvailability(null);
          setNewAvailability({
            date: "",
            startTime: "",
            endTime: "",
            appointmentLength: 30,
            maxBookingsPerSlot: 1,
            massViewingsEnabled: false,
            cancellationDeadlineHours: 0,
          });
        } catch (err: any) {
          console.error("Fehler beim Aktualisieren der Verfügbarkeit:", err);
          alert("Fehler beim Aktualisieren der Verfügbarkeit.");
        }
      } else {
        alert("Bitte alle Felder ausfüllen.");
      }
    }
  };

  const handleDeleteAvailability = async (id: string) => {
    try {
      const deletedAvailability = availabilities.find((a) => a.id === id);
      await axiosInstance.delete(
        `/appointments/properties/${realEstateId}/availabilities/${id}/`
      );
      setAvailabilities(availabilities.filter((a) => a.id !== id));
      if (deletedAvailability) {
        const exists = availabilities.some(
          (a) => a.date === deletedAvailability.date && a.id !== id
        );
        if (!exists) {
          setAvailableDates((prev) =>
            prev.filter((date) => date !== deletedAvailability.date)
          );
        }
      }
      setDeleteAvailabilityError(null);
    } catch (err: any) {
      console.error("Fehler beim Löschen der Verfügbarkeit:", err);
      setDeleteAvailabilityError(
        err.response?.data?.detail || "Fehler beim Löschen der Verfügbarkeit."
      );
      throw err;
    }
  };

  const handleOpenDeleteDialog = (id: string) => {
    setAvailabilityToDelete(id);
    setDeleteAvailabilityError(null);
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (availabilityToDelete) {
      setDeleteAvailabilityLoading(true);
      try {
        await handleDeleteAvailability(availabilityToDelete);
        setIsDeleteDialogOpen(false);
      } catch (err: any) {
      } finally {
        setDeleteAvailabilityLoading(false);
        setAvailabilityToDelete(null);
      }
    }
  };

  const handleCancelDelete = () => {
    setIsDeleteDialogOpen(false);
    setAvailabilityToDelete(null);
    setDeleteAvailabilityError(null);
  };

  const handleOpenCancelDialogBooking = (bookingId: string) => {
    setBookingToCancel(bookingId);
    setCancelError(null);
    setIsCancelDialogOpen(true);
  };

  const handleConfirmCancel = async () => {
    if (bookingToCancel) {
      setCancelLoading(true);
      try {
        const propertyId = realEstateId;
        await axiosInstance.delete(
          `/appointments/properties/${propertyId}/bookings/${bookingToCancel}/cancel/`
        );
        setSlots((prevSlots) =>
          prevSlots.map((slot) => ({
            ...slot,
            bookings: slot.bookings.map((booking) =>
              booking.id === bookingToCancel
                ? { ...booking, cancelled: true }
                : booking
            ),
          }))
        );
        setCancelError(null);
        setIsCancelDialogOpen(false);
        setBookingToCancel(null);
      } catch (err: any) {
        console.error("Fehler beim Absagen der Buchung:", err);
        setCancelError(
          err.response?.data?.detail || "Fehler beim Absagen der Buchung."
        );
      } finally {
        setCancelLoading(false);
      }
    }
  };

  const handleCancelDialogClose = () => {
    setIsCancelDialogOpen(false);
    setBookingToCancel(null);
    setCancelError(null);
  };

  const handleOpenDeleteSlotDialog = (slotId: string) => {
    setSlotToDelete(slotId);
    setDeleteSlotError(null);
    setIsDeleteSlotDialogOpen(true);
  };

  const handleConfirmDeleteSlot = async () => {
    if (slotToDelete) {
      setDeleteSlotLoading(true);
      try {
        await axiosInstance.delete(
          `/appointments/properties/${realEstateId}/slots/${slotToDelete}/`
        );
        setSlots((prevSlots) => prevSlots.filter((slot) => slot.id !== slotToDelete));
        setIsDeleteSlotDialogOpen(false);
        setSlotToDelete(null);
        setDeleteSlotError(null);
      } catch (err: any) {
        console.error("Fehler beim Löschen des Slots:", err);
        setDeleteSlotError(
          err.response?.data?.detail || "Fehler beim Löschen des Slots."
        );
      } finally {
        setDeleteSlotLoading(false);
      }
    }
  };

  const handleCancelDeleteSlot = () => {
    setIsDeleteSlotDialogOpen(false);
    setSlotToDelete(null);
    setDeleteSlotError(null);
  };

  const handleCancelEdit = () => {
    setEditingAvailability(null);
    setNewAvailability({
      date: "",
      startTime: "",
      endTime: "",
      appointmentLength: 30,
      maxBookingsPerSlot: 1,
      massViewingsEnabled: false,
      cancellationDeadlineHours: 0,
    });
  };

  if (loading) {
    return (
      <div className={globalstyle.appMainContainer}>
        <h2 className={styles.title}>Eigentümer Dashboard</h2>
        <p className="text-[#00015e]">Lade Daten...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={globalstyle.appMainContainer}>
        <h2 className={styles.title}>Eigentümer Dashboard</h2>
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className={globalstyle.appMainContainer}>
      <h2>Eigentümer Dashboard</h2>

      <Tabs defaultValue={activeTab} onValueChange={handleTabChange}>
        <TabsList className={styles.tabsList}>
          <TabsTrigger
            value="bookings"
            className={`${styles.tabsTrigger} ${
              activeTab === "bookings" ? styles.tabsTriggerActive : ""
            }`}
          >
            Buchungen
          </TabsTrigger>
          <TabsTrigger
            value="availability"
            className={`${styles.tabsTrigger} ${
              activeTab === "availability" ? styles.tabsTriggerActive : ""
            }`}
          >
            Verfügbarkeiten
          </TabsTrigger>
        </TabsList>
        <TabsContent value="bookings">
          <h3 className={styles.subtitle}>Aktuelle Buchungen</h3>
          <BookingsTab
            selectedDate={selectedDate}
            setSelectedDate={setSelectedDate}
            displayedMonth={displayedMonth}
            setDisplayedMonth={setDisplayedMonth}
            slots={slots}
            availableDates={availableDates}
            handleOpenCancelDialogBooking={handleOpenCancelDialogBooking}
            handleOpenDeleteSlotDialog={handleOpenDeleteSlotDialog}
          />
        </TabsContent>
        <TabsContent value="availability">
          <h3 className={styles.subtitle}>Verfügbarkeiten verwalten</h3>
          <AvailabilityTab
            availabilities={availabilities}
            newAvailability={newAvailability}
            setNewAvailability={setNewAvailability}
            editingAvailability={editingAvailability}
            onAddAvailability={handleAddAvailability}
            onUpdateAvailability={handleUpdateAvailability}
            onCancelEdit={handleCancelEdit}
            handleEditAvailability={handleEditAvailability}
            handleOpenDeleteDialog={handleOpenDeleteDialog}
          />
        </TabsContent>
      </Tabs>

      {/* Dialoge */}
      <CancelBookingDialog
        isCancelDialogOpen={isCancelDialogOpen}
        setIsCancelDialogOpen={setIsCancelDialogOpen}
        cancelError={cancelError}
        cancelLoading={cancelLoading}
        handleConfirmCancel={handleConfirmCancel}
        handleCancelDialogClose={handleCancelDialogClose}
      />

      <DeleteSlotDialog
        isDeleteSlotDialogOpen={isDeleteSlotDialogOpen}
        setIsDeleteSlotDialogOpen={setIsDeleteSlotDialogOpen}
        deleteSlotError={deleteSlotError}
        deleteSlotLoading={deleteSlotLoading}
        handleConfirmDeleteSlot={handleConfirmDeleteSlot}
        handleCancelDeleteSlot={handleCancelDeleteSlot}
      />

      <DeleteAvailabilityDialog
        isDeleteDialogOpen={isDeleteDialogOpen}
        setIsDeleteDialogOpen={setIsDeleteDialogOpen}
        deleteAvailabilityError={deleteAvailabilityError}
        deleteAvailabilityLoading={deleteAvailabilityLoading}
        handleConfirmDelete={handleConfirmDelete}
        handleCancelDelete={handleCancelDelete}
      />
    </div>
  );
}

export default OwnerCalendarPage;