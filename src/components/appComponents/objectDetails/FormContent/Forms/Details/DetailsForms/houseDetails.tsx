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
import { Input } from "@/components/ui/input";

// Import der Komponenten
import EquipmentComponent from "../DetailsComponents/EquipmentComponent";
import ConstructionComponent from "../DetailsComponents/ConstructionComponent";
import ConditionComponent from "../DetailsComponents/ConditionComponent";
import BathroomComponent from "../DetailsComponents/BathroomComponent";
import FloorCoveringComponent from "../DetailsComponents/FloorCoveringComponent";
import KitchenComponent from "../DetailsComponents/KitchenComponent";
import SecurityComponent from "../DetailsComponents/SecurityComponent";
import HeatingComponent from "../DetailsComponents/HeatingComponent";
import LivingAmenitiesComponent from "../DetailsComponents/LivingAmenitiesComponent";

// Import der Auswahlmöglichkeiten
import {
  BATHROOM_CHOICES,
  FLOOR_CHOICES,
  FURNISHED_CHOICES,
  HEATINGFUEL_CHOICES,
  HEATINGTYPE_CHOICES,
  KITCHEN_CHOICES,
  SECURITY_TECHNOLOGY_CHOICES,
  CONDITION_CHOICES,
  ROOF_SHAPE_CHOISES,
} from "../DetailsComponents/constants";

interface DetailDataFormValues {
  air_conditioned?: boolean | null;
  barrier_free?: boolean | null;
  bathroom: string[];
  bicycle_room?: boolean | null;
  elevator_person?: boolean | null;
  equipment_category: "STANDARD" | "GEHOBEN" | "LUXUS";
  fireplace?: boolean | null;
  number_of_floors?: number | null;
  floor: string[];
  furnished: string | null;
  heating_fuel: string | null;
  heating_type: string | null;
  kitchen: string[];
  laundry_room?: boolean | null;
  library?: boolean | null;
  sauna?: boolean | null;
  security_technology: string[];
  senior_friendly?: boolean | null;
  shutters?: boolean | null;
  suitable_for_shared_flat?: boolean | null;
  swimming_pool?: boolean | null;
  wheelchair_accessible?: boolean | null;
  construction_year?: number | null;
  last_modernization?: number | null;
  condition?: string | null;
  age?: string | null;
  geo_id?: string | null;
  specifications_id?: string | null;
  condition_details_id?: string | null;
  construction_method?: string | null;
  roof_shape?: string | null;
  conservatory?: boolean | null;
}

