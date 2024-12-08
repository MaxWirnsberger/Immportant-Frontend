import React, {
  forwardRef,
  useImperativeHandle,
  useEffect,
  useMemo,
  useState,
} from "react";
import * as yup from "yup";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import axiosInstance from "@/lib/axiosInstance";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import style from "../../formContent.module.css";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const ROOM_TYPES = [{ value: "ZIMMER", label: "Zimmer" }];

const APARTMENT_TYPES = [
  { value: "DACHGESCHOSS", label: "Dachgeschoss" },
  { value: "MAISONETTE", label: "Maisonette" },
  { value: "LOFT-STUDIO-ATELIER", label: "Loft/Studio/Atelier" },
  { value: "PENTHOUSE", label: "Penthouse" },
  { value: "TERRASSEN", label: "Terrassenwohnung" },
  { value: "ETAGE", label: "Etagenwohnung" },
  { value: "ERDGESCHOSS", label: "Erdgeschosswohnung" },
  { value: "SOUTERRAIN", label: "Souterrain" },
  { value: "APARTMENT", label: "Apartment" },
  { value: "FERIENWOHNUNG", label: "Ferienwohnung" },
  { value: "GALERIE", label: "Galeriewohnung" },
  { value: "ROHDACHBODEN", label: "Rohdachboden" },
  { value: "ATTIKAWOHNUNG", label: "Attikawohnung" },
  { value: "KEINE_ANGABE", label: "Keine Angabe" },
];

const HOUSE_TYPES = [
  { value: "REIHENHAUS", label: "Reihenhaus" },
  { value: "REIHENEND", label: "Reihenendhaus" },
  { value: "REIHENMITTEL", label: "Reihenmittelhaus" },
  { value: "REIHENECK", label: "Reiheneckhaus" },
  { value: "DOPPELHAUSHAELFTE", label: "Doppelhaushälfte" },
  { value: "EINFAMILIENHAUS", label: "Einfamilienhaus" },
  { value: "STADTHAUS", label: "Stadthaus" },
  { value: "BUNGALOW", label: "Bungalow" },
  { value: "VILLA", label: "Villa" },
  { value: "RESTHOF", label: "Resthof" },
  { value: "BAUERNHAUS", label: "Bauernhaus" },
  { value: "LANDHAUS", label: "Landhaus" },
  { value: "SCHLOSS", label: "Schloss" },
  { value: "ZWEIFAMILIENHAUS", label: "Zweifamilienhaus" },
  { value: "MEHRFAMILIENHAUS", label: "Mehrfamilienhaus" },
  { value: "FERIENHAUS", label: "Ferienhaus" },
  { value: "BERGHUETTE", label: "Berghütte" },
  { value: "CHALET", label: "Chalet" },
  { value: "STRANDHAUS", label: "Strandhaus" },
  { value: "LAUBE-DATSCHE-GARTENHAUS", label: "Laube/Datsche/Gartenhaus" },
  { value: "APARTMENTHAUS", label: "Apartmenthaus" },
  { value: "BURG", label: "Burg" },
  { value: "HERRENHAUS", label: "Herrenhaus" },
  { value: "FINCA", label: "Finca" },
  { value: "RUSTICO", label: "Rustico" },
  { value: "FERTIGHAUS", label: "Fertighaus" },
  { value: "KEINE_ANGABE", label: "Keine Angabe" },
];

const LAND_TYPES = [
  { value: "WOHNEN", label: "Wohnen" },
  { value: "GEWERBE", label: "Gewerbe" },
  { value: "INDUSTRIE", label: "Industrie" },
  { value: "LAND_FORSTWIRSCHAFT", label: "Land-/Forstwirtschaft" },
  { value: "FREIZEIT", label: "Freizeit" },
  { value: "GEMISCHT", label: "Gemischt" },
  { value: "GEWERBEPARK", label: "Gewerbepark" },
  { value: "SONDERNUTZUNG", label: "Sondernutzung" },
  { value: "SEELIEGENSCHAFT", label: "Seeliegenschaft" },
];

