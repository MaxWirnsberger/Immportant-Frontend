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

// Import der Komponenten
import ConstructionComponent from "../DetailsComponents/ConstructionComponent";
import ConditionComponent from "../DetailsComponents/ConditionComponent";
import FloorComponent from "../DetailsComponents/FloorComponent";
import FloorCoveringComponent from "../DetailsComponents/FloorCoveringComponent";
import SecurityComponent from "../DetailsComponents/SecurityComponent";
import HeatingComponent from "../DetailsComponents/HeatingComponent";
import IndustrialAmenitiesComponent from "../DetailsComponents/IndustrialAmenitiesComponent";

// Import der Auswahlmöglichkeiten
import {
  EQUIPMENT_CATEGORY_CHOICES,
  FLOOR_CHOICES,
  HEATINGFUEL_CHOICES,
  HEATINGTYPE_CHOICES,
  SECURITY_TECHNOLOGY_CHOICES,
  CONDITION_CHOICES,
} from "../DetailsComponents/constants";

interface DetailDataFormValues {
  air_conditioned?: boolean | null;
  barrier_free?: boolean | null;
  elevator_person?: boolean | null;
  equipment_category: "STANDARD" | "GEHOBEN" | "LUXUS";
  floor_number?: number | null;
  number_of_floors?: number | null;
  floor: string[];
  heating_fuel: string | null;
  heating_type: string | null;
  security_technology: string[];
  shutters?: boolean | null;
  wheelchair_accessible?: boolean | null;
  construction_year?: number | null;
  last_modernization?: number | null;
  condition?: string | null;
  age?: string | null;
  cable_channels?: boolean | null;
  canteen_cafeteria?: boolean | null;
  data_cabling?: boolean | null;
  elevator_cargo?: boolean | null;
  kitchenette?: boolean | null;
  ramp?: boolean | null;
  geo_id?: string | null;
  specifications_id?: string | null;
  condition_details_id?: string | null;
  laundry_room?: boolean | null;
  lift_platform?: boolean | null;
}

const validationSchema = yup.object().shape({
  air_conditioned: yup.boolean().nullable().notRequired(),
  barrier_free: yup.boolean().nullable().notRequired(),
  elevator_person: yup.boolean().nullable().notRequired(),
  equipment_category: yup
    .string()
    .oneOf(["STANDARD", "GEHOBEN", "LUXUS"])
    .required(),
  floor_number: yup
    .number()
    .transform((value, originalValue) =>
      String(originalValue).trim() === "" ? null : value
    )
    .nullable()
    .notRequired(),
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
  security_technology: yup
    .array()
    .of(
      yup
        .string()
        .oneOf(SECURITY_TECHNOLOGY_CHOICES.map((choice) => choice.value))
        .required()
    )
    .required(),
  shutters: yup.boolean().nullable().notRequired(),
  wheelchair_accessible: yup.boolean().nullable().notRequired(),
  construction_year: yup.number().nullable().notRequired(),
  last_modernization: yup.number().nullable().notRequired(),
  condition: yup
    .string()
    .oneOf(CONDITION_CHOICES.map((choice) => choice.value))
    .notRequired(),
  age: yup.string().nullable().oneOf(["ALTBAU", "NEUBAU", null]),
  cable_channels: yup.boolean().nullable().notRequired(),
  canteen_cafeteria: yup.boolean().nullable().notRequired(),
  data_cabling: yup.boolean().nullable().notRequired(),
  elevator_cargo: yup.boolean().nullable().notRequired(),
  kitchenette: yup.boolean().nullable().notRequired(),
  ramp: yup.boolean().nullable().notRequired(),
  laundry_room: yup.boolean().nullable().notRequired(),
  lift_platform: yup.boolean().nullable().notRequired(),
});

interface DetailDataFormProps {
  updateFormData: (data: DetailDataFormValues) => void;
  realEstateId: string | string[];
}

interface FormHandle {
  submit: () => Promise<boolean>;
}

export const IndustrialDetails = forwardRef<
  FormHandle,
  DetailDataFormProps
