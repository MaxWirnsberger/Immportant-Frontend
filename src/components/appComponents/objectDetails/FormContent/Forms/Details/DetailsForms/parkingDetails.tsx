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

import ConstructionComponent from "../DetailsComponents/ConstructionComponent";
import ConditionComponent from "../DetailsComponents/ConditionComponent";
import SecurityComponent from "../DetailsComponents/SecurityComponent";

import {
  LOCATION_AREA_CHOISES,
  CONDITION_CHOICES,
  SECURITY_TECHNOLOGY_CHOICES,
} from "../DetailsComponents/constants";

interface DetailDataFormValues {
  location_area?: string | null;
  security_technology: string[];
  construction_year?: number | null;
  last_modernization?: number | null;
  condition?: string | null;

  geo_id?: string | null;
  specifications_id?: string | null;
  condition_details_id?: string | null;
}

const validationSchema = yup.object().shape({
  location_area: yup
    .string()
    .nullable()
    .oneOf(LOCATION_AREA_CHOISES.map((choice) => choice.value)),
  security_technology: yup
    .array()
    .of(
      yup
        .string()
        .oneOf(SECURITY_TECHNOLOGY_CHOICES.map((choice) => choice.value))
        .required()
    )
    .required(),
  construction_year: yup.number().nullable().notRequired(),
  last_modernization: yup.number().nullable().notRequired(),
  condition: yup
    .string()
    .oneOf(CONDITION_CHOICES.map((choice) => choice.value))
    .notRequired(),
});

interface DetailDataFormProps {
  updateFormData: (data: DetailDataFormValues) => void;
  realEstateId: string | string[];
}

interface FormHandle {
  submit: () => Promise<boolean>;
}

export const ParkingDetails = forwardRef<
  FormHandle,
  DetailDataFormProps
>(({ updateFormData, realEstateId }, ref) => {
  const [loading, setLoading] = useState(true);

  const methods = useForm<DetailDataFormValues>({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      location_area: null,
      security_technology: [],
      construction_year: null,
      last_modernization: null,
      condition: null,
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
          security_technology: data.specifications?.security_technology || [],
          construction_year: data.condition_details?.construction_year || null,
          last_modernization:
            data.condition_details?.last_modernization || null,
          condition: data.condition_details?.condition || null,
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
            specifications: {
              ...(formData.specifications_id
                ? { id: formData.specifications_id }
                : {}),
              security_technology: formData.security_technology || [],
            },
            condition_details: {
              ...(formData.condition_details_id
                ? { id: formData.condition_details_id }
                : {}),
              construction_year: formData.construction_year || null,
              last_modernization: formData.last_modernization || null,
              condition: formData.condition || null,
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

            <ConstructionComponent />
            <ConditionComponent />
            <SecurityComponent />
          </div>
        </div>
      </div>
    </FormProvider>
  );
});
