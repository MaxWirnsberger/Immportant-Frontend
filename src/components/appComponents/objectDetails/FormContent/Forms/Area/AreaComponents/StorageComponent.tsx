import React from "react";
import { useFormContext, Controller } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import styles from "../../../formContent.module.css";

const StorageComponent = () => {
  const {
    control,
    formState: { errors },
  } = useFormContext();

  return (
    <div className={`${styles.formSection} !flex-row`}>
      <div className={styles.formGroup}>
        <Label className={styles.formLabel}>Abstellfläche vorhanden</Label>
        <Controller
          name="storage_room"
          control={control}
          render={({ field }) => (
            <Switch
              id="storage_room"
              checked={field.value ?? false}
              onCheckedChange={field.onChange}
            />
          )}
        />
      </div>

      <div className={`${styles.formGroup} ${styles.halfRow} pl-16`}>
        <Label className={styles.formLabel}>Lagerfläche (m²)</Label>
        <Controller
          name="storage_area"
          control={control}
          render={({ field }) => (
            <Input
              id="storage_area"
              type="number"
              {...field}
              value={field.value ?? ""}
            />
          )}
        />
      </div>
    </div>
  );
};

export default StorageComponent;
