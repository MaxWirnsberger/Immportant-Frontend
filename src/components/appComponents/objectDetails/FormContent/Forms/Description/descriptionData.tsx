import React, {
  forwardRef,
  useImperativeHandle,
  useEffect,
  useState,
} from "react";
import * as yup from "yup";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import axiosInstance from "@/lib/axiosInstance";
import style from "../../formContent.module.css";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Definition der Auswahlmöglichkeiten
const distanceOptions = [
  { id: "airport", label: "Flughafen" },
  { id: "train_station", label: "Fernbahnhof" },
  { id: "highway", label: "Autobahn" },
  { id: "subway", label: "U-Bahn" },
  { id: "bus", label: "Bus" },
  { id: "kindergarten", label: "Kindergarten" },
  { id: "primary_school", label: "Grundschule" },
  { id: "secondary_school", label: "Hauptschule" },
  { id: "realschule", label: "Realschule" },
  { id: "comprehensive_school", label: "Gesamtschule" },
  { id: "gymnasium", label: "Gymnasium" },
  { id: "city_center", label: "Stadtzentrum" },
  { id: "shopping_facilities", label: "Einkaufsmöglichkeiten" },
  { id: "restaurants", label: "Gaststätten" },
  { id: "sports_beach", label: "Strand" },
  { id: "sports_lake", label: "See" },
  { id: "sports_sea", label: "Meer" },
  { id: "sports_ski_area", label: "Skigebiet" },
  { id: "sports_facilities", label: "Sportanlagen" },
  { id: "sports_hiking_areas", label: "Wandergebiete" },
  { id: "sports_recreation_areas", label: "Naherholung" },
];

interface DescriptionFormValues {
  // Infrastructure fields
  infrastructure_id?: string | null;
  delivery: boolean;
  view?: string | null;
  distance_airport?: number | null;
  distance_train_station?: number | null;
  distance_highway?: number | null;
  distance_subway?: number | null;
  distance_bus?: number | null;
  distance_kindergarten?: number | null;
  distance_primary_school?: number | null;
  distance_secondary_school?: number | null;
  distance_realschule?: number | null;
  distance_comprehensive_school?: number | null;
  distance_gymnasium?: number | null;
  distance_city_center?: number | null;
  distance_shopping_facilities?: number | null;
  distance_restaurants?: number | null;
  distance_sports_beach?: number | null;
  distance_sports_lake?: number | null;
  distance_sports_sea?: number | null;
  distance_sports_ski_area?: number | null;
  distance_sports_facilities?: number | null;
  distance_sports_hiking_areas?: number | null;
  distance_sports_recreation_areas?: number | null;

  // FreeTexts fields
  free_texts_id?: string | null;
  object_title: string;
  location_description?: string | null;
  equipment_description?: string | null;
  object_description?: string | null;
}

export const descriptionValidationSchema = yup.object().shape({
  delivery: yup.boolean().required(),
  view: yup.string().nullable().oneOf(["FERNE", "SEE", "BERGE", "MEER", null]),
  distance_airport: yup.number().nullable(),
  distance_train_station: yup.number().nullable(),
  distance_highway: yup.number().nullable(),
  distance_subway: yup.number().nullable(),
  distance_bus: yup.number().nullable(),
  distance_kindergarten: yup.number().nullable(),
  distance_primary_school: yup.number().nullable(),
  distance_secondary_school: yup.number().nullable(),
  distance_realschule: yup.number().nullable(),
  distance_comprehensive_school: yup.number().nullable(),
  distance_gymnasium: yup.number().nullable(),
  distance_city_center: yup.number().nullable(),
  distance_shopping_facilities: yup.number().nullable(),
  distance_restaurants: yup.number().nullable(),
  distance_sports_beach: yup.number().nullable(),
  distance_sports_lake: yup.number().nullable(),
  distance_sports_sea: yup.number().nullable(),
  distance_sports_ski_area: yup.number().nullable(),
  distance_sports_facilities: yup.number().nullable(),
  distance_sports_hiking_areas: yup.number().nullable(),
  distance_sports_recreation_areas: yup.number().nullable(),

  object_title: yup
    .string()
    .max(255, "Der gesamte Titel darf maximal 255 Zeichen lang sein.")
    .required("Es muss ein Titel Text vergeben werden."),
  location_description: yup.string().notRequired(),
  equipment_description: yup.string().notRequired(),
  object_description: yup.string().notRequired(),
});

