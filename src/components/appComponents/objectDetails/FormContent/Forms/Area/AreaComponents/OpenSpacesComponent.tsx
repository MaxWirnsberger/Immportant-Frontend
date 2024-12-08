import React, { useState, useEffect } from "react";
import { useFormContext, Controller } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import styles from "../../../formContent.module.css"

// Auswahlmöglichkeiten für die Ausrichtung
const FEATURE_CHOICES = [
  { value: "NORD", label: "Nord" },
  { value: "OST", label: "Ost" },
  { value: "SUED", label: "Sued" },
  { value: "WEST", label: "West" },
  { value: "NORDOST", label: "Nordost" },
  { value: "NORDWEST", label: "Nordwest" },
  { value: "SUEDOST", label: "Suedost" },
  { value: "SUEDWEST", label: "Suedwest" },
];

const openSpacesOptions = [
  { id: "balcony", label: "Balkon" },
  { id: "terrace", label: "Terrasse" },
  { id: "loggia", label: "Loggia" },
  { id: "garden", label: "Garten" },
];

const OpenSpacesComponent = () => {
  const { control, watch, setValue } = useFormContext();
  const [selectedOpenSpaces, setSelectedOpenSpaces] = useState<string[]>([]);

  const number_of_balconies = watch("number_of_balconies");
  const number_of_terraces = watch("number_of_terraces");

  const showBalconyTerraceFields =
    selectedOpenSpaces.includes("balcony") ||
    selectedOpenSpaces.includes("terrace");

  const toggleOpenSpace = (space: string) => {
    setSelectedOpenSpaces((prev) => {
      const updatedSpaces = prev.includes(space)
        ? prev.filter((item) => item !== space)
        : [...prev, space];

      // Clear the related fields if the space is removed
      if (!updatedSpaces.includes(space)) {
        switch (space) {
          case "balcony":
            setValue("number_of_balconies", null);
            setValue("balcony_terrace_orientation", []);
            setValue("balcony_terrace_area", null);
            break;
          case "terrace":
            setValue("number_of_terraces", null);
            setValue("balcony_terrace_orientation", []);
            setValue("balcony_terrace_area", null);
            break;
          case "loggia":
            setValue("number_of_loggias", null);
            break;
          case "garden":
            setValue("garden_area", null);
            break;
          default:
            break;
        }
      }
      return updatedSpaces;
    });
  };

  // Effekt, um den initialen Zustand der ausgewählten Freiflächen zu setzen
  useEffect(() => {
    const initialOpenSpaces = [];
    if (watch("number_of_balconies")) initialOpenSpaces.push("balcony");
    if (watch("number_of_terraces")) initialOpenSpaces.push("terrace");
    if (watch("number_of_loggias")) initialOpenSpaces.push("loggia");
    if (watch("garden_area")) initialOpenSpaces.push("garden");
    setSelectedOpenSpaces(initialOpenSpaces);
  }, [watch]);

  return (
    <div className={styles.formSection}>
      <h3 className={styles.subheadline}>Freiflächen</h3>
      <div className={styles.buttonGroup}>
        {openSpacesOptions.map((space) => (
          <Button
            key={space.id}
            type="button"
            onClick={() => toggleOpenSpace(space.id)}
            className={
              selectedOpenSpaces.includes(space.id)
                ? styles.buttonActive
                : styles.buttonInactive
            }
          >
            {space.label}
          </Button>
        ))}
      </div>

      {selectedOpenSpaces.includes("balcony") && (
        <div className={styles.formGroupRow}>
          <div className={styles.formGroup}>
            <Label className={styles.formLabel}>Anzahl Balkone</Label>
            <Controller
              name="number_of_balconies"
              control={control}
              render={({ field }) => (
                <Input
                  id="number_of_balconies"
                  type="number"
                  {...field}
                  value={field.value ?? ""}
                />
              )}
            />
          </div>
        </div>
      )}

      {selectedOpenSpaces.includes("terrace") && (
        <div className={styles.formGroupRow}>
          <div className={styles.formGroup}>
            <Label className={styles.formLabel}>Anzahl Terrassen</Label>
            <Controller
              name="number_of_terraces"
              control={control}
              render={({ field }) => (
                <Input
                  id="number_of_terraces"
                  type="number"
                  {...field}
                  value={field.value ?? ""}
                />
              )}
            />
          </div>
        </div>
      )}

      {selectedOpenSpaces.includes("loggia") && (
        <div className={styles.formGroupRow}>
          <div className={styles.formGroup}>
            <Label className={styles.formLabel}>Anzahl Loggia</Label>
            <Controller
              name="number_of_loggias"
              control={control}
              render={({ field }) => (
                <Input
                  id="number_of_loggias"
                  type="number"
                  {...field}
                  value={field.value ?? ""}
                />
              )}
            />
          </div>
        </div>
      )}

      {selectedOpenSpaces.includes("garden") && (
        <div className={styles.formGroupRow}>
          <div className={styles.formGroup}>
            <Label className={styles.formLabel}>Gartenfläche (m²)</Label>
            <Controller
              name="garden_area"
              control={control}
              render={({ field }) => (
                <Input
                  id="garden_area"
                  {...field}
                  value={field.value ?? ""}
                />
              )}
            />
          </div>
        </div>
      )}

      {showBalconyTerraceFields && (
        <div className={`${styles.formGroupRow}`}>
          <div className={`${styles.formGroup} ${styles.halfRow}`}>
            <Label className={styles.formLabel}>
              Fläche für Balkon und/oder Terrasse
            </Label>
            <Controller
              name="balcony_terrace_area"
              control={control}
              render={({ field }) => (
                <Input
                  id="balcony_terrace_area"
                  type="number"
                  {...field}
                  value={field.value ?? ""}
                />
              )}
            />
          </div>

          <div className={styles.formGroup}>
            <Label className={styles.formLabel}>
              Ausrichtung für Balkon und/oder Terrasse
            </Label>
            <Controller
              name="balcony_terrace_orientation"
              control={control}
              render={({ field }) => (
                <div className={styles.checkboxField}>
                  {FEATURE_CHOICES.map((choice) => (
                    <div
                      key={choice.value}
                      className="flex items-center space-x-1"
                    >
                      <Checkbox
                        checked={
                          field.value?.includes(choice.value) || false
                        }
                        onCheckedChange={(checked) => {
                          const selectedValue = choice.value;
                          if (checked) {
                            field.onChange([
                              ...(field.value || []),
                              selectedValue,
                            ]);
                          } else {
                            field.onChange(
                              (field.value || []).filter(
                                (v: string) => v !== selectedValue
                              )
                            );
                          }
                        }}
                        id={choice.value}
                      />
                      <Label htmlFor={choice.value}>{choice.label}</Label>
                    </div>
                  ))}
                </div>
              )}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default OpenSpacesComponent;
