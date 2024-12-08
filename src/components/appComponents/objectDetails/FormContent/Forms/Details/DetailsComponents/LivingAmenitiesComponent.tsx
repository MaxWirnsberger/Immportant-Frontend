import React from "react";
import { useFormContext, Controller } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import styles from "../../../formContent.module.css";

const amenities = [
  { name: "air_conditioned", label: "Klimatisiert" },
  { name: "barrier_free", label: "Barrierefrei" },
  { name: "bicycle_room", label: "Fahrradraum" },
  { name: "elevator_person", label: "Personenaufzug" },
  { name: "fireplace", label: "Kamin" },
  { name: "laundry_room", label: "Waschraum" },
  { name: "library", label: "Bibliothek" },
  { name: "sauna", label: "Sauna" },
  { name: "senior_friendly", label: "Seniorengerecht" },
  { name: "shutters", label: "Rollläden" },
  { name: "suitable_for_shared_flat", label: "WG-geeignet" },
  { name: "swimming_pool", label: "Schwimmbad" },
  { name: "wheelchair_accessible", label: "Rollstuhlgerecht" },
  { name: "conservatory", label: "Wintergarten" },
];

const LivingAmenitiesComponent = () => {
  const { control } = useFormContext();

  return (
    <div className={styles.formSection}>
      <h3 className={styles.subheadline}>Zusätzliche Ausstattungen</h3>
      <div className={styles.formGroup}>
        <Label className={styles.formLabel}>Ausstattungen</Label>
        <div className={styles.buttonGroup}>
          {amenities.map((item) => (
            <Controller
              key={item.name}
              name={item.name}
              control={control}
              render={({ field }) => (
                <Button
                  type="button"
                  onClick={() => field.onChange(!field.value)}
                  className={
                    field.value ? styles.buttonActive : styles.buttonInactive
                  }
                >
                  {item.label}
                </Button>
              )}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default LivingAmenitiesComponent;
