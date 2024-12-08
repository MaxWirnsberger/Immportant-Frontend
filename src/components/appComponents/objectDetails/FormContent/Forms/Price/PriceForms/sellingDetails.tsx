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

interface SellFormValues {
  price_id?: string | null;
  price_on_request: boolean;
  net_purchase_price?: number | null;
  gross_purchase_price: number;
  additional_costs?: number | null;
  service_charge?: number | null;
  purchase_price_per_sqm?: number | null;
}

export const sellValidationSchema = yup.object().shape({
  price_on_request: yup.boolean().required(),
  gross_purchase_price: yup
    .number()
    .required("Der Verkaufspreis ist ein Pflichtfeld."),
  net_purchase_price: yup.number().nullable().notRequired(),
  additional_costs: yup.number().nullable().notRequired(),
  service_charge: yup.number().nullable().notRequired(),
  purchase_price_per_sqm: yup.number().nullable().notRequired(),
});

interface SellFormProps {
  updateFormData: (data: any) => void;
  realEstateId: string | string[];
  propertyType: string | null;
}

interface FormHandle {
  submit: () => Promise<boolean>;
}

export const SellDataForm = forwardRef<FormHandle, SellFormProps>(
  ({ updateFormData, realEstateId, propertyType }, ref) => {
    const [loading, setLoading] = useState(true);

    const isHausOrWohnung =
      propertyType === "HAUS" || propertyType === "WOHNUNG";

    const {
      control,
      handleSubmit,
      reset,
      formState: { errors },
    } = useForm<SellFormValues>({
      resolver: yupResolver(sellValidationSchema),
      defaultValues: {
        price_on_request: false,
        net_purchase_price: null,
        gross_purchase_price: 0,
        additional_costs: null,
        service_charge: null,
        purchase_price_per_sqm: null,
      },
    });

    useEffect(() => {
      const fetchData = async () => {
        try {
          const response = await axiosInstance.get(
            `/real-estate/detail/${realEstateId}/?fields=price`
          );
          const data = response.data;
          const formData: SellFormValues = {
            price_id: data.price?.id || null,
            price_on_request: data.price?.price_on_request || false,
            net_purchase_price: data.price?.net_purchase_price || null,
            gross_purchase_price: data.price?.gross_purchase_price || null,
            additional_costs: data.price?.additional_costs || null,
            service_charge: data.price?.service_charge || null,
            purchase_price_per_sqm: data.price?.purchase_price_per_sqm || null,
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
            await sellValidationSchema.validate(formData, {
              abortEarly: false,
            });

            // Daten an das Backend senden
            const nestedData = {
              price: {
                ...(formData.price_id ? { id: formData.price_id } : {}),
                price_on_request: formData.price_on_request,
                net_purchase_price: formData.net_purchase_price ?? null,
                gross_purchase_price: formData.gross_purchase_price ?? null,
                additional_costs: formData.additional_costs ?? null,
                service_charge: formData.service_charge ?? null,
                purchase_price_per_sqm: formData.purchase_price_per_sqm ?? null,
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
        <div className={style.formGroupRow}>
          {/* Kaufpreis (Brutto) */}
          <div className={style.formGroup}>
            <Label className={style.formLabel}>
              <div>
                Kaufpreis (Brutto)<span className="text-red-500">* </span>
                {errors.gross_purchase_price && (
                  <span className={style.errorMessage}>
                    {errors.gross_purchase_price.message}
                  </span>
                )}
              </div>
            </Label>
            <Controller
              name="gross_purchase_price"
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
                  placeholder="Kaufpreis"
                  customInput={Input}
                />
              )}
            />
          </div>

          {/* Nettokaufpreis */}
          <div className={style.formGroup}>
            <Label className={style.formLabel}>
              Nettokaufpreis
              {errors.net_purchase_price && (
                <span className={style.errorMessage}>
                  {errors.net_purchase_price.message}
                </span>
              )}
            </Label>
            <Controller
              name="net_purchase_price"
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
                  placeholder="Nettokaufpreis"
                  customInput={Input}
                />
              )}
            />
          </div>
        </div>

        {/* Preis im Inserat anzeigen */}
        <div className={style.formGroup}>
          <div className={style.Switch}>
            <Label className={style.formLabel}>
              Preis im Inserat anzeigen?
            </Label>
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

        <div className={style.formGroupRow}>
          {/* Bedingtes Rendering des Kostenfeldes */}
          <div className={style.formGroup}>
            <Label className={style.formLabel}>
              {isHausOrWohnung ? "Hausgeld" : "Nebenkosten"}
              {isHausOrWohnung && errors.service_charge && (
                <span className={style.errorMessage}>
                  {errors.service_charge.message}
                </span>
              )}
              {!isHausOrWohnung && errors.additional_costs && (
                <span className={style.errorMessage}>
                  {errors.additional_costs.message}
                </span>
              )}
            </Label>
            {isHausOrWohnung ? (
              <Controller
                name="service_charge"
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
                    placeholder="Hausgeld"
                    customInput={Input}
                  />
                )}
              />
            ) : (
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
            )}
          </div>
        </div>

        {/* Kaufpreis pro m² */}
        <div className={`${style.formGroup} ${style.halfRow}`}>
          <Label className={style.formLabel}>
            Kaufpreis pro m²
            {errors.purchase_price_per_sqm && (
              <span className={style.errorMessage}>
                {errors.purchase_price_per_sqm.message}
              </span>
            )}
          </Label>
          <Controller
            name="purchase_price_per_sqm"
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
                placeholder="Kaufpreis pro m²"
                customInput={Input}
              />
            )}
          />
        </div>
      </div>
    );
  }
);