const OFFICE_PRACTICE_TYPES = [
  { value: "BUEROFLAECHE", label: "Bürofläche" },
  { value: "BUEROHAUS", label: "Bürohaus" },
  { value: "BUEROZENTRUM", label: "Bürozentrum" },
  { value: "LOFT_ATELIER", label: "Loft/Atelier" },
  { value: "PRAXIS", label: "Praxis" },
  { value: "PRAXISFLAECHE", label: "Praxisfläche" },
  { value: "PRAXISHAUS", label: "Praxishaus" },
  { value: "AUSSTELLUNGSFLAECHE", label: "Ausstellungsfläche" },
  { value: "COWORKING", label: "Coworking" },
  { value: "SHARED_OFFICE", label: "Shared Office" },
];

const RETAIL_TYPES = [
  { value: "LADENLOKAL", label: "Ladenlokal" },
  { value: "EINZELHANDELSLADEN", label: "Einzelhandelsladen" },
  { value: "VERBRAUCHERMARKT", label: "Verbrauchermarkt" },
  { value: "EINKAUFSZENTRUM", label: "Einkaufszentrum" },
  { value: "KAUFHAUS", label: "Kaufhaus" },
  { value: "FACTORY_OUTLET", label: "Factory Outlet" },
  { value: "KIOSK", label: "Kiosk" },
  { value: "VERKAUFSFLAECHE", label: "Verkaufsfläche" },
  { value: "AUSSTELLUNGSFLAECHE", label: "Ausstellungsfläche" },
];

const HOSPITALITY_TYPES = [
  { value: "GASTRONOMIE", label: "Gastronomie" },
  { value: "GASTRONOMIE_UND_WOHNUNG", label: "Gastronomie und Wohnung" },
  { value: "PENSIONEN", label: "Pensionen" },
  { value: "HOTELS", label: "Hotels" },
  {
    value: "WEITERE_BEHERBERGUNGSBETRIEBE",
    label: "Weitere Beherbergungsbetriebe",
  },
  { value: "BAR", label: "Bar" },
  { value: "CAFE", label: "Café" },
  { value: "DISCOTHEK", label: "Diskothek" },
  { value: "RESTAURANT", label: "Restaurant" },
  { value: "RAUCHERLOKAL", label: "Raucherlokal" },
  { value: "EINRAUMLOKAL", label: "Einraumlokal" },
];

const HALL_TYPES = [
  { value: "HALLE", label: "Halle" },
  { value: "INDUSTRIEHALLE", label: "Industriehalle" },
  { value: "LAGER", label: "Lager" },
  { value: "LAGERFLAECHEN", label: "Lagerflächen" },
  { value: "LAGER_MIT_FREIFLAECHE", label: "Lager mit Freifläche" },
  { value: "HOCHREGALLAGER", label: "Hochregallager" },
  { value: "SPEDITIONSLAGER", label: "Speditionslager" },
  { value: "PRODUKTION", label: "Produktion" },
  { value: "WERKSTATT", label: "Werkstatt" },
  { value: "SERVICE", label: "Service" },
  { value: "FREIFLAECHEN", label: "Freiflächen" },
  { value: "KUEHLHAUS", label: "Kühlhaus" },
];

const AGRICULTURE_AND_FORESTRY_TYPES = [
  {
    value: "LANDWIRTSCHAFTLICHE_BETRIEBE",
    label: "Landwirtschaftliche Betriebe",
  },
  { value: "BAUERNHOF", label: "Bauernhof" },
  { value: "AUSSIEDLERHOF", label: "Aussiedlerhof" },
  { value: "GARTENBAU", label: "Gartenbau" },
  { value: "ACKERBAU", label: "Ackerbau" },
  { value: "WEINBAU", label: "Weinbau" },
  { value: "VIEHWIRTSCHAFT", label: "Viehwirtschaft" },
  { value: "JAGD_UND_FORSTWIRTSCHAFT", label: "Jagd- und Forstwirtschaft" },
  { value: "TEICH_UND_FISCHWIRTSCHAFT", label: "Teich- und Fischwirtschaft" },
  { value: "SCHEUNEN", label: "Scheunen" },
  { value: "REITERHOEFE", label: "Reiterhöfe" },
  {
    value: "SONSTIGE_LANDWIRTSCHAFTSIMMOBILIEN",
    label: "Sonstige Landwirtschaftsimmobilien",
  },
  { value: "ANWESEN", label: "Anwesen" },
  { value: "JAGDREVIER", label: "Jagdrevier" },
];

