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
import axiosInstance from "@/lib/axiosInstance";

// Import der ausgelagerten Komponenten
import GastroComponent from "../AreaComponents/GastroComponent";
import CellarComponent from "../AreaComponents/CellarComponent";
import StorageComponent from "../AreaComponents/StorageComponent";
import CommercialRoomComponent from "../AreaComponents/CommercialRoomComponent";
import ParkingAreaComponent from "../AreaComponents/ParkingAreaComponent";
import OpenSpacesComponent from "../AreaComponents/OpenSpacesComponent";

// Definition der Formularwerte
interface AreaDataFormValues {
  usable_area: number;
  plot_area?: number | null;
  garden_area?: number | null;
  storage_room?: boolean | null;
  storage_area?: number | null;
  cellar?: boolean | null;
  cellar_area?: number | null;
  administration_area?: number | null;
  gastronomy_area?: number | null;
  heated_area?: number | null;

  number_of_seats_in_guest_room?: number | null;
  number_of_beds?: number | null;
  number_of_conference_rooms?: number | null;

  number_of_rooms?: number | null;
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
  usable_area: yup
    .number()
    .transform((value, originalValue) =>
      String(originalValue).trim() === "" ? null : value
    )
    .typeError("Bitte geben Sie eine gültige Zahl ein")
    .min(1, "Nutzfläche muss größer als 0 sein")
    .required("Nutzfläche ist erforderlich"),
  plot_area: yup
    .number()
    .transform((value, originalValue) =>
      String(originalValue).trim() === "" ? null : value
    )
    .nullable()
    .notRequired(),
  gastronomy_area: yup
    .number()
    .transform((value, originalValue) =>
      String(originalValue).trim() === "" ? null : value
    )
    .nullable()
    .notRequired(),
  garden_area: yup
    .number()
    .transform((value, originalValue) =>
      String(originalValue).trim() === "" ? null : value
    )
    .nullable()
    .notRequired(),
  storage_room: yup.boolean().nullable().notRequired(),
  storage_area: yup
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
  administration_area: yup
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
  number_of_seats_in_guest_room: yup
    .number()
    .transform((value, originalValue) =>
      String(originalValue).trim() === "" ? null : value
    )
    .nullable()
    .notRequired(),
  number_of_beds: yup
    .number()
    .transform((value, originalValue) =>
      String(originalValue).trim() === "" ? null : value
    )
    .nullable()
    .notRequired(),
  number_of_conference_rooms: yup
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

export const GastronomieArea = forwardRef<FormHandle, AreaDataFormProps>(
  ({ updateFormData, realEstateId }, ref) => {
    const [loading, setLoading] = useState(true);

    // Verwendung von useForm mit FormProvider
    const methods = useForm<AreaDataFormValues>({
      resolver: yupResolver(validationSchema),
      defaultValues: {
        usable_area: 0,
        gastronomy_area: null,
        plot_area: null,
        garden_area: null,
        storage_room: false,
        storage_area: null,
        cellar: false,
        cellar_area: null,
        administration_area: null,
        heated_area: null,
        number_of_seats_in_guest_room: null,
        number_of_beds: null,
        number_of_conference_rooms: null,
        number_of_rooms: null,
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
            usable_area: data.area?.usable_area,
            gastronomy_area: data.area?.gastronomy_area,
            garden_area: data.area?.garden_area || null,
            plot_area: data.area?.plot_area || null,
            storage_room:
              data.specifications?.storage_room ||
              !!data.specifications?.storage_room,
            storage_area: data.area?.storage_area || null,
            cellar: data.area?.cellar || !!data.area?.cellar_area,
            cellar_area: data.area?.cellar_area || null,
            administration_area: data.area?.administration_area || null,
            heated_area: data.area?.heated_area || null,
            number_of_seats_in_guest_room:
              data.area?.number_of_seats_in_guest_room || null,
            number_of_beds: data.area?.number_of_beds || null,
            number_of_conference_rooms:
              data.area?.number_of_conference_rooms || null,
            number_of_rooms: data.area?.number_of_rooms,
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
                usable_area: formData.usable_area,
                gastronomy_area: formData.gastronomy_area,
                garden_area: formData.garden_area,
                plot_area: formData.plot_area,
                storage_area: formData.cellar_area,
                cellar_area: formData.cellar_area,
                administration_area: formData.administration_area,
                heated_area: formData.heated_area,
                number_of_seats_in_guest_room:
                  formData.number_of_seats_in_guest_room,
                number_of_beds: formData.number_of_beds,
                number_of_conference_rooms: formData.number_of_conference_rooms,
                number_of_rooms: formData.number_of_rooms,
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
                storage_room: formData.storage_room,
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
                    Nutzfläche (m²)<span className="text-red-500">*</span>
                    {errors.usable_area && (
                      <p className={styles.errorMessage}>
                        {errors.usable_area.message}
                      </p>
                    )}
                  </div>
                </Label>
                <Controller
                  name="usable_area"
                  control={control}
                  render={({ field }) => (
                    <Input
                      id="usable_area"
                      type="number"
                      {...field}
                      value={field.value ?? ""}
                    />
                  )}
                />
              </div>
              <div className={styles.formGroup}>
                <Label className={styles.formLabel}>
                  Gastronomiefläche (m²)
                </Label>
                <Controller
                  name="gastronomy_area"
                  control={control}
                  render={({ field }) => (
                    <Input
                      id="gastronomy_area"
                      type="number"
                      {...field}
                      value={field.value ?? ""}
                    />
                  )}
                />
              </div>
              <div className={styles.formGroup}>
                <Label className={styles.formLabel}>
                  Grundstücksfläche (m²)
                </Label>
                <Controller
                  name="plot_area"
                  control={control}
                  render={({ field }) => (
                    <Input
                      id="plot_area"
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
          <GastroComponent />
          <CommercialRoomComponent />
          <ParkingAreaComponent />
          <OpenSpacesComponent />
          <div>
            <h3 className={styles.subheadline}>Sonstige</h3>
            <div className={styles.formGroupRow}>
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
            <div className="pt-4">
              <StorageComponent />
              <CellarComponent />
            </div>
          </div>
        </div>
      </FormProvider>
    );
  }
);