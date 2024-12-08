import React, {
  forwardRef,
  useState,
  useImperativeHandle,
  useEffect,
} from "react";
import { useForm, Controller, FormProvider } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import styles from "../../../formContent.module.css";
import axiosInstance from "@/lib/axiosInstance"; // Für GET und PUT

// Import der ausgelagerten Komponenten
import CellarComponent from "../AreaComponents/CellarComponent";
import RoomLayoutComponent from "../AreaComponents/RoomLayoutComponent";
import ParkingAreaComponent from "../AreaComponents/ParkingAreaComponent";
import OpenSpacesComponent from "../AreaComponents/OpenSpacesComponent";

// Definition der Formularwerte
interface AreaDataFormValues {
  living_area: number;
  garden_area?: number | null;
  cellar?: boolean | null;
  cellar_area?: number | null;
  heated_area?: number | null;
  number_of_rooms: number;
  number_of_bedrooms?: number | null;
  number_of_bathrooms?: number | null;
  number_of_separate_wc?: number | null;
  number_of_balconies?: number | null;
  number_of_terraces?: number | null;
  number_of_loggias?: number | null;
  balcony_terrace_area?: number | null;
  number_of_parking_spaces?: number | null;
  parking_space_type?: string | null;
  balcony_terrace_orientation?: string[] | null;
  area_id?: string;
  specifications_id?: string;
}

// Validierungsschema mit Yup
const validationSchema = yup.object().shape({
  living_area: yup
    .number()
    .transform((value, originalValue) =>
      String(originalValue).trim() === "" ? null : value
    )
    .typeError("Bitte geben Sie eine gültige Zahl ein")
    .min(1, "Wohnfläche muss größer als 0 sein")
    .required("Wohnfläche ist erforderlich"),
  garden_area: yup
    .number()
    .transform((value, originalValue) =>
      String(originalValue).trim() === "" ? null : value
    )
    .nullable()
    .notRequired(),
  cellar: yup.boolean().nullable().notRequired(),
  cellar_area: yup
    .number()
    .transform((value, originalValue) =>
      String(originalValue).trim() === "" ? null : value
    )
    .nullable()
    .notRequired(),
  heated_area: yup
    .number()
    .transform((value, originalValue) =>
      String(originalValue).trim() === "" ? null : value
    )
    .nullable()
    .notRequired(),
  number_of_rooms: yup
    .number()
    .transform((value, originalValue) =>
      String(originalValue).trim() === "" ? null : value
    )
    .typeError("Bitte geben Sie eine gültige Zahl ein")
    .required("Zimmeranzahl ist erforderlich"),
  number_of_bedrooms: yup
    .number()
    .transform((value, originalValue) =>
      String(originalValue).trim() === "" ? null : value
    )
    .nullable()
    .notRequired(),
  number_of_bathrooms: yup
    .number()
    .transform((value, originalValue) =>
      String(originalValue).trim() === "" ? null : value
    )
    .nullable()
    .notRequired(),
  number_of_separate_wc: yup
    .number()
    .transform((value, originalValue) =>
      String(originalValue).trim() === "" ? null : value
    )
    .nullable()
    .notRequired(),
  number_of_balconies: yup
    .number()
    .transform((value, originalValue) =>
      String(originalValue).trim() === "" ? null : value
    )
    .nullable()
    .notRequired(),
  number_of_terraces: yup
    .number()
    .transform((value, originalValue) =>
      String(originalValue).trim() === "" ? null : value
    )
    .nullable()
    .notRequired(),
  number_of_loggias: yup
    .number()
    .transform((value, originalValue) =>
      String(originalValue).trim() === "" ? null : value
    )
    .nullable()
    .notRequired(),
  balcony_terrace_area: yup
    .number()
    .transform((value, originalValue) =>
      String(originalValue).trim() === "" ? null : value
    )
    .nullable()
    .notRequired(),
  number_of_parking_spaces: yup
    .number()
    .transform((value, originalValue) =>
      String(originalValue).trim() === "" ? null : value
    )
    .nullable()
    .notRequired(),
  parking_space_type: yup.string().nullable().notRequired(),
});

// Interface für die Props des Formulars
interface AreaDataFormProps {
  updateFormData: (data: AreaDataFormValues) => void;
  realEstateId: string | string[];
}

interface FormHandle {
  submit: () => Promise<boolean>;
}