>(({ updateFormData, realEstateId }, ref) => {
  const [loading, setLoading] = useState(true);

  const methods = useForm<DetailDataFormValues>({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      air_conditioned: false,
      barrier_free: false,
      elevator_person: false,
      equipment_category: "STANDARD",
      floor_number: null,
      number_of_floors: null,
      floor: [],
      heating_fuel: null,
      heating_type: null,
      security_technology: [],
      shutters: false,
      wheelchair_accessible: false,
      construction_year: null,
      last_modernization: null,
      condition: null,
      age: null,
      cable_channels: false,
      canteen_cafeteria: false,
      data_cabling: false,
      elevator_cargo: false,
      kitchenette: false,
      ramp: false,
      laundry_room: false,
      lift_platform: false,
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
          `/real-estate/detail/${realEstateId}/?fields=geo,condition_details,specifications`
        );
        const data = response.data;
        const formData: DetailDataFormValues = {
          air_conditioned: data.specifications?.air_conditioned || false,
          barrier_free: data.specifications?.barrier_free || false,
          elevator_person: data.specifications?.elevator_person || false,
          equipment_category:
            data.specifications.equipment_category || "STANDARD",
          floor_number: data.geo?.floor_number || null,
          number_of_floors: data.geo?.number_of_floors || null,
          floor: data.specifications?.floor || [],
          heating_fuel: data.specifications?.heating_fuel[0] || null,
          heating_type: data.specifications?.heating_type[0] || null,
          security_technology: data.specifications?.security_technology || [],
          shutters: data.specifications?.shutters || false,
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
          cable_channels: data.specifications?.cable_channels || false,
          canteen_cafeteria: data.specifications?.canteen_cafeteria || false,
          data_cabling: data.specifications?.data_cabling || false,
          elevator_cargo: data.specifications?.elevator_cargo || false,
          kitchenette: data.specifications?.kitchenette || false,
          ramp: data.specifications?.ramp || false,
          laundry_room: data.specifications?.laundry_room || false,
          lift_platform: data.specifications?.lift_platform || false,
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
              floor: formData.floor_number,
              number_of_floors: formData.number_of_floors,
            },
            specifications: {
              ...(formData.specifications_id
                ? { id: formData.specifications_id }
                : {}),
              air_conditioned: formData.air_conditioned || null,
              barrier_free: formData.barrier_free || null,
              elevator_person: formData.elevator_person || null,
              equipment_category: formData.equipment_category || "STANDARD",
              floor: formData.floor || [],
              heating_fuel: formData.heating_fuel
                ? [formData.heating_fuel]
                : [],
              heating_type: formData.heating_type
                ? [formData.heating_type]
                : [],
              security_technology: formData.security_technology || [],
              shutters: formData.shutters || null,
              wheelchair_accessible: formData.wheelchair_accessible || null,
              cable_channels: formData.cable_channels || null,
              canteen_cafeteria: formData.canteen_cafeteria || null,
              data_cabling: formData.data_cabling || null,
              elevator_cargo: formData.elevator_cargo || null,
              kitchenette: formData.kitchenette || null,
              ramp: formData.ramp || null,
              laundry_room: formData.laundry_room || null,
              lift_platform: formData.lift_platform || null,
            },
            condition_details: {
              ...(formData.condition_details_id
                ? { id: formData.condition_details_id }
                : {}),
              construction_year: formData.construction_year || null,
              last_modernization: formData.last_modernization || null,
              condition: formData.condition || null,
              age: formData.age || null,
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
            <h3 className={styles.subheadline}>Merkmale</h3>
            <div className={styles.formGroupRow}>
              <div className={styles.formGroup}>
                <Label className={styles.formLabel}>
                  <div>
                    Ausstattungskategorie<span className="text-red-500">*</span>
                  </div>
                </Label>
                <Controller
                  name="equipment_category"
                  control={control}
                  render={({ field }) => (
                    <Select
                      onValueChange={field.onChange}
                      value={field.value ?? ""}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Wählen Sie eine Kategorie" />
                      </SelectTrigger>
                      <SelectContent>
                        {EQUIPMENT_CATEGORY_CHOICES.map((choice) => (
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
            </div>
          </div>
          <ConditionComponent />
          <FloorComponent />
          <HeatingComponent />
          <FloorCoveringComponent />
          <SecurityComponent />
          <IndustrialAmenitiesComponent />
        </div>
      </div>
    </FormProvider>
  );
});
