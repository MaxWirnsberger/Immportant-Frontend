"use client";

import React, { useEffect, useState } from "react";
import { format } from "date-fns";
import { de } from "date-fns/locale";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Pencil, Trash } from "lucide-react";
import axiosInstance from "@/lib/axiosInstance";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { useRouter } from "next/router";
import globalstyle from "../globalApp.module.css";
import styles from "./ownerCalender.module.css";

// Typdefinitionen für Backend-Daten
type BackendBooking = {
  id: string;
  firstname: string | null;
  lastname: string | null;
  email: string;
  phone_number: string | null;
  booked_at: string;
  reminder_sent: boolean;
  cancelled: boolean;
  token: string;
};

type BackendSlot = {
  id: string;
  daily_availability: string;
  date: string;
  start_time: string;
  end_time: string;
  max_bookings: number;
  is_mass_viewing: boolean;
  bookings: BackendBooking[];
};

type BackendAvailability = {
  id: string;
  property: string;
  date: string;
  start_time: string;
  end_time: string;
  appointment_length: number;
  max_bookings_per_slot: number;
  mass_viewings_enabled: boolean;
  cancellation_deadline_hours: number;
};

type Booking = {
  id: string;
  slotId: string;
  date: Date;
  time: string;
  customerName: string;
  email: string;
  phoneNumber: string;
  isFullyBooked: boolean;
};

type Availability = {
  id: string;
  date: string;
  start_time: string;
  end_time: string;
  appointment_length: number;
  max_bookings_per_slot: number;
  mass_viewings_enabled: boolean;
  cancellation_deadline_hours: number;
};

