import React, { forwardRef, useEffect, useState } from "react";
import axiosInstance from "@/lib/axiosInstance";

import { SellDataForm } from "./PriceForms/sellingDetails";
import { RentDataForm } from "./PriceForms/rentDetails";

interface PriceDataFormProps {
  updateFormData: (data: any) => void;
  realEstateId: string | string[];
}

interface FormHandle {
  submit: () => Promise<boolean>;
}

export const PriceDataForm = forwardRef<FormHandle, PriceDataFormProps>(
  ({ updateFormData, realEstateId }, ref) => {
    const [propertyType, setPropertyType] = useState<string | null>(null);
    const [typeOfMarketing, setTypeOfMarketing] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
      const fetchData = async () => {
        try {
          const response = await axiosInstance.get(
            `/real-estate/detail/${realEstateId}/?fields=object_category`
          );
          const data = response.data;

          setTypeOfMarketing(data.object_category?.marketing_type || null);
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
      switch (typeOfMarketing) {
        case "KAUF":
          return (
            <SellDataForm
              ref={ref}
              updateFormData={updateFormData}
              realEstateId={realEstateId}
              propertyType={propertyType}
            />
          );
        case "MIETE_PACHT":
          return (
            <RentDataForm
              ref={ref}
              updateFormData={updateFormData}
              realEstateId={realEstateId}
            />
          );
        default:
          return <div>Unbekannter Immobilientyp: {typeOfMarketing}</div>;
      }
    };

    return <div>{renderDetailForm()}</div>;
  }
);
