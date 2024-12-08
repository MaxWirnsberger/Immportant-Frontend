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
import { EQUIPMENT_CATEGORY_CHOICES, FURNISHED_CHOICES } from "./constants";

const EquipmentComponent = () => {
  const {
    control,
    formState: { errors },
  } = useFormContext();

  return (
    <div className={styles.formGroupRow}>
      {/* Ausstattungskategorie */}
      <div className={styles.formGroup}>
        <Label className={styles.formLabel}>
          <div>
            Ausstattungskategorie<span className="text-red-500">*</span>
          </div>
        </Label>
        <Controller
          name="equipment_category"
          control={control}
          render={({ field }) => (
            <Select onValueChange={field.onChange} value={field.value ?? ""}>
              <SelectTrigger>
                <SelectValue placeholder="Wählen Sie eine Kategorie" />
              </SelectTrigger>
              <SelectContent>
                {EQUIPMENT_CATEGORY_CHOICES.map((choice) => (
                  <SelectItem key={choice.value} value={choice.value}>
                    {choice.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
      </div>

      {/* Möblierung */}
      <div className={styles.formGroup}>
        <Label className={styles.formLabel}>Möblierung</Label>
        <Controller
          name="furnished"
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
                <SelectValue placeholder="Wählen Sie eine Option" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="NONE">Keine Auswahl</SelectItem>
                {FURNISHED_CHOICES.map((choice) => (
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
  );
};

export default EquipmentComponent;
