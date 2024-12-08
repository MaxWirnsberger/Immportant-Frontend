import React from "react";
import { useFormContext, Controller } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import styles from "../../../formContent.module.css";

const amenities = [
  { name: "air_conditioned", label: "Klimatisiert" },
  { name: "barrier_free", label: "Barrierefrei" },
  { name: "elevator_person", label: "Personenaufzug" },
  { name: "elevator_cargo", label: "Lastenaufzug" },
  { name: "shutters", label: "Rollläden" },
  { name: "wheelchair_accessible", label: "Rollstuhlgerecht" },
  { name: "canteen_cafeteria", label: "Kantine oder Cafeteria" },
  { name: "kitchenette", label: "Teeküche" },
  { name: "cable_channels", label: "Kabelkanäle" },
  { name: "data_cabling", label: "Datenverkabelung" },
  { name: "ramp", label: "Rampe" },
  { name: "laundry_room", label: "Wasch-/Trockenraum" },
  { name: "lift_platform", label: "Hebebühne" },
];

const IndustrialAmenitiesComponent = () => {
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

export default IndustrialAmenitiesComponent;
