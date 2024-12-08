import React, {
  forwardRef,
  useState,
  useImperativeHandle,
  useEffect,
} from "react";
import { useForm, Controller, FormProvider } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import axiosInstance from "@/lib/axiosInstance";
import styles from "../../../formContent.module.css";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  LOCATION_AREA_CHOISES,
  BUILDING_ACCORDING_CHOISES,
  DEVELOPMENT_CHOISES,
} from "../DetailsComponents/constants";

interface DetailDataFormValues {
  location_area?: string | null;
  buildable_according_to?: string | null;
  development?: string | null;
  geo_id?: string | null;
  specifications_id?: string | null;
  condition_details_id?: string | null;
}

const validationSchema = yup.object().shape({
  location_area: yup
    .string()
    .nullable()
    .oneOf(LOCATION_AREA_CHOISES.map((choice) => choice.value)),
  buildable_according_to: yup
    .string()
    .nullable()
    .oneOf(BUILDING_ACCORDING_CHOISES.map((choice) => choice.value)),
  development: yup
    .string()
    .nullable()
    .oneOf(DEVELOPMENT_CHOISES.map((choice) => choice.value)),
});

interface DetailDataFormProps {
  updateFormData: (data: DetailDataFormValues) => void;
  realEstateId: string | string[];
}

interface FormHandle {
  submit: () => Promise<boolean>;
}

export const PlotDetails = forwardRef<FormHandle, DetailDataFormProps>(
  ({ updateFormData, realEstateId }, ref) => {
    const [loading, setLoading] = useState(true);

    const methods = useForm<DetailDataFormValues>({
      resolver: yupResolver(validationSchema),
      defaultValues: {
        location_area: null,
        buildable_according_to: null,
        development: null,
      },
    });

    const {
      control,
      handleSubmit,
      reset,
      formState: { errors },
    } = methods;

    useEffect(() => {
      const fetchData = async () => {
        try {
          const response = await axiosInstance.get(
            `/real-estate/detail/${realEstateId}/?fields=geo,condition_details,specifications,`
          );
          const data = response.data;
          const formData: DetailDataFormValues = {
            location_area: data.geo?.location_area || null,
            buildable_according_to:
              data.condition_details?.buildable_according_to || null,
            development: data.condition_details?.development || null,
            geo_id: data.geo?.id || null,
            specifications_id: data.specifications?.id || null,
            condition_details_id: data.condition_details?.id || null,
          };
          reset(formData);
          setLoading(false);
        } catch (error) {
          console.error("Fehler beim Laden der Daten:", error);
          setLoading(false);
        }
      };

      if (realEstateId) {
        fetchData();
      }
    }, [realEstateId, reset]);

    useImperativeHandle(ref, () => ({
      submit: async () => {
        let isValid = false;
        try {
          await handleSubmit(async (formData) => {
            const nestedData = {
              geo: {
                ...(formData.geo_id ? { id: formData.geo_id } : {}),
                location_area: formData.location_area,
              },
              condition_details: {
                ...(formData.condition_details_id
                  ? { id: formData.condition_details_id }
                  : {}),
                buildable_according_to: formData.buildable_according_to,
                development: formData.development,
              },
            };
            await axiosInstance.put(
              `/real-estate/update/${realEstateId}/`,
              nestedData
            );
            updateFormData(formData);
            isValid = true;
          })();
        } catch (error) {
          console.error("Fehler beim Senden der Daten:", error);
          console.error("Validierungsfehler:", methods.formState.errors);
        }
        return isValid;
      },
    }));

    if (loading) {
      return <div>Lädt...</div>;
    }

    return (
      <FormProvider {...methods}>
        <div className={styles.form}>
          <div className={styles.formSection}>
            <div className={styles.formSection}>
              <h3 className={styles.subheadline}>Zustandsangaben</h3>

              <div className={styles.formGroup}>
                <Label className={styles.formLabel}>Art des Grundstücks</Label>
                <Controller
                  name="location_area"
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
                        {LOCATION_AREA_CHOISES.map((choice) => (
                          <SelectItem key={choice.value} value={choice.value}>
                            {choice.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>

              <div className={styles.formGroup}>
                <Label className={styles.formLabel}>Bebaubar nach</Label>
                <Controller
                  name="buildable_according_to"
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
                        {BUILDING_ACCORDING_CHOISES.map((choice) => (
                          <SelectItem key={choice.value} value={choice.value}>
                            {choice.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>

              <div className={styles.formGroup} style={{ marginBottom: '150px' }}>
                <Label className={styles.formLabel}>Erschlossen</Label>
                <Controller
                  name="development"
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
                        {DEVELOPMENT_CHOISES.map((choice) => (
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
        </div>
      </FormProvider>
    );
  }
);