const PARKING_TYPES = [
  { value: "STELLPLATZ", label: "Stellplatz" },
  { value: "CARPORT", label: "Carport" },
  { value: "DOPPELGARAGE", label: "Doppelgarage" },
  { value: "DUPLEX", label: "Duplex" },
  { value: "TIEFGARAGE", label: "Tiefgarage" },
  { value: "BOOTSLIEGEPLATZ", label: "Bootsliegeplatz" },
  { value: "EINZELGARAGE", label: "Einzelgarage" },
  { value: "PARKHAUS", label: "Parkhaus" },
  { value: "TIEFGARAGENSTELLPLATZ", label: "Tiefgaragenstellplatz" },
  { value: "PARKPLATZ_STROM", label: "Parkplatz mit Ladestation" },
];

const OTHER_TYPES = [
  { value: "PARKHAUS", label: "Parkhaus" },
  { value: "TANKSTELLE", label: "Tankstelle" },
  { value: "KRANKENHAUS", label: "Krankenhaus" },
  { value: "SONSTIGE", label: "Sonstige" },
];

const LEISURE_PROPERTY_TYPES = [
  { value: "SPORTANLAGEN", label: "Sportanlagen" },
  {
    value: "VERGNUEGUNGSPARKS_UND_CENTER",
    label: "Vergnügungsparks und Center",
  },
  { value: "FREIZEITANLAGE", label: "Freizeitanlage" },
];

const TENEMENT_BUILDING_TYPES = [
  { value: "MEHRFAMILIENHAUS", label: "Mehrfamilienhaus" },
  { value: "WOHN_UND_GESCHAEFTSHAUS", label: "Wohn- und Geschäftshaus" },
  { value: "WOHNANLAGEN", label: "Wohnanlagen" },
  { value: "PFLEGEHEIM", label: "Pflegeheim" },
  { value: "SANATORIUM", label: "Sanatorium" },
  { value: "SENIORENHEIM", label: "Seniorenheim" },
  { value: "BETREUTES_WOHNEN", label: "Betreutes Wohnen" },
];

const subPropertyTypeOptions: {
  [key: string]: { value: string; label: string }[];
} = {
  ZIMMER: ROOM_TYPES,
  WOHNUNG: APARTMENT_TYPES,
  HAUS: HOUSE_TYPES,
  GRUNDSTUECK: LAND_TYPES,
  BUERO_PRAXEN: OFFICE_PRACTICE_TYPES,
  HANDEL: RETAIL_TYPES,
  GASTGEWERBE: HOSPITALITY_TYPES,
  HALLEN: HALL_TYPES,
  LAND_FORSTWIRTSCHAFT: AGRICULTURE_AND_FORESTRY_TYPES,
  PARKEN: PARKING_TYPES,
  SONSTIGE: OTHER_TYPES,
  FREIZEITIMMOBILIE_GEWERBLICH: LEISURE_PROPERTY_TYPES,
  ZINSHAUS_REDITENOBJEKT: TENEMENT_BUILDING_TYPES,
};

type MarketingType = "KAUF" | "MIETE_PACHT";
type TypeOfUse = "WOHNEN" | "GEWERBE";
type CountryType = "DEU" | "AUT";

interface KeyDataFormValues {
  marketing_type: MarketingType;
  type_of_use: TypeOfUse;
  property_type: string;
  sub_property_type?: string;
  country: CountryType;
  city: string;
  zip_code: string;
  street: string;
  house_number: string;
  release_object_address: boolean;
  geo_id?: string;
  object_category_id?: string;
  management_object_id?: string;
}

export const keyDataValidationSchema = yup.object().shape({
  marketing_type: yup
    .string()
    .oneOf(["KAUF", "MIETE_PACHT"])
    .required("Bitte wählen Sie eine Vermarktungsart aus."),
  type_of_use: yup
    .string()
    .oneOf(["WOHNEN", "GEWERBE"])
    .required("Bitte wählen Sie eine Nutzungsart aus."),
  property_type: yup.string().required("Bitte wählen Sie einen Typ aus."),
  sub_property_type: yup.string(),
  country: yup
    .string()
    .oneOf(["DEU", "AUT"], "Bitte wählen Sie ein gültiges Land aus.")
    .required("Bitte wählen Sie ein Land aus."),
  city: yup.string().required("Bitte geben Sie den Ort an."),
  zip_code: yup.string().required("Bitte geben Sie die Postleitzahl an."),
  street: yup.string().required("Bitte geben Sie die Straße an."),
  house_number: yup.string().required("Bitte geben Sie die Hausnummer an."),
  release_object_address: yup.boolean().required(),
});