interface DescriptionFormProps {
  updateFormData: (data: any) => void;
  realEstateId: string | string[];
}

interface FormHandle {
  submit: () => Promise<boolean>;
}

export const DescriptionDataForm = forwardRef<FormHandle, DescriptionFormProps>(
  ({ updateFormData, realEstateId }, ref) => {
    const [loading, setLoading] = useState(true);
    const [selectedDistances, setSelectedDistances] = useState<string[]>([]);
    const {
      control,
      handleSubmit,
      setValue,
      reset,
      formState: { errors },
    } = useForm<DescriptionFormValues>({
      resolver: yupResolver(descriptionValidationSchema),
      defaultValues: {
        // Infrastructure fields
        delivery: false,
        view: null,
        distance_airport: null,
        distance_train_station: null,
        distance_highway: null,
        distance_subway: null,
        distance_bus: null,
        distance_kindergarten: null,
        distance_primary_school: null,
        distance_secondary_school: null,
        distance_realschule: null,
        distance_comprehensive_school: null,
        distance_gymnasium: null,
        distance_city_center: null,
        distance_shopping_facilities: null,
        distance_restaurants: null,
        distance_sports_beach: null,
        distance_sports_lake: null,
        distance_sports_sea: null,
        distance_sports_ski_area: null,
        distance_sports_facilities: null,
        distance_sports_hiking_areas: null,
        distance_sports_recreation_areas: null,

        // FreeTexts fields
        object_title: "",
        location_description: null,
        equipment_description: null,
        object_description: null,
      },
    });

    useEffect(() => {
      const fetchData = async () => {
        try {
          const response = await axiosInstance.get(
            `/real-estate/detail/${realEstateId}/?fields=infrastructure,free_texts`
          );
          const data = response.data;
          const formData: DescriptionFormValues = {
            infrastructure_id: data.infrastructure?.id || null,
            delivery: data.infrastructure?.delivery || false,
            view: data.infrastructure?.view || null,
            distance_airport: data.infrastructure?.distance_airport || null,
            distance_train_station:
              data.infrastructure?.distance_train_station || null,
            distance_highway: data.infrastructure?.distance_highway || null,
            distance_subway: data.infrastructure?.distance_subway || null,
            distance_bus: data.infrastructure?.distance_bus || null,
            distance_kindergarten:
              data.infrastructure?.distance_kindergarten || null,
            distance_primary_school:
              data.infrastructure?.distance_primary_school || null,
            distance_secondary_school:
              data.infrastructure?.distance_secondary_school || null,
            distance_realschule:
              data.infrastructure?.distance_realschule || null,
            distance_comprehensive_school:
              data.infrastructure?.distance_comprehensive_school || null,
            distance_gymnasium: data.infrastructure?.distance_gymnasium || null,
            distance_city_center:
              data.infrastructure?.distance_city_center || null,
            distance_shopping_facilities:
              data.infrastructure?.distance_shopping_facilities || null,
            distance_restaurants:
              data.infrastructure?.distance_restaurants || null,
            distance_sports_beach:
              data.infrastructure?.distance_sports_beach || null,
            distance_sports_lake:
              data.infrastructure?.distance_sports_lake || null,
            distance_sports_sea:
              data.infrastructure?.distance_sports_sea || null,
            distance_sports_ski_area:
              data.infrastructure?.distance_sports_ski_area || null,
            distance_sports_facilities:
              data.infrastructure?.distance_sports_facilities || null,
            distance_sports_hiking_areas:
              data.infrastructure?.distance_sports_hiking_areas || null,
            distance_sports_recreation_areas:
              data.infrastructure?.distance_sports_recreation_areas || null,

            free_texts_id: data.free_texts?.id || null,
            object_title: data.free_texts?.object_title || null,
            location_description: data.free_texts?.location_description || null,
            equipment_description:
              data.free_texts?.equipment_description || null,
            object_description: data.free_texts?.object_description || null,
          };
          reset(formData);

          // Initialisieren der ausgewählten Distanzen
          const initialSelectedDistances = distanceOptions
            .filter(
              (option) =>
                formData[
                  `distance_${option.id}` as keyof DescriptionFormValues
                ] !== null
            )
            .map((option) => option.id);
          setSelectedDistances(initialSelectedDistances);

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

    const toggleDistance = (distance: string) => {
      setSelectedDistances((prev) => {
        const updatedDistances = prev.includes(distance)
          ? prev.filter((item) => item !== distance)
          : [...prev, distance];

        if (!updatedDistances.includes(distance)) {
          setValue(`distance_${distance}` as keyof DescriptionFormValues, null);
        }

        return updatedDistances;
      });
    };

    useImperativeHandle(ref, () => ({
      submit: async () => {
        let isValid = false;
        try {
          await handleSubmit(async (formData) => {
            const nestedData = {
              infrastructure: {
                ...(formData.infrastructure_id
                  ? { id: formData.infrastructure_id }
                  : {}),
                delivery: formData.delivery ?? false,
                view: formData.view ?? null,
                distance_airport: formData.distance_airport ?? null,
                distance_train_station: formData.distance_train_station ?? null,
                distance_highway: formData.distance_highway ?? null,
                distance_subway: formData.distance_subway ?? null,
                distance_bus: formData.distance_bus ?? null,
                distance_kindergarten: formData.distance_kindergarten ?? null,
                distance_primary_school:
                  formData.distance_primary_school ?? null,
                distance_secondary_school:
                  formData.distance_secondary_school ?? null,
                distance_realschule: formData.distance_realschule ?? null,
                distance_comprehensive_school:
                  formData.distance_comprehensive_school ?? null,
                distance_gymnasium: formData.distance_gymnasium ?? null,
                distance_city_center: formData.distance_city_center ?? null,
                distance_shopping_facilities:
                  formData.distance_shopping_facilities ?? null,
                distance_restaurants: formData.distance_restaurants ?? null,
                distance_sports_beach: formData.distance_sports_beach ?? null,
                distance_sports_lake: formData.distance_sports_lake ?? null,
                distance_sports_sea: formData.distance_sports_sea ?? null,
                distance_sports_ski_area:
                  formData.distance_sports_ski_area ?? null,
                distance_sports_facilities:
                  formData.distance_sports_facilities ?? null,
                distance_sports_hiking_areas:
                  formData.distance_sports_hiking_areas ?? null,
                distance_sports_recreation_areas:
                  formData.distance_sports_recreation_areas ?? null,
              },
              free_texts: {
                ...(formData.free_texts_id
                  ? { id: formData.free_texts_id }
                  : {}),
                object_title: formData.object_title ?? "",
                location_description: formData.location_description ?? "",
                equipment_description: formData.equipment_description ?? "",
                object_description: formData.object_description ?? "",
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
      return <div className={style.loading}>Laden...</div>;
    }

    return (
      <div className={style.form}>
        {/* Infrastruktur */}
        <div className={style.formSection}>
          <h3 className={style.subheadline}>Infrastruktur</h3>

          <div className={style.formGroupRow}>
            {/* Zulieferung */}
            <div className={style.formGroup}>
              <Label className={style.formLabel}>Zulieferung</Label>
              <Controller
                name="delivery"
                control={control}
                render={({ field: { value, onChange } }) => (
                  <Switch
                    id="delivery"
                    checked={value}
                    onCheckedChange={onChange}
                  />
                )}
              />
            </div>

            {/* Ausblick */}
            <div className={style.formGroup}>
              <Label className={style.formLabel}>Ausblick</Label>
              <Controller
                name="view"
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
                      <SelectValue placeholder="Wählen Sie einen Ausblick" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="NONE">Keine Auswahl</SelectItem>
                      <SelectItem value="FERNE">
                        Ausblick in die Ferne
                      </SelectItem>
                      <SelectItem value="SEE">See</SelectItem>
                      <SelectItem value="BERGE">Berge</SelectItem>
                      <SelectItem value="MEER">Meer</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
          </div>

          {/* Distanzen Auswahl Buttons */}
          <div className={style.formGroup}>
            <Label className={style.formLabel}>Distanzen</Label>
            <div className={style.buttonGroup}>
              {distanceOptions.map((distance) => (
                <Button
                  key={distance.id}
                  type="button"
                  onClick={() => toggleDistance(distance.id)}
                  className={
                    selectedDistances.includes(distance.id)
                      ? style.buttonActive
                      : style.buttonInactive
                  }
                >
                  {distance.label}
                </Button>
              ))}
            </div>
          </div>

          {/* Distanzen Eingabefelder */}
          <div className={`${style.formGroupRow} flex-wrap`}>
            {selectedDistances.map((distance) => (
              <div className={style.formGroup} key={distance}>
                <Label className={style.formLabel}>
                  {`Distanz ${
                    distanceOptions.find((d) => d.id === distance)?.label
                  } (km)`}
                </Label>
                <Controller
                  name={`distance_${distance}` as keyof DescriptionFormValues}
                  control={control}
                  render={({ field }) => {
                    const value = field.value ?? "";
                    return (
                      <Input
                        id={`distance_${distance}`}
                        type="number"
                        {...field}
                        value={typeof value === "number" ? value : ""}
                        onChange={(e) => {
                          const inputValue = e.target.value;
                          field.onChange(
                            inputValue ? Number(inputValue) : null
                          );
                        }}
                      />
                    );
                  }}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Freitexte */}
        <div className={style.formSection}>
          <h3 className={style.subheadline}>Freitexte</h3>

          <div className={style.formGroup}>
            <Label className={style.formLabel}>
              <div>
                Objekttitel<span className="text-red-500">*</span>
                {errors.object_title && (
                  <p className="text-red-500">{errors.object_title.message}</p>
                )}
              </div>
            </Label>
            <Controller
              name="object_title"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  id="object_title"
                  type="text"
                  maxLength={255}
                  value={field.value ?? ""}
                />
              )}
            />
          </div>

          <div className={style.formGroup}>
            <Label className={style.formLabel}>Objektbeschreibung</Label>
            <Controller
              name="object_description"
              control={control}
              render={({ field }) => (
                <Textarea
                  {...field}
                  id="object_description"
                  value={field.value ?? ""}
                  className="h-60"
                />
              )}
            />
          </div>

          <div className={style.formGroup}>
            <Label className={style.formLabel}>Lagebeschreibung</Label>
            <Controller
              name="location_description"
              control={control}
              render={({ field }) => (
                <Textarea
                  {...field}
                  id="location_description"
                  value={field.value ?? ""}
                  className="h-60"
                />
              )}
            />
          </div>

          <div className={style.formGroup}>
            <Label className={style.formLabel}>Ausstattungsbeschreibung</Label>
            <Controller
              name="equipment_description"
              control={control}
              render={({ field }) => (
                <Textarea
                  {...field}
                  id="equipment_description"
                  value={field.value ?? ""}
                  className="h-60"
                />
              )}
            />
          </div>
        </div>
      </div>
    );
  }
);