const validationSchema = yup.object().shape({
  air_conditioned: yup.boolean().nullable().notRequired(),
  barrier_free: yup.boolean().nullable().notRequired(),
  bathroom: yup
    .array()
    .of(
      yup
        .string()
        .oneOf(BATHROOM_CHOICES.map((choice) => choice.value))
        .required()
    )
    .required(),
  bicycle_room: yup.boolean().nullable().notRequired(),
  elevator_person: yup.boolean().nullable().notRequired(),
  equipment_category: yup
    .string()
    .oneOf(["STANDARD", "GEHOBEN", "LUXUS"])
    .required(),
  fireplace: yup.boolean().nullable().notRequired(),
  number_of_floors: yup
    .number()
    .transform((value, originalValue) =>
      String(originalValue).trim() === "" ? null : value
    )
    .nullable()
    .notRequired(),
  floor: yup
    .array()
    .of(
      yup
        .string()
        .oneOf(FLOOR_CHOICES.map((choice) => choice.value))
        .required()
    )
    .required(),
  furnished: yup
    .string()
    .nullable()
    .defined()
    .test(
      "is-valid-furnished",
      "Ungültiger Wert für Möblierung",
      (value): value is "VOLL" | "TEIL" | null =>
        value === null ||
        FURNISHED_CHOICES.some((choice) => choice.value === value)
    ),
  heating_fuel: yup
    .string()
    .nullable()
    .defined()
    .test(
      "is-valid-heating-fuel",
      "Ungültiger Wert für Heizungsbrennstoff",
      (value): value is string | null =>
        value === null ||
        HEATINGFUEL_CHOICES.some((choice) => choice.value === value)
    ),
  heating_type: yup
    .string()
    .nullable()
    .defined()
    .test(
      "is-valid-heating-type",
      "Ungültiger Wert für Heizungsart",
      (value): value is string | null =>
        value === null ||
        HEATINGTYPE_CHOICES.some((choice) => choice.value === value)
    ),
  kitchen: yup
    .array()
    .of(
      yup
        .string()
        .oneOf(KITCHEN_CHOICES.map((choice) => choice.value))
        .required()
    )
    .required(),
  laundry_room: yup.boolean().nullable().notRequired(),
  library: yup.boolean().nullable().notRequired(),
  sauna: yup.boolean().nullable().notRequired(),
  security_technology: yup
    .array()
    .of(
      yup
        .string()
        .oneOf(SECURITY_TECHNOLOGY_CHOICES.map((choice) => choice.value))
        .required()
    )
    .required(),
  senior_friendly: yup.boolean().nullable().notRequired(),
  shutters: yup.boolean().nullable().notRequired(),
  suitable_for_shared_flat: yup.boolean().nullable().notRequired(),
  swimming_pool: yup.boolean().nullable().notRequired(),
  wheelchair_accessible: yup.boolean().nullable().notRequired(),
  construction_year: yup.number().nullable().notRequired(),
  last_modernization: yup.number().nullable().notRequired(),
  condition: yup
    .string()
    .oneOf(CONDITION_CHOICES.map((choice) => choice.value))
    .notRequired(),
  age: yup.string().nullable().oneOf(["ALTBAU", "NEUBAU", null]),
  construction_method: yup
    .string()
    .nullable()
    .oneOf(["MASSIV", "FERTIGTEILE", "HOLZ", null]),
  roof_shape: yup
    .string()
    .nullable()
    .oneOf(ROOF_SHAPE_CHOISES.map((choice) => choice.value)),
  conservatory: yup.boolean().nullable().notRequired(),
});

interface DetailDataFormProps {
  updateFormData: (data: DetailDataFormValues) => void;
  realEstateId: string | string[];
  propertyType: string | null;
}

interface FormHandle {
  submit: () => Promise<boolean>;
}

export const HouseDetails = forwardRef<
  FormHandle,
  DetailDataFormProps
