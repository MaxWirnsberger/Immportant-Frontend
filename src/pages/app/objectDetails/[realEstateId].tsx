import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/router";
import globalStyle from "@/pages/app/globalApp.module.css";
import style from "./objectDetails.module.css";
import { FormContent } from "@/components/appComponents/objectDetails/FormContent/formContent";
import { Stepper } from "@/components/appComponents/objectDetails/Stepper/stepper";
import { StepNavigation } from "@/components/appComponents/objectDetails/Stepper/StepNavigation/stepNavigation";

interface FormHandle {
  submit: () => Promise<boolean>;
}

const steps = [
  "Eckdaten",
  "Fläche",
  "Details",
  "Beschreibung",
  "Dokumente",
  "Preise",
  "Veröffentlichen",
];

export default function MultiStepForm() {
  const router = useRouter();
  const { realEstateId } = router.query;

  if (!realEstateId) {
    return <div>Laden...</div>;
  }

  const storageKey = `currentStep_${realEstateId}`;
  const [currentStep, setCurrentStep] = useState<number>(() => {
    if (typeof window !== "undefined") {
      const savedStep = sessionStorage.getItem(storageKey);
      return savedStep ? parseInt(savedStep, 10) : 0;
    }
    return 0;
  });

  const [formData, setFormData] = useState({});
  const stepRef = useRef<FormHandle>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      sessionStorage.setItem(storageKey, currentStep.toString());
    }
  }, [currentStep, storageKey]);

  const handleNext = async (): Promise<boolean> => {
    if (stepRef.current) {
      const success = await stepRef.current.submit();
      if (success && currentStep < steps.length - 1) {
        setCurrentStep((prev) => prev + 1);
      }
      return success;
    }
    return false; 
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const updateFormData = (stepData: any) => {
    setFormData((prevData) => ({ ...prevData, ...stepData }));
  };

  const renderStepContent = () => {
    return (
      <FormContent
        ref={stepRef}
        step={steps[currentStep]}
        updateFormData={updateFormData}
        realEstateId={realEstateId}
      />
    );
  };

  return (
    <main className={globalStyle.appMainContainer}>
      <div className={style.multiFormContainer}>
        <h2>Immobilien Details</h2>
        <Stepper
          steps={steps}
          currentStep={currentStep}
          onStepClick={(index) => {
          }}
        />
        {renderStepContent()}
        <StepNavigation
          onPrevious={handlePrevious}
          onNext={handleNext}
          isFirstStep={currentStep === 0}
          isLastStep={currentStep === steps.length - 1}
        />
      </div>
    </main>
  );
}

