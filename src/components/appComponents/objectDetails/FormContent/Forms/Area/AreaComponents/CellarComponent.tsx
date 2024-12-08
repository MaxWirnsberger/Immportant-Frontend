import React from "react";
import { useFormContext, Controller } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import styles from "../../../formContent.module.css"


const CellarComponent = () => {
  const {
    control,
    watch,
    setValue,
    formState: { errors },
  } = useFormContext();

  const cellar = watch("cellar");

  React.useEffect(() => {
    if (!cellar) {
      setValue("cellar_area", null);
    }
  }, [cellar, setValue]);

  return (
    <div className={`${styles.formSection} pt-4`}>
      <div className={styles.formGroup}>
        <Label className={styles.formLabel}>Keller vorhanden</Label>
        <Controller
          name="cellar"
          control={control}
          render={({ field }) => (
            <Switch
              id="cellar"
              checked={field.value ?? false}
              onCheckedChange={field.onChange}
            />
          )}
        />
      </div>

      {cellar && (
        <div className={`${styles.formGroup} ${styles.halfRow}`}>
          <Label className={styles.formLabel}>Kellerfläche (m²)</Label>
          <Controller
            name="cellar_area"
            control={control}
            render={({ field }) => (
              <Input
                id="cellar_area"
                type="number"
                {...field}
                value={field.value ?? ""}
              />
            )}
          />
        </div>
      )}
    </div>
  );
};

export default CellarComponent;
