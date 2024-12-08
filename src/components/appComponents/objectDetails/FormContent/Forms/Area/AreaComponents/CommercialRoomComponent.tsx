import React from "react";
import { useFormContext, Controller } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import styles from "../../../formContent.module.css";

const CommercialRoomComponent = () => {
  const {
    control,
    formState: { errors },
  } = useFormContext();

  return (
    <div className={styles.formSection}>
      <h3 className={styles.subheadline}>Räume</h3>
      <div className={styles.formGroupRow}>
        <div className={styles.formGroup}>
          <Label className={styles.formLabel}>
            <div>
              Anzahl Zimmer
            </div>
          </Label>
          <Controller
            name="number_of_rooms"
            control={control}
            render={({ field }) => (
              <Input
                id="number_of_rooms"
                type="number"
                {...field}
                value={field.value ?? ""}
                step="1"
              />
            )}
          />
        </div>
        <div className={styles.formGroup}>
          <Label className={styles.formLabel}>Anzahl Badezimmer</Label>
          <Controller
            name="number_of_bathrooms"
            control={control}
            render={({ field }) => (
              <Input
                id="number_of_bathrooms"
                type="number"
                {...field}
                value={field.value ?? ""}
              />
            )}
          />
        </div>
        <div className={styles.formGroup}>
          <Label className={styles.formLabel}>Anzahl sep. WC</Label>
          <Controller
            name="number_of_separate_wc"
            control={control}
            render={({ field }) => (
              <Input
                id="number_of_separate_wc"
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

export default CommercialRoomComponent;
