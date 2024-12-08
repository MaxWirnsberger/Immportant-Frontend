import React from 'react';
import { useFormContext, Controller } from 'react-hook-form';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import styles from '../../../formContent.module.css';
import { CONDITION_CHOICES } from './constants';

const ConditionComponent = () => {
  const {
    control,
    formState: { errors },
  } = useFormContext();

  return (
    <div className={styles.formGroupRow}>
      <div className={`${styles.formGroup} ${styles.halfRow}`}>
        <Label className={styles.formLabel}>
          Zustand
        </Label>
        <Controller
          name="condition"
          control={control}
          render={({ field }) => (
            <Select
              onValueChange={(value) => {
                if (value === 'NONE') {
                  field.onChange(null);
                } else {
                  field.onChange(value);
                }
              }}
              value={field.value ?? 'NONE'}
            >
              <SelectTrigger>
                <SelectValue placeholder="Bitte wählen" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="NONE">Keine Auswahl</SelectItem>
                {CONDITION_CHOICES.map((option) => (
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
  );
};

export default ConditionComponent;
