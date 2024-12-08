import React, { forwardRef } from "react";
import style from "./formContent.module.css";
import { KeyDataForm } from "./Forms/KeyData/keyData";
import { AreaDataForm } from "./Forms/Area/areaData";
import { DetailsDataForm } from "./Forms/Details/detailsData";
import { DescriptionDataForm } from "./Forms/Description/descriptionData";
import { AttachmentDataForm } from "./Forms/Documents/documentsData";
import { PriceDataForm } from "./Forms/Price/priceData";
import { PublishDataForm } from "./Forms/Publish/publishData";

interface FormContentProps {
  step: string;
  updateFormData: (data: any) => void;
  realEstateId: string | string[];
}

interface FormHandle {
  submit: () => Promise<boolean>;
}

export const FormContent = forwardRef<FormHandle, FormContentProps>(
  ({ step, updateFormData, realEstateId }, ref) => {
    const renderForm = () => {
      switch (step) {
        case "Eckdaten":
          return (
            <KeyDataForm
              ref={ref}
              updateFormData={updateFormData}
              realEstateId={realEstateId}
            />
          );
        case "Fläche":
          return (
            <AreaDataForm
              ref={ref}
              updateFormData={updateFormData}
              realEstateId={realEstateId}
            />
          );
        case "Details":
          return (
            <DetailsDataForm
              ref={ref}
              updateFormData={updateFormData}
              realEstateId={realEstateId}
            />
          );
        case "Beschreibung":
          return (
            <DescriptionDataForm
              ref={ref}
              updateFormData={updateFormData}
              realEstateId={realEstateId}
            />
          );
        case "Dokumente":
          return (
            <AttachmentDataForm
              ref={ref}
              updateFormData={updateFormData}
              realEstateId={realEstateId}
            />
          );
        case "Preise":
          return (
            <PriceDataForm
              ref={ref}
              updateFormData={updateFormData}
              realEstateId={realEstateId}
            />
          );
        case "Veröffentlichen":
          return (
            <PublishDataForm
              ref={ref}
              updateFormData={updateFormData}
              realEstateId={realEstateId}
            />
          );
        default:
          return <div>Formular für diesen Schritt fehlt.</div>;
      }
    };

    return (
      <div className={style.FormContainer}>
        <h2>{step}</h2>
        <div className={style.FormContent}>{renderForm()}</div>
      </div>
    );
  }
);
