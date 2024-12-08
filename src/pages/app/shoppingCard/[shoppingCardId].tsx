"use client";

import React, { useEffect, useState } from "react";
import * as yup from "yup";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import axiosInstance from "@/lib/axiosInstance";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/router";
import globalStyle from "../globalApp.module.css";
import style from "./shoppingCard.module.css";
import PackageSelection from "./PackageComponent/packageComponent";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";

type PackageName = "Small" | "Medium" | "Large";

interface PlattformValues {
  package: PackageName | null;
  marketing_type?: string | null;
  duration: number;
}

const plattformValidationSchema = yup.object().shape({
  package: yup
    .string()
    .oneOf(["Small", "Medium", "Large"])
    .required("Bitte wählen Sie ein Paket aus.")
    .nullable(),
  duration: yup
    .number()
    .oneOf([1, 2, 3])
    .required("Bitte wählen Sie eine Laufzeit aus."),
});

const packagePortalMapping: { [key in PackageName]: string[] } = {
  Small: ["Immowelt"],
  Medium: ["Immo-Scout"],
  Large: ["Immowelt", "Immo-Scout", "Kleinanzeigen"],
};

const ShoppingCardPage: React.FC = () => {
  const router = useRouter();
  const { shoppingCardId } = router.query;
  const realEstateId = shoppingCardId as string;

  const [loading, setLoading] = useState(true);
  const [isRental, setIsRental] = useState(true);

  const {
    control,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<PlattformValues>({
    resolver: yupResolver(plattformValidationSchema),
    defaultValues: {
      package: null,
      marketing_type: null,
      duration: 1,
    },
  });

  const duration = watch('duration') || 1;

  useEffect(() => {
    if (!router.isReady) return;

    if (!realEstateId) {
      console.error("realEstateId ist nicht verfügbar");
      return;
    }

    const fetchData = async () => {
      try {
        const response = await axiosInstance.get(
          `/real-estate/detail/${realEstateId}/?fields=object_category,portals`
        );
        const data = response.data;

        const portals = data.portals?.map((p: any) => p.portal) || [];
        let selectedPackage: PackageName | null = null;

        if (portals.length === 3) {
          selectedPackage = "Large";
        } else if (portals.includes("Immo-Scout")) {
          selectedPackage = "Medium";
        } else if (portals.includes("Immowelt")) {
          selectedPackage = "Small";
        }

        const formData: PlattformValues = {
          package: selectedPackage,
          marketing_type: data.object_category?.marketing_type || null,
          duration: 1,
        };
        setIsRental(formData.marketing_type === "MIETE_PACHT");
        reset(formData);
        setLoading(false);
      } catch (error) {
        console.error("Fehler beim Laden der Daten:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, [router.isReady, realEstateId, reset]);

  const onSubmit = async (formData: PlattformValues) => {
    try {
      if (!formData.package) {
        console.error("Kein Paket ausgewählt");
        return;
      }

      const selectedPackage = formData.package;
      const portals = packagePortalMapping[selectedPackage].map(
        (portalName) => ({
          portal: portalName,
          real_estate: realEstateId,
          months: duration,
        })
      );

      const nestedData = {
        portals: portals,
      };
      console.log(nestedData);
      await axiosInstance.put(
        `/real-estate/update/${realEstateId}/`,
        nestedData
      );
    } catch (error) {
      console.error("Fehler beim Senden der Daten:", error);
    }
  };

  if (loading) {
    return (
      <div className={globalStyle.appMainContainer}>
        <h2>Package Wahl</h2>
        <div className={style.loading}>Laden...</div>
      </div>
    );
  }

  return (
    <div className={globalStyle.appMainContainer}>
      <h2>Package Wahl</h2>
      <form className={style.form} onSubmit={handleSubmit(onSubmit)}>
        {/* Laufzeit-Auswahl */}
        <div className={style.formGroup}>
          <Controller
            name="duration"
            control={control}
            render={({ field: { onChange, value } }) => (
              <div className={style.SliderComponent}>
                <Slider
                  min={1}
                  max={3}
                  step={1}
                  value={[value]}
                  onValueChange={(vals: any) => onChange(vals[0])}
                  className={style.SliderContent}
                />
                <div className={style.SliderLabel}>
                  <span>1 Monat</span>
                  <span>2 Monate</span>
                  <span>3 Monate</span>
                </div>
                <div className="font-semibold">
                  Ausgewählte Laufzeit: {value}{" "}
                  {value === 1 ? "Monat" : "Monate"}
                </div>
              </div>
            )}
          />
        </div>

        {/* Paket-Auswahl */}
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
                duration={duration} // Laufzeit übergeben
              />
            )}
          />
        </div>
        <div className={style.shoppingButton}>
          <Button type="submit">Zahlen</Button>
        </div>
      </form>
    </div>
  );
};

export default ShoppingCardPage;
