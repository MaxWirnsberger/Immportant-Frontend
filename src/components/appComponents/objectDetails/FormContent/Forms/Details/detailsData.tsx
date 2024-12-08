import React, { forwardRef, useEffect, useState } from "react";
import axiosInstance from "@/lib/axiosInstance";

// Living
import { ApartmentDetails } from "./DetailsForms/aparmentsDetails";
import { HouseDetails } from "./DetailsForms/houseDetails";
import { PlotDetails } from "./DetailsForms/plotDetails";
import { ParkingDetails } from "./DetailsForms/parkingDetails";

// Commercial
import { OfficeDetails } from "./DetailsForms/officeDetails";
import { IndustrialDetails } from "./DetailsForms/industrialDetails";
import { GastronomyDetails } from "./DetailsForms/gastronomyDetails";

interface AreaDataFormProps {
  updateFormData: (data: any) => void;
  realEstateId: string | string[];
}

interface FormHandle {
  submit: () => Promise<boolean>;
}

export const DetailsDataForm = forwardRef<FormHandle, AreaDataFormProps>(
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

    const renderDetailForm = () => {
      switch (propertyType) {
        // Living
        case "WOHNUNG":
          return (
            <ApartmentDetails
              ref={ref}
              updateFormData={updateFormData}
              realEstateId={realEstateId}
            />
          );
        case "HAUS":
          return (
            <HouseDetails
              ref={ref}
              updateFormData={updateFormData}
              realEstateId={realEstateId}
              propertyType={propertyType}
            />
          );
        case "GRUNDSTUECK":
          return (
            <PlotDetails
              ref={ref}
              updateFormData={updateFormData}
              realEstateId={realEstateId}
            />
          );
        case "PARKEN":
          return (
            <ParkingDetails
              ref={ref}
              updateFormData={updateFormData}
              realEstateId={realEstateId}
            />
          );
        case "ZIMMER":
          return (
            <ApartmentDetails
              ref={ref}
              updateFormData={updateFormData}
              realEstateId={realEstateId}
            />
          );
        case "ZINSHAUS_REDITENOBJEKT":
          return (
            <HouseDetails
              ref={ref}
              updateFormData={updateFormData}
              realEstateId={realEstateId}
              propertyType={propertyType}
            />
          );

        // Commercial
        case "BUERO_PRAXEN":
          return (
            <OfficeDetails
              ref={ref}
              updateFormData={updateFormData}
              realEstateId={realEstateId}
            />
          );
        case "HANDEL":
          return (
            <OfficeDetails
              ref={ref}
              updateFormData={updateFormData}
              realEstateId={realEstateId}
            />
          );
        case "HALLEN":
          return (
            <IndustrialDetails
              ref={ref}
              updateFormData={updateFormData}
              realEstateId={realEstateId}
            />
          );
        case "GASTGEWERBE":
          return (
            <GastronomyDetails
              ref={ref}
              updateFormData={updateFormData}
              realEstateId={realEstateId}
            />
          );
        case "LAND_FORSTWIRTSCHAFT":
          return (
            <GastronomyDetails
              ref={ref}
              updateFormData={updateFormData}
              realEstateId={realEstateId}
            />
          );
          case "SONSTIGE":
          return (
            <OfficeDetails
              ref={ref}
              updateFormData={updateFormData}
              realEstateId={realEstateId}
            />
          );
        default:
          return <div>Unbekannter Immobilientyp: {propertyType}</div>;
      }
    };

    return <div>{renderDetailForm()}</div>;
  }
);
