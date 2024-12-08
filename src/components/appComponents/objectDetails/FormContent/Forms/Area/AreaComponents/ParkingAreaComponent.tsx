import React from "react";
import { useFormContext, Controller } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import styles from "../../../formContent.module.css";

// Parkplatztyp Auswahlmöglichkeiten
const PARKING_SPACE_CHOICES = [
  { value: "KEINE_ANGABE", label: "Bitte wählen" },
  { value: "GARAGE", label: "Garage" },
  { value: "TIEFGARAGE", label: "Tiefgarage" },
  { value: "CARPORT", label: "Carport" },
  { value: "FREIPLATZ", label: "Freiplatz" },
  { value: "PARKHAUS", label: "Parkhaus" },
  { value: "DUPLEX", label: "Duplex" },
];

const ParkingAreaComponent = () => {
  const { control } = useFormContext();

  return (
    <div className={styles.formSection}>
      <h3 className={styles.subheadline}>Parkflächen</h3>
      <div className={styles.formGroupRow}>
        <div className={styles.formGroup}>
          <Label className={styles.formLabel}>Anzahl Parkplätze</Label>
          <Controller
            name="number_of_parking_spaces"
            control={control}
            render={({ field }) => (
              <Input
                id="number_of_parking_spaces"
                type="number"
                {...field}
                value={field.value ?? ""}
              />
            )}
          />
        </div>

        <div className={styles.formGroup}>
          <Label className={styles.formLabel}>Parkplatztyp</Label>
          <Controller
            name="parking_space_type"
            control={control}
            render={({ field }) => (
              <Select
                // onValueChange={(value) => field.onChange(value)}
                onValueChange={(value) => {
                  // Behandeln Sie "KEINE_ANGABE" als null oder leeren Wert
                  field.onChange(value === "KEINE_ANGABE" ? null : value);
                }}
                value={field.value ?? ""}
              >
                <SelectTrigger aria-label="Parkplatztyp">
                  <SelectValue placeholder="Bitte wählen" />
                </SelectTrigger>
                <SelectContent>
                  {PARKING_SPACE_CHOICES.map((choice) => (
                    <SelectItem key={choice.value} value={choice.value}>
                      {choice.label}
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

export default ParkingAreaComponent;
