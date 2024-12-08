import React from "react";
import { useFormContext, Controller } from "react-hook-form";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import styles from "../../../formContent.module.css";
import { HEATINGTYPE_CHOICES, HEATINGFUEL_CHOICES } from "./constants";

const HeatingComponent = () => {
  const {
    control,
    formState: { errors },
  } = useFormContext();

  return (
    <div className={styles.formSection}>
      <h3 className={styles.subheadline}>Heizungsangaben</h3>
      <div className={styles.formGroupRow}>
        {/* Heizungsart */}
        <div className={`${styles.formGroup} ${styles.halfRow}`}>
          <Label className={styles.formLabel}>Heizungsart</Label>
          <Controller
            name="heating_type"
            control={control}
            render={({ field }) => (
              <Select
                onValueChange={(value) => {
                  if (value === "NONE") {
                    field.onChange(null);
                  } else {
                    field.onChange(value);
                  }
                }}
                value={field.value ?? "NONE"}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Bitte wählen" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="NONE">Keine Auswahl</SelectItem>
                  {HEATINGTYPE_CHOICES.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
        </div>

        {/* Heizungsbrennstoff */}
        <div className={`${styles.formGroup} ${styles.halfRow}`}>
          <Label className={styles.formLabel}>Heizungsbrennstoff</Label>
          <Controller
            name="heating_fuel"
            control={control}
            render={({ field }) => (
              <Select
                onValueChange={(value) => {
                  if (value === "NONE") {
                    field.onChange(null);
                  } else {
                    field.onChange(value);
                  }
                }}
                value={field.value ?? "NONE"}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Bitte wählen" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="NONE">Keine Auswahl</SelectItem>
                  {HEATINGFUEL_CHOICES.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
        </div>
      </div>
    </div>
  );
};

export default HeatingComponent;
