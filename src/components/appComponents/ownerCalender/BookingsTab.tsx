"use client";

import React from "react";
import { DayPicker } from "react-day-picker";
import { format } from "date-fns";
import { de } from "date-fns/locale";
import { Button } from "@/components/ui/button";
import styles from "@/pages/app/calender/ownerCalender.module.css";
import { Slot } from "./types";
import "react-day-picker/dist/style.css";

type Props = {
  selectedDate: Date | undefined;
  setSelectedDate: (date: Date | undefined) => void;
  displayedMonth: Date;
  setDisplayedMonth: (date: Date) => void;
  slots: Slot[];
  availableDates: string[];
  handleOpenCancelDialogBooking: (bookingId: string) => void;
  handleOpenDeleteSlotDialog: (slotId: string) => void;
};

export function BookingsTab({
  selectedDate,
  setSelectedDate,
  displayedMonth,
  setDisplayedMonth,
  slots,
  availableDates,
  handleOpenCancelDialogBooking,
  handleOpenDeleteSlotDialog,
}: Props) {
  const modifiers = {
    available: (date: Date) => {
      const formattedDate = format(date, "yyyy-MM-dd");
      return availableDates.includes(formattedDate);
    },
  };

  return (
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
            slots.length > 0 ? (
              <ul className="space-y-4">
                {slots.map((slot) => {
                  const slotEnd = new Date(`${slot.date}T${slot.end_time}`);
                  const canModify = slotEnd > new Date();
                  const activeBookings = slot.bookings.filter(
                    (b) => !b.cancelled
                  );

                  return (
                    <li key={slot.id} className={styles.appointmentListItem}>
                      <div>
                        <p>
                          <strong>Zeit:</strong> {slot.start_time.slice(0, 5)} -{" "}
                          {slot.end_time.slice(0, 5)}
                        </p>
                        <p>
                          <strong>Max Buchungen:</strong> {slot.max_bookings}
                        </p>
                        <p>
                          <strong>Buchungen:</strong> {activeBookings.length}
                        </p>
                      </div>
                      <div className="mt-2">
                        {activeBookings.length > 0 ? (
                          <ul className="space-y-2">
                            {activeBookings.map((booking) => (
                              <li
                                key={booking.id}
                                className={styles.bookingListItem}
                              >
                                <div>
                                  <p>
                                    <strong>Kunde:</strong>{" "}
                                    {booking.firstname} {booking.lastname}
                                  </p>
                                  <p>
                                    <strong>E-Mail:</strong> {booking.email}
                                  </p>
                                  <p>
                                    <strong>Telefonnummer:</strong>{" "}
                                    {booking.phoneNumber}
                                  </p>
                                </div>
                                <div className="mt-2">
                                  {!booking.cancelled ? (
                                    <Button
                                      onClick={() =>
                                        handleOpenCancelDialogBooking(booking.id)
                                      }
                                      className={styles.buttonCancelBooking}
                                    >
                                      Absagen
                                    </Button>
                                  ) : (
                                    <p className="text-red-500">Abgesagt</p>
                                  )}
                                </div>
                              </li>
                            ))}
                          </ul>
                        ) : (
                          canModify && (
                            <Button
                              onClick={() => handleOpenDeleteSlotDialog(slot.id)}
                              className={styles.deleteSlotButton}
                            >
                              Löschen
                            </Button>
                          )
                        )}
                      </div>
                    </li>
                  );
                })}
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
  );
}
