"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import styles from "@/pages/app/calender/ownerCalender.module.css";
import { NewAvailabilityState } from "./types";

type Props = {
  newAvailability: NewAvailabilityState;
  setNewAvailability: (availability: NewAvailabilityState) => void;
  editingAvailability: string | null;
  onAddAvailability: () => void;
  onUpdateAvailability: () => void;
  onCancelEdit: () => void;
};

export function AvailabilityForm({
  newAvailability,
  setNewAvailability,
  editingAvailability,
  onAddAvailability,
  onUpdateAvailability,
  onCancelEdit,
}: Props) {
  return (
    <div className="space-y-4">
      <div className={styles.formGrid}>
        <div className={styles.tribbleInputField}>
          <div>
            <Label htmlFor="date">
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
              className={styles.dateInputField}
              placeholder="dd.mm.jjjj"
            />
          </div>
          <div>
            <Label htmlFor="startTime">
              Startzeit
            </Label>
            <Input
              id="startTime"
              type="time"
              step="600"
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
            <Label htmlFor="endTime">
              Endzeit
            </Label>
            <Input
              id="endTime"
              type="time"
              step="600"
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
            <Label htmlFor="appointmentLength">
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
            <Label htmlFor="maxBookingsPerSlot">
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
                  cancellationDeadlineHours: parseInt(e.target.value) || 0,
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
            onClick={onUpdateAvailability}
            className={styles.buttonUpdate}
          >
            Aktualisieren
          </Button>
          <Button onClick={onCancelEdit} className={styles.buttonCancel}>
            Abbrechen
          </Button>
        </div>
      ) : (
        <Button onClick={onAddAvailability} className={styles.buttonUpdate}>
          Verfügbarkeit hinzufügen
        </Button>
      )}
    </div>
  );
}