export default function OwnerDashboard() {
  const router = useRouter();
  const { ownerCalenderId } = router.query;
  const realEstateId = Array.isArray(ownerCalenderId)
    ? ownerCalenderId[0]
    : ownerCalenderId || "";

  console.log("RealEstateId:", realEstateId); // Überprüfe den realEstateId

  const [bookings, setBookings] = useState<Booking[]>([]);
  const [availabilities, setAvailabilities] = useState<Availability[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    new Date()
  );
  const [newAvailability, setNewAvailability] = useState({
    date: "",
    startTime: "",
    endTime: "",
    appointmentLength: 30,
    maxBookingsPerSlot: 1,
    massViewingsEnabled: false,
    cancellationDeadlineHours: 0,
  });
  const [editingAvailability, setEditingAvailability] = useState<string | null>(
    null
  );
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Zustände für den Bestätigungsdialog
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState<boolean>(false);
  const [availabilityToDelete, setAvailabilityToDelete] = useState<
    string | null
  >(null);

  // Aktueller aktiver Reiter
  const [activeTab, setActiveTab] = useState<"bookings" | "availability">(
    "bookings"
  );

  // availableDates basierend auf availabilities
  const [availableDates, setAvailableDates] = useState<string[]>([]);

  // Zustand für den angezeigten Monat
  const [displayedMonth, setDisplayedMonth] = useState<Date>(new Date());

  // Funktion zum Laden der Availabilities
  const fetchAvailabilities = async () => {
    try {
      const response = await axiosInstance.get<BackendAvailability[]>(
        `/appointments/properties/${realEstateId}/availabilities/`
      );
      console.log("Availabilities:", response.data);
      setAvailabilities(response.data);
      // Set availableDates basierend auf availabilities
      const datesWithAvailability = response.data.map((a) => a.date);
      setAvailableDates([...new Set(datesWithAvailability)]);
      setError(null);
    } catch (err: any) {
      console.error("Fehler beim Laden der Verfügbarkeiten:", err);
      setError("Fehler beim Laden der Verfügbarkeiten.");
    }
  };

  // Funktion zum Laden der Buchungen für ein bestimmtes Datum
  const fetchBookingsByDate = async (date: Date) => {
    setLoading(true);
    try {
      const year = date.getFullYear();
      const month = date.getMonth() + 1; // Monate sind 0-indexiert
      const day = date.getDate();

      const response = await axiosInstance.get<BackendSlot[]>(
        `/appointments/properties/${realEstateId}/slots/`,
        {
          params: { year, month, day },
        }
      );
      console.log("Slots for Date:", response.data);
      const mappedBookings: Booking[] = response.data.map((slot) => ({
        id: slot.id,
        slotId: slot.id,
        date: new Date(slot.date),
        time: `${slot.start_time.slice(0, 5)} - ${slot.end_time.slice(0, 5)}`,
        customerName:
          slot.bookings.length > 0
            ? `${slot.bookings[0].firstname || ""} ${
                slot.bookings[0].lastname || ""
              }`
            : "",
        email: slot.bookings.length > 0 ? slot.bookings[0].email : "",
        phoneNumber:
          slot.bookings.length > 0 ? slot.bookings[0].phone_number || "" : "",
        isFullyBooked:
          slot.bookings.filter((b) => !b.cancelled).length >= slot.max_bookings,
      }));
      setBookings(mappedBookings);
      setError(null);
    } catch (err: any) {
      console.error("Fehler beim Laden der Buchungen:", err);
      setError("Fehler beim Laden der Buchungen.");
    } finally {
      setLoading(false);
    }
  };

  // Initiales Laden: fetch availabilities on component mount
  useEffect(() => {
    if (!realEstateId) return;

    // Fetch availabilities on mount to set availableDates
    fetchAvailabilities();
  }, [realEstateId]);

  // Funktion zum Laden basierend auf dem aktiven Reiter und ausgewähltem Datum
  useEffect(() => {
    if (!realEstateId) return;

    if (activeTab === "bookings" && selectedDate) {
      // Check if the selectedDate is in availableDates
      const formattedSelectedDate = format(selectedDate, "yyyy-MM-dd");
      if (availableDates.includes(formattedSelectedDate)) {
        fetchBookingsByDate(selectedDate);
      } else {
        setBookings([]); // Keine Buchungen, da keine Verfügbarkeit am ausgewählten Datum
      }
    }
    // Keine weiteren Aktionen für 'availability' Tab
  }, [realEstateId, activeTab, selectedDate, availableDates]);

  // Handler für Tab-Änderung
  const handleTabChange = (tab: string) => {
    if (tab === "bookings" || tab === "availability") {
      setActiveTab(tab as "bookings" | "availability");
    }
  };

  // Funktionen für CRUD-Operationen bei Availabilities
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
      // Zusätzliche Validierungen
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
        alert(
          "Bitte geben Sie gültige positive Werte für die numerischen Felder ein."
        );
        return;
      }

      try {
        const availabilityData = {
          date, // "YYYY-MM-DD"
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
        // Update availableDates
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
      alert("Bitte füllen Sie alle erforderlichen Felder aus.");
    }
  };

  const handleEditAvailability = (id: string) => {
    setEditingAvailability(id);
    const availabilityToEdit = availabilities.find((a) => a.id === id);
    if (availabilityToEdit) {
      setNewAvailability({
        date: availabilityToEdit.date, // "YYYY-MM-DD"
        startTime: availabilityToEdit.start_time.slice(0, 5),
        endTime: availabilityToEdit.end_time.slice(0, 5),
        appointmentLength: availabilityToEdit.appointment_length,
        maxBookingsPerSlot: availabilityToEdit.max_bookings_per_slot,
        massViewingsEnabled: availabilityToEdit.mass_viewings_enabled,
        cancellationDeadlineHours:
          availabilityToEdit.cancellation_deadline_hours,
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
        // Zusätzliche Validierungen
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
          alert(
            "Bitte geben Sie gültige positive Werte für die numerischen Felder ein."
          );
          return;
        }

        try {
          const availabilityData = {
            date, // "YYYY-MM-DD"
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

          // Finden der alten Verfügbarkeit
          const oldAvailability = availabilities.find(
            (a) => a.id === editingAvailability
          );

          // Wenn das Datum geändert wurde, aktualisieren der availableDates
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
        alert("Bitte füllen Sie alle erforderlichen Felder aus.");
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
        // Überprüfen, ob es weitere Verfügbarkeiten am selben Datum gibt
        const exists = availabilities.some(
          (a) => a.date === deletedAvailability.date && a.id !== id
        );
        if (!exists) {
          setAvailableDates((prev) =>
            prev.filter((date) => date !== deletedAvailability.date)
          );
        }
      }
    } catch (err: any) {
      console.error("Fehler beim Löschen der Verfügbarkeit:", err);
      alert("Fehler beim Löschen der Verfügbarkeit.");
    }
  };

  const handleOpenDeleteDialog = (id: string) => {
    setAvailabilityToDelete(id);
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (availabilityToDelete) {
      await handleDeleteAvailability(availabilityToDelete);
      setAvailabilityToDelete(null);
      setIsDeleteDialogOpen(false);
    }
  };

  const handleCancelDelete = () => {
    setAvailabilityToDelete(null);
    setIsDeleteDialogOpen(false);
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

  // Loading- und Fehlerzustände
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

  // Filter der Slots basierend auf dem ausgewählten Datum
  const filteredAppointments = selectedDate
    ? bookings.filter(
        (app) =>
          format(app.date, "yyyy-MM-dd") === format(selectedDate, "yyyy-MM-dd")
      )
    : [];

  const modifiers = {
    available: (date: Date) => {
      const formattedDate = format(date, "yyyy-MM-dd");
      return availableDates.includes(formattedDate);
    },
  };

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
          <div className={styles.calendarContainer}>
            <DayPicker
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              locale={de}
              className={styles.calendar}
              modifiers={modifiers}
              modifiersStyles={{
                available: {
                  backgroundColor: "#2cf599",
                  color: "#00015e",
                },
                selected: {
                  backgroundColor: "#2cf599",
                  color: "#00015e",
                },
                today: {
                  backgroundColor: "#e7edff",
                  color: "#00015e",
                },
                disabled: {
                  backgroundColor: "#f0f0f0",
                  color: "#a0a0a0",
                  cursor: "not-allowed",
                },
              }}
              disabled={(date: Date) => false}
              month={displayedMonth}
              onMonthChange={setDisplayedMonth}
            />
            <div className={styles.appointments}>
              <h3 className={styles.appointmentsTitle}>
                Buchungen für{" "}
                {selectedDate
                  ? format(selectedDate, "dd.MM.yyyy", { locale: de })
                  : ""}
              </h3>
              {selectedDate ? (
                availableDates.includes(format(selectedDate, "yyyy-MM-dd")) ? (
                  filteredAppointments.length > 0 ? (
                    <ul className="space-y-2">
                      {filteredAppointments.map((booking) => (
                        <li
                          key={booking.id}
                          className={styles.appointmentListItem}
                        >
                          <p>
                            <strong>Zeit:</strong> {booking.time}
                          </p>
                          {booking.customerName &&
                          booking.email &&
                          booking.phoneNumber ? (
                            <>
                              <p>
                                <strong>Kunde:</strong> {booking.customerName}
                              </p>
                              <p>
                                <strong>E-Mail:</strong> {booking.email}
                              </p>
                              <p>
                                <strong>Telefonnummer:</strong>{" "}
                                {booking.phoneNumber}
                              </p>
                            </>
                          ) : null}
                          <p>
                            <strong>Voll ausgebucht:</strong>{" "}
                            {booking.isFullyBooked ? "Ja" : "Nein"}
                          </p>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-[#00015e]">
                      Keine Buchungen für dieses Datum vorhanden.
                    </p>
                  )
                ) : (
                  <p className="text-[#00015e]">
                    Keine Verfügbarkeiten für dieses Datum vorhanden.
                  </p>
                )
              ) : (
                <p className="text-[#00015e]">
                  Bitte wählen Sie ein Datum aus, um Buchungen anzuzeigen.
                </p>
              )}
            </div>
          </div>
        </TabsContent>
        <TabsContent value="availability">
          <h3 className={styles.subtitle}>Verfügbarkeiten verwalten</h3>
          <div className={styles.availabilityContent}>
            <div className="space-y-4">
              <div className={styles.formGrid}>
                <div className={styles.tribbleInputField}>
                  <div>
                    <Label htmlFor="date" className="text-[#00015e]">
                      Datum
                    </Label>
                    <Input
                      id="date"
                      type="date"
                      value={newAvailability.date}
                      onChange={(e) =>
                        setNewAvailability({
                          ...newAvailability,
                          date: e.target.value,
                        })
                      }
                      className={styles.inputField}
                      placeholder="2024-12-16"
                    />
                  </div>
                  <div>
                    <Label htmlFor="startTime" className="text-[#00015e]">
                      Startzeit
                    </Label>
                    <Input
                      id="startTime"
                      type="time"
                      value={newAvailability.startTime}
                      onChange={(e) =>
                        setNewAvailability({
                          ...newAvailability,
                          startTime: e.target.value,
                        })
                      }
                      className={styles.inputField}
                    />
                  </div>
                  <div>
                    <Label htmlFor="endTime" className="text-[#00015e]">
                      Endzeit
                    </Label>
                    <Input
                      id="endTime"
                      type="time"
                      value={newAvailability.endTime}
                      onChange={(e) =>
                        setNewAvailability({
                          ...newAvailability,
                          endTime: e.target.value,
                        })
                      }
                      className={styles.inputField}
                    />
                  </div>
                </div>
                <div className={styles.tribbleInputField}>
                  <div>
                    <Label
                      htmlFor="appointmentLength"
                      className="text-[#00015e]"
                    >
                      Dauer (Minuten)
                    </Label>
                    <Input
                      id="appointmentLength"
                      type="number"
                      min="1"
                      value={newAvailability.appointmentLength}
                      onChange={(e) =>
                        setNewAvailability({
                          ...newAvailability,
                          appointmentLength: parseInt(e.target.value) || 0,
                        })
                      }
                      className={styles.inputField}
                      placeholder="30"
                    />
                  </div>
                  <div>
                    <Label
                      htmlFor="maxBookingsPerSlot"
                      className="text-[#00015e]"
                    >
                      Max. Buchungen pro Slot
                    </Label>
                    <Input
                      id="maxBookingsPerSlot"
                      type="number"
                      min="1"
                      value={newAvailability.maxBookingsPerSlot}
                      onChange={(e) =>
                        setNewAvailability({
                          ...newAvailability,
                          maxBookingsPerSlot: parseInt(e.target.value) || 0,
                        })
                      }
                      className={styles.inputField}
                      placeholder="1"
                    />
                  </div>
                  <div>
                    <Label
                      htmlFor="cancellationDeadlineHours"
                      className="text-[#00015e]"
                    >
                      Stornierungsfrist (Stunden)
                    </Label>
                    <Input
                      id="cancellationDeadlineHours"
                      type="number"
                      min="0"
                      value={newAvailability.cancellationDeadlineHours}
                      onChange={(e) =>
                        setNewAvailability({
                          ...newAvailability,
                          cancellationDeadlineHours:
                            parseInt(e.target.value) || 0,
                        })
                      }
                      className={styles.inputField}
                      placeholder="0"
                    />
                  </div>
                </div>
              </div>
              {editingAvailability ? (
                <div className={styles.buttonsFlex}>
                  <Button
                    onClick={handleUpdateAvailability}
                    className={styles.buttonUpdate}
                  >
                    Aktualisieren
                  </Button>
                  <Button
                    onClick={handleCancelEdit}
                    className={styles.buttonCancel}
                  >
                    Abbrechen
                  </Button>
                </div>
              ) : (
                <Button
                  onClick={handleAddAvailability}
                  className={styles.buttonUpdate}
                >
                  Verfügbarkeit hinzufügen
                </Button>
              )}
            </div>
            <div className="mt-6">
              <h3 className={styles.subtitle}>Aktuelle Verfügbarkeiten</h3>
              {availabilities.length === 0 ? (
                <p className="text-[#00015e]">
                  Keine Verfügbarkeiten festgelegt.
                </p>
              ) : (
                <ul className="space-y-2">
                  {availabilities.map((availability) => (
                    <li
                      key={availability.id}
                      className={styles.availabilityListItem}
                    >
                      <div>
                        <p>
                          <strong>Datum:</strong>{" "}
                          {format(new Date(availability.date), "dd.MM.yyyy")}
                        </p>
                        <p>
                          <strong>Zeit:</strong>{" "}
                          {availability.start_time.slice(0, 5)} -{" "}
                          {availability.end_time.slice(0, 5)}
                        </p>
                        <p>
                          <strong>Dauer:</strong>{" "}
                          {availability.appointment_length} Minuten
                        </p>
                        <p>
                          <strong>Max Buchungen pro Slot:</strong>{" "}
                          {availability.max_bookings_per_slot}
                        </p>
                        <p>
                          <strong>Massenbesichtigungen:</strong>{" "}
                          {availability.mass_viewings_enabled ? "Ja" : "Nein"}
                        </p>
                        <p>
                          <strong>Stornierungsfrist:</strong>{" "}
                          {availability.cancellation_deadline_hours} Stunden
                        </p>
                      </div>
                      <div className="flex space-x-2">
                        <div
                          onClick={() =>
                            handleEditAvailability(availability.id)
                          }
                          className={styles.editbutton}
                        >
                          <Pencil className={styles.iconStyle} />
                        </div>
                        <Button
                          onClick={() =>
                            handleOpenDeleteDialog(availability.id)
                          }
                          className={styles.buttonDelete}
                        >
                          <Trash />
                        </Button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
          {/* Bestätigungsdialog für das Löschen */}
          <Dialog
            open={isDeleteDialogOpen}
            onOpenChange={setIsDeleteDialogOpen}
          >
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Verfügbarkeit löschen</DialogTitle>
                <DialogDescription>
                  Bist du sicher, dass du diese Verfügbarkeit löschen möchtest?
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button
                  onClick={handleConfirmDelete}
                  className={styles.buttonDelete}
                >
                  Löschen
                </Button>
                <Button
                  onClick={handleCancelDelete}
                  className={styles.buttonCancel}
                >
                  Abbrechen
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </TabsContent>
      </Tabs>
    </div>
  );
}
