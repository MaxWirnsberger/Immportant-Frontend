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
  import ParkingAreaComponent from "../AreaComponents/ParkingAreaComponent";
  
  // Definition der Formularwerte
  interface AreaDataFormValues {
    plot_area: number;
    number_of_parking_spaces?: number | null;
    parking_space_type?: string | null;
    area_id?: string;
    specifications_id?: string;
  }
  
  // Validierungsschema mit Yup
  const validationSchema = yup.object().shape({
    plot_area: yup
      .number()
      .transform((value, originalValue) =>
        String(originalValue).trim() === "" ? null : value
      )
      .typeError("Bitte geben Sie eine gültige Zahl ein")
      .min(1, "Wohnfläche muss größer als 0 sein")
      .required("Wohnfläche ist erforderlich"),
    number_of_parking_spaces: yup
      .number()
      .transform((value, originalValue) =>
        String(originalValue).trim() === "" ? null : value
      )
      .nullable()
      .notRequired(),
    parking_space_type: yup.string().nullable().notRequired(),
  });
  
  interface AreaDataFormProps {
    updateFormData: (data: AreaDataFormValues) => void;
    realEstateId: string | string[];
  }
  
  interface FormHandle {
    submit: () => Promise<boolean>;
  }
  
  export const ParkingArea = forwardRef<FormHandle, AreaDataFormProps>(
    ({ updateFormData, realEstateId }, ref) => {
      const [loading, setLoading] = useState(true);
  
      // Verwendung von useForm mit FormProvider
      const methods = useForm<AreaDataFormValues>({
        resolver: yupResolver(validationSchema),
        defaultValues: {
          plot_area: 0,
          number_of_parking_spaces: null,
          parking_space_type: null,
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
              plot_area: data.area?.plot_area,
              number_of_parking_spaces:
                data.area?.number_of_parking_spaces || null,
              parking_space_type:
                data.specifications?.parking_space_type[0] || "",
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
                  plot_area: formData.plot_area,
                  number_of_parking_spaces: formData.number_of_parking_spaces,
                },
                specifications: {
                  ...(formData.specifications_id
                    ? { id: formData.specifications_id }
                    : {}),
                  parking_space_type: formData.parking_space_type
                    ? [formData.parking_space_type]
                    : [],
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
                      Fläche (m²)<span className="text-red-500">*</span>
                      {errors.plot_area && (
                        <p className={styles.errorMessage}>
                          {errors.plot_area.message}
                        </p>
                      )}
                    </div>
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
  
  
            <ParkingAreaComponent />
          </div>
        </FormProvider>
      );
    }
  );
  