interface KeyDataFormProps {
  updateFormData: (data: any) => void;
  realEstateId: string | string[];
}

interface FormHandle {
  submit: () => Promise<boolean>;
}

const subPropertyTypeFieldMap: { [key: string]: string } = {
  ZIMMER: "room_type",
  WOHNUNG: "apartment_type",
  HAUS: "house_type",
  GRUNDSTUECK: "land_type",
  BUERO_PRAXEN: "office_practice_type",
  HANDEL: "retail_type",
  GASTGEWERBE: "hospitality_typ",
  HALLEN: "hall_type",
  LAND_FORSTWIRTSCHAFT: "agriculture_and_forestry_type",
  PARKEN: "parking_type",
  SONSTIGE: "other_type",
  FREIZEITIMMOBILIE_GEWERBLICH: "leisure_properties_typ",
  ZINSHAUS_REDITENOBJEKT: "tenement_building_type",
};

const allSubPropertyFields = Object.values(subPropertyTypeFieldMap);

export const KeyDataForm = forwardRef<FormHandle, KeyDataFormProps>(
  ({ updateFormData, realEstateId }, ref) => {
    const [loading, setLoading] = useState(true);
    const {
      control,
      register,
      handleSubmit,
      watch,
      setValue,
      reset,
      formState: { errors },
    } = useForm<KeyDataFormValues>({
      resolver: yupResolver(keyDataValidationSchema),
      defaultValues: {
        marketing_type: "KAUF",
        type_of_use: "WOHNEN",
        property_type: "WOHNUNG",
        sub_property_type: undefined,
        country: "DEU",
        city: "",
        zip_code: "",
        street: "",
        house_number: "",
        release_object_address: false,
      },
    });

    const marketing_type = watch("marketing_type");
    const type_of_use = watch("type_of_use");
    const property_type = watch("property_type");
    const sub_property_type = watch("sub_property_type");

    const typeOptions = useMemo(() => {
      return getTypeOptions();
    }, [type_of_use, marketing_type]);

    const subTypeOptions = useMemo(() => {
      return subPropertyTypeOptions[property_type] || [];
    }, [property_type]);

    useEffect(() => {
      if (!typeOptions.some((option) => option.value === property_type)) {
        setValue("property_type", "");
      }
    }, [property_type, setValue, typeOptions]);

    useEffect(() => {
      if (
        !subTypeOptions.some((option) => option.value === sub_property_type)
      ) {
        setValue("sub_property_type", "");
      }
    }, [sub_property_type, setValue, subTypeOptions]);

    function getTypeOptions() {
      if (type_of_use === "WOHNEN") {
        if (marketing_type === "KAUF") {
          return [
            { value: "WOHNUNG", label: "Wohnung" },
            { value: "HAUS", label: "Haus" },
            { value: "GRUNDSTUECK", label: "Grundstück" },
            { value: "PARKEN", label: "Parkplatz" },
            { value: "ZINSHAUS_REDITENOBJEKT", label: "Zinshaus" },
          ];
        } else if (marketing_type === "MIETE_PACHT") {
          return [
            { value: "WOHNUNG", label: "Wohnung" },
            { value: "HAUS", label: "Haus" },
            { value: "GRUNDSTUECK", label: "Grundstück" },
            { value: "PARKEN", label: "Parkplatz" },
            { value: "ZIMMER", label: "Zimmer" },
          ];
        } else {
          return [
            { value: "WOHNUNG", label: "Wohnung" },
            { value: "HAUS", label: "Haus" },
            { value: "GRUNDSTUECK", label: "Grundstück" },
            { value: "PARKEN", label: "Parkplatz" },
            { value: "SONSTIGE", label: "Sonstige" },
          ];
        }
      } else if (type_of_use === "GEWERBE") {
        return [
          { value: "BUERO_PRAXEN", label: "Büro/Praxen" },
          { value: "HANDEL", label: "Handel" },
          { value: "HALLEN", label: "Industrie/Halle" },
          { value: "GASTGEWERBE", label: "Gastronomie/Hotelarie" },
          { value: "LAND_FORSTWIRTSCHAFT", label: "Land-/Forstwirtschaft" },
          { value: "GRUNDSTUECK", label: "Grundstück" },
          { value: "SONSTIGE", label: "Sonstige" },
        ];
      } else {
        return [];
      }
    }

    useEffect(() => {
      const fetchData = async () => {
        try {
          const response = await axiosInstance.get(
            `/real-estate/detail/${realEstateId}/?fields=geo,object_category,management_object`
          );
          const data = response.data;
          const formData: KeyDataFormValues = {
            marketing_type: data.object_category?.marketing_type || "KAUF",
            type_of_use: data.object_category?.type_of_use || "WOHNEN",
            property_type: data.object_category?.property_type || "WOHNUNG",
            sub_property_type:
              data.object_category?.[
                subPropertyTypeFieldMap[data.object_category?.property_type]
              ] || "",
            country: data.geo?.country || "",
            city: data.geo?.city || "",
            zip_code: data.geo?.zip_code || "",
            street: data.geo?.street || "",
            house_number: data.geo?.house_number || "",
            release_object_address:
              data.management_object?.release_object_address || false,
            geo_id: data.geo?.id || null,
            object_category_id: data.object_category?.id || null,
            management_object_id: data.management_object?.id || null,
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
            const subPropertyTypeField =
              subPropertyTypeFieldMap[formData.property_type];
              const object_category_data: any = {
                marketing_type: formData.marketing_type,
                property_type: formData.property_type,
                type_of_use: formData.type_of_use,
                ...(formData.object_category_id
                  ? { id: formData.object_category_id }
                  : {}),
              };

              allSubPropertyFields.forEach((field) => {
                object_category_data[field] = null;
              });
      
              if (subPropertyTypeField) {
                object_category_data[subPropertyTypeField] =
                  formData.sub_property_type || null;
              }
            const nestedData = {
              geo: {
                city: formData.city,
                country: formData.country,
                street: formData.street,
                house_number: formData.house_number,
                zip_code: formData.zip_code,
                ...(formData.geo_id ? { id: formData.geo_id } : {}),
              },
              object_category: object_category_data,
              management_object: {
                release_object_address: formData.release_object_address,
                ...(formData.management_object_id
                  ? { id: formData.management_object_id }
                  : {}),
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
        {/* Vermarktung */}
        <div className={style.formGroup}>
          <Label className={style.formLabel}>
            Vermarktung<span className="text-red-500">*</span>
          </Label>
          {errors.marketing_type && (
            <p className="text-red-500">{errors.marketing_type.message}</p>
          )}
          <div className={style.buttonGroup}>
            <Controller
              name="marketing_type"
              control={control}
              render={({ field }) => (
                <>
                  <button
                    type="button"
                    className={
                      field.value === "KAUF"
                        ? style.buttonActive
                        : style.buttonInactive
                    }
                    onClick={() => field.onChange("KAUF")}
                  >
                    Verkauf
                  </button>
                  <button
                    type="button"
                    className={
                      field.value === "MIETE_PACHT"
                        ? style.buttonActive
                        : style.buttonInactive
                    }
                    onClick={() => field.onChange("MIETE_PACHT")}
                  >
                    Vermietung
                  </button>
                </>
              )}
            />
          </div>
        </div>

        {/* Nutzung */}
        <div className={style.formGroup}>
          <Label className={style.formLabel}>
            Nutzung<span className="text-red-500">*</span>
          </Label>
          <div className={style.buttonGroup}>
            <Controller
              name="type_of_use"
              control={control}
              render={({ field }) => (
                <>
                  <button
                    type="button"
                    className={
                      field.value === "WOHNEN"
                        ? style.buttonActive
                        : style.buttonInactive
                    }
                    onClick={() => field.onChange("WOHNEN")}
                  >
                    Wohnen
                  </button>
                  <button
                    type="button"
                    className={
                      field.value === "GEWERBE"
                        ? style.buttonActive
                        : style.buttonInactive
                    }
                    onClick={() => field.onChange("GEWERBE")}
                  >
                    Gewerbe
                  </button>
                </>
              )}
            />
          </div>
          {errors.type_of_use && (
            <p className="text-red-500">{errors.type_of_use.message}</p>
          )}
        </div>

        {/* Typ */}
        {type_of_use && (
          <div className={style.formGroup}>
            <Label className={style.formLabel}>
              <div>
                Typ<span className="text-red-500">*</span>
              </div>
              {errors.property_type && (
                <p className={style.errorMessage}>
                  {errors.property_type.message}
                </p>
              )}
            </Label>
            <div className={style.buttonGroup}>
              <Controller
                name="property_type"
                control={control}
                render={({ field }) => (
                  <>
                    {typeOptions.map((option) => (
                      <button
                        key={option.value}
                        type="button"
                        className={
                          field.value === option.value
                            ? style.buttonActive
                            : style.buttonInactive
                        }
                        onClick={() => field.onChange(option.value)}
                      >
                        {option.label}
                      </button>
                    ))}
                  </>
                )}
              />
            </div>
          </div>
        )}

        {/* Unterkategorie */}
        {subTypeOptions.length > 0 && (
          <div className={style.formGroup}>
            <Label className={style.formLabel}>
              <div>Unterkategorie</div>
            </Label>
            <div className={style.buttonGroup}>
              <Controller
                name="sub_property_type"
                control={control}
                render={({ field }) => (
                  <>
                    {subTypeOptions.map((option) => (
                      <button
                        key={option.value}
                        type="button"
                        className={
                          field.value === option.value
                            ? style.buttonActive
                            : style.buttonInactive
                        }
                        onClick={() => field.onChange(option.value)}
                      >
                        {option.label}
                      </button>
                    ))}
                  </>
                )}
              />
            </div>
          </div>
        )}

        {/* Adresse */}
        {/* Land */}
        <div className={style.formGroup}>
          <Label className={style.formLabel}>
            <div>
              Land<span className="text-red-500">*</span>
            </div>
            {errors.country && (
              <p className={style.errorMessage}>{errors.country.message}</p>
            )}
          </Label>
          <div className={style.countryField}>
            <Controller
              name="country"
              control={control}
              render={({ field }) => (
                <Select
                  onValueChange={(value) => field.onChange(value)}
                  value={field.value}
                >
                  <SelectTrigger aria-label="Land">
                    <SelectValue placeholder="Bitte wählen" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="DEU">Deutschland</SelectItem>
                    {/* <SelectItem value="AUT">Österreich</SelectItem> */}
                  </SelectContent>
                </Select>
              )}
            />
          </div>
        </div>

        {/* Ort und PLZ */}
        <div className={style.formGroupRow}>
          <div className={style.formGroup}>
            <Label className={style.formLabel}>
              <div>
                Ort<span className="text-red-500">*</span>
              </div>
              {errors.city && (
                <p className={style.errorMessage}>{errors.city.message}</p>
              )}
            </Label>
            <Input
              id="city"
              type="text"
              placeholder="Berlin"
              {...register("city")}
            />
          </div>
          <div className={style.formGroup}>
            <Label className={style.formLabel}>
              <div>
                PLZ<span className="text-red-500">*</span>
              </div>
              {errors.zip_code && (
                <p className={style.errorMessage}>{errors.zip_code.message}</p>
              )}
            </Label>
            <Input
              id="zip_code"
              type="text"
              placeholder="10115"
              {...register("zip_code")}
            />
          </div>
        </div>

        {/* Straße und Hausnummer */}
        <div className={style.formGroupRow}>
          <div className={style.formGroup}>
            <Label className={style.formLabel}>
              <div>
                Straße<span className="text-red-500">*</span>
              </div>
              {errors.street && (
                <p className={style.errorMessage}>{errors.street.message}</p>
              )}
            </Label>
            <Input
              id="street"
              type="text"
              placeholder="Musterstraße"
              {...register("street")}
            />
          </div>
          <div className={style.formGroup}>
            <Label className={style.formLabel}>
              <div>
                Nr<span className="text-red-500">*</span>
              </div>
              {errors.house_number && (
                <p className={style.errorMessage}>
                  {errors.house_number.message}
                </p>
              )}
            </Label>
            <Input
              id="house_number"
              type="text"
              placeholder="12"
              {...register("house_number")}
            />
          </div>
        </div>

        {/* Adresse im Inserat anzeigen */}
        <div className={style.formGroup}>
          <div className={style.Switch}>
            <Label className={style.formLabel}>
              Adresse im Inserat anzeigen?
            </Label>
            <Controller
              name="release_object_address"
              control={control}
              render={({ field: { value, onChange } }) => (
                <Switch
                  id="release_object_address"
                  checked={value}
                  onCheckedChange={onChange} 
                />
              )}
            />
          </div>
        </div>
      </div>
    );
  }
);
