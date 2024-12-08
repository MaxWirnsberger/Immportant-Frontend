import React, { forwardRef, useEffect, useState } from "react";
import axiosInstance from "@/lib/axiosInstance";

// Living
import { ApartmentArea } from "./AreaForms/apartments";
import { HouseArea } from "./AreaForms/house";
import { PlotArea } from "./AreaForms/plot";
import { ParkingArea } from "./AreaForms/parking";
import { RoomArea } from "./AreaForms/room";
import { TenementArea } from "./AreaForms/tenement";

// Commercial
import { OfficeArea } from "./AreaForms/office";
import { ShopArea } from "./AreaForms/shop";
import { IndustrialArea } from "./AreaForms/industry";
import { GastronomieArea } from "./AreaForms/gastronomy";
import { ForestryArea } from "./AreaForms/forestry";

// Weitere Area-Komponenten je nach Immobilientyp

interface AreaDataFormProps {
  updateFormData: (data: any) => void;
  realEstateId: string | string[];
}

interface FormHandle {
  submit: () => Promise<boolean>;
}

export const AreaDataForm = forwardRef<FormHandle, AreaDataFormProps>(
  ({ updateFormData, realEstateId }, ref) => {
    const [typeOfUse, setTypeOfUse] = useState<string | null>(null);
    const [propertyType, setPropertyType] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
      const fetchData = async () => {
        try {
          const response = await axiosInstance.get(
            `/real-estate/detail/${realEstateId}/?fields=object_category`
          );
          const data = response.data;

          setTypeOfUse(data.object_category?.type_of_use || null);
          setPropertyType(data.object_category?.property_type || null);

          setLoading(false);
        } catch (error) {
          console.error("Error fetching real estate data:", error);
          setLoading(false);
        }
      };

      if (realEstateId) {
        fetchData();
      }
    }, [realEstateId]);

    const renderAreaForm = () => {
      switch (propertyType) {
        // Living
        case "WOHNUNG":
          return (
            <ApartmentArea
              ref={ref}
              updateFormData={updateFormData}
              realEstateId={realEstateId}
            />
          );
        case "HAUS":
          return (
            <HouseArea
              ref={ref}
              updateFormData={updateFormData}
              realEstateId={realEstateId}
            />
          );
        case "GRUNDSTUECK":
          return (
            <PlotArea
              ref={ref}
              updateFormData={updateFormData}
              realEstateId={realEstateId}
            />
          );
        case "PARKEN":
          return (
            <ParkingArea
              ref={ref}
              updateFormData={updateFormData}
              realEstateId={realEstateId}
            />
          );
        case "ZIMMER":
          return (
            <RoomArea
              ref={ref}
              updateFormData={updateFormData}
              realEstateId={realEstateId}
            />
          );
        case "ZINSHAUS_REDITENOBJEKT":
          return (
            <TenementArea
              ref={ref}
              updateFormData={updateFormData}
              realEstateId={realEstateId}
            />
          );

        // Commercial
        case "BUERO_PRAXEN":
          return (
            <OfficeArea
              ref={ref}
              updateFormData={updateFormData}
              realEstateId={realEstateId}
            />
          );
        case "HANDEL":
          return (
            <ShopArea
              ref={ref}
              updateFormData={updateFormData}
              realEstateId={realEstateId}
            />
          );
        case "HALLEN":
          return (
            <IndustrialArea
              ref={ref}
              updateFormData={updateFormData}
              realEstateId={realEstateId}
            />
          );
        case "GASTGEWERBE":
          return (
            <GastronomieArea
              ref={ref}
              updateFormData={updateFormData}
              realEstateId={realEstateId}
            />
          );
        case "LAND_FORSTWIRTSCHAFT":
          return (
            <ForestryArea
              ref={ref}
              updateFormData={updateFormData}
              realEstateId={realEstateId}
            />
          );
        case "SONSTIGE":
          return (
            <GastronomieArea
              ref={ref}
              updateFormData={updateFormData}
              realEstateId={realEstateId}
            />
          );
        default:
          return <div>Unbekannter Immobilientyp: {propertyType}</div>;
      }
    };

    return <div>{renderAreaForm()}</div>;
  }
);
