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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { NumericFormat, NumberFormatValues } from "react-number-format";
import style from "../../../formContent.module.css";

interface RentFormValues {
  price_id?: string | null;
  price_on_request: boolean;
  cold_rent: number;
  additional_costs?: number | null;
  heating_costs_included: boolean;
  heating_costs?: number | null;
  total_rent_gross?: number | null;
  rent_price_per_sqm?: number | null;
  deposit?: number | null;
}

export const rentValidationSchema = yup.object().shape({
  price_on_request: yup.boolean().required(),
  cold_rent: yup.number().required("Die Kaltmiete ist ein Pflichtfeld."),
  additional_costs: yup.number().nullable().notRequired(),
  heating_costs_included: yup.boolean().required(),
  heating_costs: yup.number().nullable().notRequired(),
  total_rent_gross: yup.number().nullable().notRequired(),
  rent_price_per_sqm: yup.number().nullable().notRequired(),
  deposit: yup.number().nullable().notRequired(),
});

interface RentFormProps {
  updateFormData: (data: any) => void;
  realEstateId: string | string[];
}

interface FormHandle {
  submit: () => Promise<boolean>;
}

export const RentDataForm = forwardRef<FormHandle, RentFormProps>(
  ({ updateFormData, realEstateId }, ref) => {
    const [loading, setLoading] = useState(true);

    const {
      control,
      handleSubmit,
      reset,
      watch,
      formState: { errors },
    } = useForm<RentFormValues>({
      resolver: yupResolver(rentValidationSchema),
      defaultValues: {
        price_on_request: false,
        cold_rent: 0,
        additional_costs: null,
        heating_costs_included: true,
        heating_costs: null,
        total_rent_gross: null,
        rent_price_per_sqm: null,
        deposit: null,
      },
    });

    const heatingCostsIncluded = watch("heating_costs_included");

    useEffect(() => {
      const fetchData = async () => {
        try {
          const response = await axiosInstance.get(
            `/real-estate/detail/${realEstateId}/?fields=price`
          );
          const data = response.data;
          const formData: RentFormValues = {
            price_id: data.price?.id || null,
            price_on_request: data.price?.price_on_request || false,
            cold_rent: data.price?.cold_rent ?? 0,
            additional_costs: data.price?.additional_costs ?? null,
            heating_costs_included: data.price?.heating_costs_included ?? true,
            heating_costs: data.price?.heating_costs ?? null,
            total_rent_gross: data.price?.total_rent_gross ?? null,
            rent_price_per_sqm: data.price?.rent_price_per_sqm ?? null,
            deposit: data.price?.deposit ?? null,
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
            // Validierung durchführen
            await rentValidationSchema.validate(formData, {
              abortEarly: false,
            });

            // Daten an das Backend senden
            const nestedData = {
              price: {
                ...(formData.price_id ? { id: formData.price_id } : {}),
                price_on_request: formData.price_on_request,
                cold_rent: formData.cold_rent ?? null,
                additional_costs: formData.additional_costs ?? null,
                heating_costs_included: formData.heating_costs_included,
                heating_costs: formData.heating_costs ?? null,
                total_rent_gross: formData.total_rent_gross ?? null,
                rent_price_per_sqm: formData.rent_price_per_sqm ?? null,
                deposit: formData.deposit ?? null,
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
        {/* Kaltmiete */}
        <div className={style.formGroupRow}>
          <div className={style.formGroup}>
            <Label className={style.formLabel}>
              Kaltmiete<span className="text-red-500">* </span>
              {errors.cold_rent && (
                <span className={style.errorMessage}>
                  {errors.cold_rent.message}
                </span>
              )}
            </Label>
            <Controller
              name="cold_rent"
              control={control}
              render={({ field }) => (
                <NumericFormat
                  value={field.value ?? ""}
                  onValueChange={(values: NumberFormatValues) => {
                    const { floatValue } = values;
                    field.onChange(floatValue ?? null);
                  }}
                  thousandSeparator="."
                  decimalSeparator=","
                  decimalScale={2}
                  fixedDecimalScale={true}
                  allowNegative={false}
                  suffix=" €"
                  placeholder="Kaltmiete"
                  customInput={Input}
                />
              )}
            />
          </div>
        </div>

        {/* Preis auf Anfrage */}
        <div className={style.formGroup}>
          <div className={style.Switch}>
            <Label className={style.formLabel}>Preis auf Anfrage?</Label>
            <Controller
              name="price_on_request"
              control={control}
              render={({ field: { value, onChange } }) => (
                <Switch
                  id="price_on_request"
                  checked={value}
                  onCheckedChange={onChange}
                />
              )}
            />
          </div>
        </div>

        {/* Nebenkosten */}
        <div className={style.formGroupRow}>
          <div className={style.formGroup}>
            <Label className={style.formLabel}>
              Nebenkosten
              {errors.additional_costs && (
                <span className={style.errorMessage}>
                  {errors.additional_costs.message}
                </span>
              )}
            </Label>
            <Controller
              name="additional_costs"
              control={control}
              render={({ field }) => (
                <NumericFormat
                  value={field.value ?? ""}
                  onValueChange={(values: NumberFormatValues) => {
                    const { floatValue } = values;
                    field.onChange(floatValue ?? null);
                  }}
                  thousandSeparator="."
                  decimalSeparator=","
                  decimalScale={2}
                  fixedDecimalScale={true}
                  allowNegative={false}
                  suffix=" €"
                  placeholder="Nebenkosten"
                  customInput={Input}
                />
              )}
            />
          </div>

          {/* Heizkosten */}
          {!heatingCostsIncluded && (
            <div className={style.formGroup}>
              <Label className={style.formLabel}>
                Heizkosten
                {errors.heating_costs && (
                  <span className={style.errorMessage}>
                    {errors.heating_costs.message}
                  </span>
                )}
              </Label>
              <Controller
                name="heating_costs"
                control={control}
                render={({ field }) => (
                  <NumericFormat
                    value={field.value ?? ""}
                    onValueChange={(values: NumberFormatValues) => {
                      const { floatValue } = values;
                      field.onChange(floatValue ?? null);
                    }}
                    thousandSeparator="."
                    decimalSeparator=","
                    decimalScale={2}
                    fixedDecimalScale={true}
                    allowNegative={false}
                    suffix=" €"
                    placeholder="Heizkosten"
                    customInput={Input}
                  />
                )}
              />
            </div>
          )}
        </div>

        {/* Heizkosten enthalten */}
        <div className={style.formGroup}>
          <div className={style.Switch}>
            <Label className={style.formLabel}>Heizkosten enthalten?</Label>
            <Controller
              name="heating_costs_included"
              control={control}
              render={({ field: { value, onChange } }) => (
                <Switch
                  id="heating_costs_included"
                  checked={value}
                  onCheckedChange={onChange}
                />
              )}
            />
          </div>
        </div>

        <div className={style.formGroupRow}>
          {/* Gesamtmiete brutto */}
          <div className={style.formGroup}>
            <Label className={style.formLabel}>
              Gesamtmiete brutto
              {errors.total_rent_gross && (
                <span className={style.errorMessage}>
                  {errors.total_rent_gross.message}
                </span>
              )}
            </Label>
            <Controller
              name="total_rent_gross"
              control={control}
              render={({ field }) => (
                <NumericFormat
                  value={field.value ?? ""}
                  onValueChange={(values: NumberFormatValues) => {
                    const { floatValue } = values;
                    field.onChange(floatValue ?? null);
                  }}
                  thousandSeparator="."
                  decimalSeparator=","
                  decimalScale={2}
                  fixedDecimalScale={true}
                  allowNegative={false}
                  suffix=" €"
                  placeholder="Gesamtmiete brutto"
                  customInput={Input}
                />
              )}
            />
          </div>

          {/* Mietpreis pro m² */}
          <div className={style.formGroup}>
            <Label className={style.formLabel}>
              Mietpreis pro m²
              {errors.rent_price_per_sqm && (
                <span className={style.errorMessage}>
                  {errors.rent_price_per_sqm.message}
                </span>
              )}
            </Label>
            <Controller
              name="rent_price_per_sqm"
              control={control}
              render={({ field }) => (
                <NumericFormat
                  value={field.value ?? ""}
                  onValueChange={(values: NumberFormatValues) => {
                    const { floatValue } = values;
                    field.onChange(floatValue ?? null);
                  }}
                  thousandSeparator="."
                  decimalSeparator=","
                  decimalScale={2}
                  fixedDecimalScale={true}
                  allowNegative={false}
                  suffix=" €/m²"
                  placeholder="Mietpreis pro m²"
                  customInput={Input}
                />
              )}
            />
          </div>
        </div>

        {/* Kaution */}
        <div className={style.halfRow}>
          <div className={style.formGroup}>
            <Label className={style.formLabel}>
              Kaution
              {errors.deposit && (
                <span className={style.errorMessage}>
                  {errors.deposit.message}
                </span>
              )}
            </Label>
            <Controller
              name="deposit"
              control={control}
              render={({ field }) => (
                <NumericFormat
                  value={field.value ?? ""}
                  onValueChange={(values: NumberFormatValues) => {
                    const { floatValue } = values;
                    field.onChange(floatValue ?? null);
                  }}
                  thousandSeparator="."
                  decimalSeparator=","
                  decimalScale={2}
                  fixedDecimalScale={true}
                  allowNegative={false}
                  suffix=" €"
                  placeholder="Kaution"
                  customInput={Input}
                />
              )}
            />
          </div>
        </div>
      </div>
    );
  }
);
