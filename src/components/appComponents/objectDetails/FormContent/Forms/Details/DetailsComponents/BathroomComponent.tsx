import React from "react";
import { useFormContext, Controller } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import styles from "../../../formContent.module.css";
import { BATHROOM_CHOICES } from "./constants";

const BathroomComponent = () => {
  const {
    control,
    formState: { errors },
  } = useFormContext();

  return (
    <div className={styles.formSection}>
      <h3 className={styles.subheadline}>Merkmale</h3>
      <div className={styles.formGroupRow}>
        <div className={styles.formGroup}>
          <Label className={styles.formLabel}>Badezimmer</Label>
          <Controller
            name="bathroom"
            control={control}
            render={({ field }) => (
              <div className={styles.buttonGroup}>
                {BATHROOM_CHOICES.map((option) => (
                  <Button
                    key={option.value}
                    type="button"
                    onClick={() => {
                      const newValue = field.value?.includes(option.value)
                        ? field.value.filter((v:any) => v !== option.value)
                        : [...(field.value || []), option.value];
                      field.onChange(newValue);
                    }}
                    className={
                      field.value?.includes(option.value)
                        ? styles.buttonActive
                        : styles.buttonInactive
                    }
                  >
                    {option.label}
                  </Button>
                ))}
              </div>
            )}
          />
        </div>
      </div>
    </div>
  );
};

export default BathroomComponent;