>(({ updateFormData, realEstateId, propertyType }, ref) => {
  const [loading, setLoading] = useState(true);

  const methods = useForm<DetailDataFormValues>({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      air_conditioned: false,
      barrier_free: false,
      bathroom: [],
      bicycle_room: false,
      elevator_person: false,
      equipment_category: "STANDARD",
      fireplace: false,
      number_of_floors: null,
      floor: [],
      furnished: null,
      heating_fuel: null,
      heating_type: null,
      kitchen: [],
      laundry_room: false,
      library: false,
      sauna: false,
      security_technology: [],
      senior_friendly: false,
      shutters: false,
      suitable_for_shared_flat: false,
      swimming_pool: false,
      wheelchair_accessible: false,
      construction_year: null,
      last_modernization: null,
      condition: null,
      age: null,
      construction_method: null,
      roof_shape: null,
      conservatory: false,
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
          air_conditioned: data.specifications?.air_conditioned || false,
          barrier_free: data.specifications?.barrier_free || false,
          bathroom: data.specifications?.bathroom || [],
          bicycle_room: data.specifications?.bicycle_room || false,
          elevator_person: data.specifications?.elevator_person || false,
          equipment_category:
            data.specifications.equipment_category || "STANDARD",
          fireplace: data.specifications?.fireplace || false,
          number_of_floors: data.geo?.number_of_floors || null,
          floor: data.specifications?.floor || [],
          furnished: data.specifications?.furnished || null,
          heating_fuel: data.specifications?.heating_fuel[0] || null,
          heating_type: data.specifications?.heating_type[0] || null,
          kitchen: data.specifications?.kitchen || [],
          laundry_room: data.specifications?.laundry_room || false,
          library: data.specifications?.library || false,
          sauna: data.specifications?.sauna || false,
          security_technology: data.specifications?.security_technology || [],
          senior_friendly: data.specifications?.senior_friendly || false,
          shutters: data.specifications?.shutters || false,
          suitable_for_shared_flat:
            data.specifications?.suitable_for_shared_flat || false,
          swimming_pool: data.specifications?.swimming_pool || false,
          wheelchair_accessible:
            data.specifications?.wheelchair_accessible || false,
          construction_year: data.condition_details?.construction_year || null,
          last_modernization:
            data.condition_details?.last_modernization || null,
          condition: data.condition_details?.condition || null,
          age: data.condition_details?.age || null,
          geo_id: data.geo?.id || null,
          specifications_id: data.specifications?.id || null,
          condition_details_id: data.condition_details?.id || null,
          construction_method: data.specifications?.construction_method || null,
          roof_shape: data.specifications?.roof_shape || null,
          conservatory: data.specifications?.conservatory || false,
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
              number_of_floors: formData.number_of_floors,
            },
            specifications: {
              ...(formData.specifications_id
                ? { id: formData.specifications_id }
                : {}),
              air_conditioned: formData.air_conditioned || null,
              barrier_free: formData.barrier_free || null,
              bathroom: formData.bathroom || [],
              bicycle_room: formData.bicycle_room || null,
              elevator_person: formData.elevator_person || null,
              equipment_category: formData.equipment_category || "STANDARD",
              fireplace: formData.fireplace || null,
              floor: formData.floor || [],
              furnished: formData.furnished || null,
              heating_fuel: formData.heating_fuel
                ? [formData.heating_fuel]
                : [],
              heating_type: formData.heating_type
                ? [formData.heating_type]
                : [],
              kitchen: formData.kitchen || [],
              laundry_room: formData.laundry_room || null,
              library: formData.library || null,
              sauna: formData.sauna || null,
              security_technology: formData.security_technology || [],
              senior_friendly: formData.senior_friendly || null,
              shutters: formData.shutters || null,
              suitable_for_shared_flat:
                formData.suitable_for_shared_flat || null,
              swimming_pool: formData.swimming_pool || null,
              wheelchair_accessible: formData.wheelchair_accessible || null,
              construction_method: formData.construction_method || null,
              conservatory: formData.conservatory || null,
            },
            condition_details: {
              ...(formData.condition_details_id
                ? { id: formData.condition_details_id }
                : {}),
              construction_year: formData.construction_year || null,
              last_modernization: formData.last_modernization || null,
              condition: formData.condition || null,
              age: formData.age || null,
              roof_shape: formData.roof_shape || null,
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
            <div className={styles.formGroupRow}>
              <EquipmentComponent />

              {/* Baweise */}
              <div className={styles.formGroup}>
                <Label className={styles.formLabel}>Baweise</Label>
                <Controller
                  name="construction_method"
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
                        <SelectItem value="MASSIV">Massiv</SelectItem>
                        <SelectItem value="FERTIGTEILE">Fertigteile</SelectItem>
                        <SelectItem value="HOLZ">Holz</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>

              <div className={styles.formGroup}>
                <Label className={styles.formLabel}>Dachform</Label>
                <Controller
                  name="roof_shape"
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
                        {ROOF_SHAPE_CHOISES.map((choice) => (
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
          <ConstructionComponent />
          <ConditionComponent />
          <div className={styles.formGroupRow}>
            {/* Anzahl der Stockwerke */}
            <div className={styles.formGroup}>
              <Label className={styles.formLabel}>Anzahl der Stockwerke</Label>
              <Controller
                name="number_of_floors"
                control={control}
                render={({ field }) => (
                  <Input
                    type="number"
                    placeholder="Stockwerk insgesamt"
                    {...field}
                    value={
                      field.value !== undefined && field.value !== null
                        ? field.value
                        : ""
                    }
                    onChange={(e) => {
                      const value =
                        e.target.value === "" ? null : Number(e.target.value);
                      field.onChange(value);
                    }}
                  />
                )}
              />
            </div>
          </div>
          <HeatingComponent />
          <BathroomComponent />
          <FloorCoveringComponent />
          <KitchenComponent />
          <SecurityComponent />
          <LivingAmenitiesComponent />
        </div>
      </div>
    </FormProvider>
  );
});