export const ApartmentArea = forwardRef<FormHandle, AreaDataFormProps>(
  ({ updateFormData, realEstateId }, ref) => {
    const [loading, setLoading] = useState(true);

    // Verwendung von useForm mit FormProvider
    const methods = useForm<AreaDataFormValues>({
      resolver: yupResolver(validationSchema),
      defaultValues: {
        living_area: 0,
        garden_area: null,
        cellar: false,
        cellar_area: null,
        heated_area: null,
        number_of_rooms: 0,
        number_of_bedrooms: null,
        number_of_bathrooms: null,
        number_of_separate_wc: null,
        number_of_balconies: null,
        number_of_terraces: null,
        number_of_loggias: null,
        balcony_terrace_area: null,
        number_of_parking_spaces: null,
        parking_space_type: null,
        balcony_terrace_orientation: [],
      },
    });

    const {
      control,
      handleSubmit,
      reset,
      // setValue,
      // watch,
      formState: { errors },
    } = methods;

    useEffect(() => {
      const fetchData = async () => {
        try {
          const response = await axiosInstance.get(
            `/real-estate/detail/${realEstateId}/?fields=area,specifications,object_category`
          );
          const data = response.data;
          const formData: AreaDataFormValues = {
            living_area: data.area?.living_area,
            garden_area: data.area?.garden_area || null,
            cellar: data.area?.cellar || !!data.area?.cellar_area,
            cellar_area: data.area?.cellar_area || null,
            heated_area: data.area?.heated_area || null,
            number_of_rooms: data.area?.number_of_rooms,
            number_of_bedrooms: data.area?.number_of_bedrooms || null,
            number_of_bathrooms: data.area?.number_of_bathrooms || null,
            number_of_separate_wc: data.area?.number_of_separate_wc || null,
            number_of_balconies: data.area?.number_of_balconies || null,
            number_of_terraces: data.area?.number_of_terraces || null,
            number_of_loggias: data.area?.number_of_loggias || null,
            balcony_terrace_area: data.area?.balcony_terrace_area || null,
            number_of_parking_spaces:
              data.area?.number_of_parking_spaces || null,
            parking_space_type:
              data.specifications?.parking_space_type[0] || "",
            balcony_terrace_orientation:
              data.specifications?.balcony_terrace_orientation || [],
            area_id: data.area?.id || null,
            specifications_id: data.specifications?.id || null,
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
              area: {
                ...(formData.area_id ? { id: formData.area_id } : {}),
                living_area: formData.living_area,
                garden_area: formData.garden_area,
                cellar_area: formData.cellar_area,
                heated_area: formData.heated_area,
                number_of_rooms: formData.number_of_rooms,
                number_of_bedrooms: formData.number_of_bedrooms,
                number_of_bathrooms: formData.number_of_bathrooms,
                number_of_separate_wc: formData.number_of_separate_wc,
                number_of_balconies: formData.number_of_balconies,
                number_of_terraces: formData.number_of_terraces,
                number_of_loggias: formData.number_of_loggias,
                balcony_terrace_area: formData.balcony_terrace_area,
                number_of_parking_spaces: formData.number_of_parking_spaces,
              },
              specifications: {
                ...(formData.specifications_id
                  ? { id: formData.specifications_id }
                  : {}),
                cellar: formData.cellar ? "JA" : "NEIN",
                parking_space_type: formData.parking_space_type
                  ? [formData.parking_space_type]
                  : [],
                balcony_terrace_orientation:
                  formData.balcony_terrace_orientation || [],
                equipment_category: "STANDARD",
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
            <div className={styles.formGroupRow}>
              <div className={styles.formGroup}>
                <Label className={styles.formLabel}>
                  <div>
                    Wohnfläche (m²)<span className="text-red-500">*</span>
                    {errors.living_area && (
                      <p className={styles.errorMessage}>
                        {errors.living_area.message}
                      </p>
                    )}
                  </div>
                </Label>
                <Controller
                  name="living_area"
                  control={control}
                  render={({ field }) => (
                    <Input
                      id="living_area"
                      type="number"
                      {...field}
                      value={field.value ?? ""}
                    />
                  )}
                />
              </div>
              <div className={styles.formGroup}>
                <Label className={styles.formLabel}>
                  Beheizbare Fläche (m²)
                </Label>
                <Controller
                  name="heated_area"
                  control={control}
                  render={({ field }) => (
                    <Input
                      id="heated_area"
                      type="number"
                      {...field}
                      value={field.value ?? ""}
                    />
                  )}
                />
              </div>
            </div>
          </div>

          {/* Einbindung der ausgelagerten Komponenten */}
          <CellarComponent />
          <RoomLayoutComponent />
          <ParkingAreaComponent />
          <OpenSpacesComponent />
        </div>
      </FormProvider>
    );
  }
);
