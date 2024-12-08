import React from 'react';
import { useFormContext, Controller } from 'react-hook-form';
import { Label } from '@/components/ui/label';
import { YearPicker } from '@/components/ui/year-picker';
import styles from '../../../formContent.module.css';

const ConstructionComponent = () => {
  const {
    control,
    formState: { errors },
  } = useFormContext();

  return (
    <div className={styles.formGroupRow}>
      {/* Konstruktionsjahr */}
      <div className={styles.formGroup}>
        <Label className={styles.formLabel}>
          Konstruktionsjahr
        </Label>
        <Controller
          name="construction_year"
          control={control}
          render={({ field }) => (
            <YearPicker
              value={field.value}
              onChange={(value) => {
                field.onChange(value);
              }}
            />
          )}
        />
      </div>

      {/* Letzte Modernisierung */}
      <div className={styles.formGroup}>
        <Label className={styles.formLabel}>
          Letzte Modernisierung
        </Label>
        <Controller
          name="last_modernization"
          control={control}
          render={({ field }) => (
            <YearPicker
              value={field.value}
              onChange={(value) => {
                field.onChange(value);
              }}
            />
          )}
        />
      </div>
    </div>
  );
};

export default ConstructionComponent;
