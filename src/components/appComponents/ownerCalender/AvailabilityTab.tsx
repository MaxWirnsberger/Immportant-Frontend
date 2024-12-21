"use client";

import React from "react";
import { Pencil, Trash } from "lucide-react";
import { Availability } from "./types";
import styles from "@/pages/app/calender/ownerCalender.module.css";
import { format } from "date-fns";
import { de } from "date-fns/locale";
import { Button } from "@/components/ui/button";
import { AvailabilityForm } from "./AvailabilityForm";

type Props = {
  availabilities: Availability[];
  newAvailability: any;
  setNewAvailability: (av: any) => void;
  editingAvailability: string | null;
  onAddAvailability: () => void;
  onUpdateAvailability: () => void;
  onCancelEdit: () => void;
  handleEditAvailability: (id: string) => void;
  handleOpenDeleteDialog: (id: string) => void;
};

export function AvailabilityTab({
  availabilities,
  newAvailability,
  setNewAvailability,
  editingAvailability,
  onAddAvailability,
  onUpdateAvailability,
  onCancelEdit,
  handleEditAvailability,
  handleOpenDeleteDialog,
}: Props) {
  return (
    <div className={styles.availabilityContent}>
      <AvailabilityForm
        newAvailability={newAvailability}
        setNewAvailability={setNewAvailability}
        editingAvailability={editingAvailability}
        onAddAvailability={onAddAvailability}
        onUpdateAvailability={onUpdateAvailability}
        onCancelEdit={onCancelEdit}
      />
      <div className="mt-6">
        <h3 className={styles.subtitle}>Aktuelle Verfügbarkeiten</h3>
        {availabilities.length === 0 ? (
          <p className="text-[#00015e]">Keine Verfügbarkeiten festgelegt.</p>
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
                    {format(new Date(availability.date), "dd.MM.yyyy", {
                      locale: de,
                    })}
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
                    <strong>Stornierungsfrist:</strong>{" "}
                    {availability.cancellation_deadline_hours} Stunden
                  </p>
                </div>
                <div className="flex space-x-2">
                  <div onClick={() => handleEditAvailability(availability.id)} className={styles.editbutton}>
                    <Pencil className={styles.iconStyle} />
                  </div>
                  <Button
                    onClick={() => handleOpenDeleteDialog(availability.id)}
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
  );
}
