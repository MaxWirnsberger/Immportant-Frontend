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
import { CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { de } from "date-fns/locale";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import style from "../../formContent.module.css";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type PackageName = "Small" | "Medium" | "Large";

interface PublishFormValues {
  management_object_id?: string | null;
  contact_person_id?: string | null;
  from_date?: Date | null;
  max_rental_duration_value?: number | null;
  max_rental_duration_unit?: string | null;
  rented?: boolean | null;
  firstname: string;
  lastname: string;
  email_main: string;
  phone?: string | null;
  marketing_type?: string | null;
}

const descriptionValidationSchema = yup.object().shape({
  from_date: yup.date().nullable(),
  max_rental_duration_value: yup.number().nullable().notRequired(),
  max_rental_duration_unit: yup.string().nullable().notRequired(),
  rented: yup.boolean().nullable().notRequired(),
  firstname: yup.string().required("Vorname ist erforderlich"),
  lastname: yup.string().required("Nachname ist erforderlich"),
  email_main: yup
    .string()
    .email("Ungültige E-Mail-Adresse")
    .required("E-Mail ist erforderlich"),
  phone: yup
    .string()
    .nullable()
    .notRequired()
    .matches(/^\+\d{1,3}\s\d{2,5}\s\d{5,10}$/, {
      message:
        "Rufnummer: +Land Vorwahl Nummer Beispiel: +49 660 6162416 | Leerzeichen nicht vergessen",
      excludeEmptyString: true,
    })
});

interface PublishFormProps {
  updateFormData: (data: any) => void;
  realEstateId: string | string[];
}

interface FormHandle {
  submit: () => Promise<boolean>;
}

const packagePortalMapping: { [key in PackageName]: string[] } = {
  Small: ["Immowelt"],
  Medium: ["Immo-Scout"],
  Large: ["Immowelt", "Immo-Scout", "Kleinanzeigen"],
};

export const PublishDataForm = forwardRef<FormHandle, PublishFormProps>(
  ({ updateFormData, realEstateId }, ref) => {
    const [loading, setLoading] = useState(true);
    const [isRental, setIsRental] = useState(true);
    const [showPhoneField, setShowPhoneField] = useState(true);

    const {
      control,
      handleSubmit,
      reset,
      formState: { errors },
    } = useForm<PublishFormValues>({
      resolver: yupResolver(descriptionValidationSchema),
      defaultValues: {
        from_date: null,
        max_rental_duration_value: null,
        max_rental_duration_unit: null,
        rented: null,
        firstname: "",
        lastname: "",
        email_main: "",
        phone: null,
        marketing_type: null,
      },
    });

    useEffect(() => {
      const fetchData = async () => {
        try {
          const response = await axiosInstance.get(
            `/real-estate/detail/${realEstateId}/?fields=management_object,contact_person,object_category,portals`
          );
          const data = response.data;

          const formData: PublishFormValues = {
            management_object_id: data.management_object?.id || null,
            from_date: data.management_object?.from_date
              ? new Date(data.management_object.from_date)
              : null,
            max_rental_duration_value:
              data.management_object?.max_rental_duration_value || null,
            max_rental_duration_unit:
              data.management_object?.max_rental_duration_unit || null,
            rented: data.management_object?.rented || null,

            contact_person_id: data.contact_person?.id || null,
            firstname: data.contact_person?.firstname || "",
            lastname: data.contact_person?.lastname || "",
            email_main: data.contact_person?.email_main || "",
            phone: [
              data.contact_person?.tel_main_country,
              data.contact_person?.tel_main_area_code,
              data.contact_person?.tel_main_subscriber,
            ]
              .filter(Boolean)
              .join(" "),
            marketing_type: data.object_category?.marketing_type || null,
          };
          setIsRental(formData.marketing_type === "MIETE_PACHT");
          reset(formData);
          setShowPhoneField(!!formData.phone);
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
            let tel_main_country = null;
            let tel_main_area_code = null;
            let tel_main_subscriber = null;

            if (formData.phone) {
              const phoneParts = formData.phone.trim().split(" ");
              [tel_main_country, tel_main_area_code, tel_main_subscriber] =
                phoneParts;
            }

            const nestedData = {
              management_object: {
                from_date: formData.from_date,
                max_rental_duration_value: formData.max_rental_duration_value,
                max_rental_duration_unit: formData.max_rental_duration_unit,
                rented: formData.rented,
                ...(formData.management_object_id
                  ? { id: formData.management_object_id }
                  : {}),
              },
              contact_person: {
                firstname: formData.firstname,
                lastname: formData.lastname,
                email_main: formData.email_main,
                tel_main_country: tel_main_country || null,
                tel_main_area_code: tel_main_area_code || null,
                tel_main_subscriber: tel_main_subscriber || null,
                ...(formData.contact_person_id
                  ? { id: formData.contact_person_id }
                  : {}),
              }
            };
            console.log(nestedData);
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
      <form className={style.form}>
        {/* Availability Date */}
        <div className={style.formGroupRow}>
          <div className={style.formGroup}>
            <Label className={style.formLabel}>Verfügbar ab</Label>
            <Controller
              name="from_date"
              control={control}
              render={({ field }) => (
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {field.value ? (
                        format(field.value, "PPP", { locale: de })
                      ) : (
                        <span>Datum auswählen</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={field.value || undefined}
                      onSelect={field.onChange}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              )}
            />
          </div>
        </div>

        {/* Vermietet */}
        {isRental && (
          <div className={style.formGroup}>
            <div className={style.Switch}>
              <Label className={style.formLabel}>Vermietet?</Label>
              <Controller
                name="rented"
                control={control}
                render={({ field: { value, onChange } }) => (
                  <Switch
                    id="rented"
                    checked={value || false}
                    onCheckedChange={onChange}
                  />
                )}
              />
            </div>
          </div>
        )}

        {/* Rental Duration */}
        {isRental && (
          <div className={style.formGroupRow}>
            <div className={style.formGroup}>
              <Label className={style.formLabel}>Befristung</Label>
              <Controller
                name="max_rental_duration_value"
                control={control}
                render={({ field }) => (
                  <Input
                    type="number"
                    id="max_rental_duration_value"
                    {...field}
                    value={field.value || ""}
                  />
                )}
              />
            </div>
            <div className={style.formGroup}>
              <Label className={style.formLabel}>Zeiteinheit</Label>
              <Controller
                name="max_rental_duration_unit"
                control={control}
                render={({ field }) => (
                  <Select
                    onValueChange={field.onChange}
                    value={field.value || undefined}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Zeiteinheit" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="TAG">Tag(e)</SelectItem>
                      <SelectItem value="WOCHE">Woche(n)</SelectItem>
                      <SelectItem value="MONAT">Monat(e)</SelectItem>
                      <SelectItem value="JAHR">Jahr(e)</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
          </div>
        )}

        {/* First Name */}
        <div className={style.formGroupRow}>
          <div className={style.formGroup}>
            <Label className={style.formLabel}>
              Vorname
              {errors.firstname && (
                <p className="text-red-500">{errors.firstname.message}</p>
              )}
            </Label>
            <Controller
              name="firstname"
              control={control}
              render={({ field }) => <Input id="firstname" {...field} />}
            />
          </div>

          {/* Last Name */}
          <div className={style.formGroup}>
            <Label className={style.formLabel}>
              Nachname
              {errors.lastname && (
                <p className="text-red-500">{errors.lastname.message}</p>
              )}
            </Label>
            <Controller
              name="lastname"
              control={control}
              render={({ field }) => <Input id="lastname" {...field} />}
            />
          </div>
        </div>

        <div className={style.formGroupRow}>
          {/* Phone Field */}
          {showPhoneField && (
            <div className={style.formGroup}>
              <Label className={style.formLabel}>
                Telefon
                {errors.phone && (
                  <p className="text-red-500">{errors.phone.message}</p>
                )}
              </Label>
              <Controller
                name="phone"
                control={control}
                render={({ field }) => (
                  <Input
                    id="phone"
                    placeholder="+49 123 456789"
                    {...field}
                    value={field.value || ""}
                  />
                )}
              />
            </div>
          )}

          {/* Switch for Phone Display */}
          <div className={style.formGroup}>
            <Label className={style.formLabel}>
              Rufnummer im Inserat anzeigen?
            </Label>
            <Controller
              name="phone"
              control={control}
              render={({ field: { value, onChange } }) => (
                <Switch
                  checked={showPhoneField}
                  onCheckedChange={(checked) => {
                    setShowPhoneField(checked);
                    if (!checked) {
                      onChange("");
                    }
                  }}
                />
              )}
            />
          </div>
        </div>

        {/* Email */}
        <div className={style.formGroupRow}>
          <div className={style.formGroup}>
            <Label className={style.formLabel}>
              E-Mail
              {errors.email_main && (
                <p className="text-red-500">{errors.email_main.message}</p>
              )}
            </Label>
            <Controller
              name="email_main"
              control={control}
              render={({ field }) => (
                <Input id="email_main" type="email" {...field} />
              )}
            />
          </div>
        </div>

        {/* Package Selection
        <div className={style.formGroup}>
          <Label className={style.formLabel}>
            Paket auswählen
            {errors.package && (
              <p className="text-red-500">{errors.package.message}</p>
            )}
          </Label>
          <Controller
            name="package"
            control={control}
            render={({ field }) => (
              <PackageSelection
                type={isRental ? "rental" : "sale"}
                field={field}
              />
            )}
          />
        </div> */}
      </form>
    );
  }
);
