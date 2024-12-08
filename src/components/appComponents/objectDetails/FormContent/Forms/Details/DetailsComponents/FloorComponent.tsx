import React from "react";
import { useFormContext, Controller } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import styles from "../../../formContent.module.css";

const FloorComponent = () => {
  const {
    control,
    formState: { errors },
  } = useFormContext();

  return (
    <div className={styles.formGroupRow}>
      {/* Stockwerk "floor_number"*/}
      <div className={styles.formGroup}>
        <Label className={styles.formLabel}>Stockwerk (0 = Erdgeschoss)</Label>
        <Controller
          name="floor_number"
          control={control}
          render={({ field }) => (
            <Input
              placeholder="Apartment Stockwerk"
              type="number"
              {...field}
              value={
                field.value !== undefined && field.value !== null
                  ? field.value
                  : ""
              }
              onChange={(e) => {
                const value =
                  e.target.value === "" ? null : Number(e.target.value);
                field.onChange(value);
              }}
            />
          )}
        />
      </div>

      {/* Anzahl der Stockwerke */}
      <div className={styles.formGroup}>
        <Label className={styles.formLabel}>Anzahl der Stockwerke</Label>
        <Controller
          name="number_of_floors"
          control={control}
          render={({ field }) => (
            <Input
              type="number"
              placeholder="Stockwerk insgesamt"
              {...field}
              value={
                field.value !== undefined && field.value !== null
                  ? field.value
                  : ""
              }
              onChange={(e) => {
                const value =
                  e.target.value === "" ? null : Number(e.target.value);
                field.onChange(value);
              }}
            />
          )}
        />
      </div>
    </div>
  );
};

export default FloorComponent;
