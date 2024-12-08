import React from "react";
import { useFormContext, Controller } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import styles from "../../../formContent.module.css";

const GastroComponent = () => {
  const {
    control,
    formState: { errors },
  } = useFormContext();

  return (
    <div className={styles.formSection}>
      <h3 className={styles.subheadline}>Kapazitäten</h3>
      <div className={styles.formGroupRow}>
        <div className={styles.formGroup}>
          <Label className={styles.formLabel}>
            <div>
              Plätze im Gastraum
            </div>
          </Label>
          <Controller
            name="number_of_seats_in_guest_room"
            control={control}
            render={({ field }) => (
              <Input
                id="number_of_seats_in_guest_room"
                type="number"
                {...field}
                value={field.value ?? ""}
              />
            )}
          />
        </div>
        <div className={styles.formGroup}>
          <Label className={styles.formLabel}>Anzahl Betten</Label>
          <Controller
            name="number_of_beds"
            control={control}
            render={({ field }) => (
              <Input
                id="number_of_beds"
                type="number"
                {...field}
                value={field.value ?? ""}
              />
            )}
          />
        </div>
        <div className={styles.formGroup}>
          <Label className={styles.formLabel}>Anzahl Tagungsräume</Label>
          <Controller
            name="number_of_conference_rooms"
            control={control}
            render={({ field }) => (
              <Input
                id="number_of_conference_rooms"
                type="number"
                {...field}
                value={field.value ?? ""}
              />
            )}
          />
        </div>
      </div>
    </div>
  );
};

export default GastroComponent;
