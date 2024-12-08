import React from "react";
import style from "./stepNavigation.module.css";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/router";

interface StepNavigationProps {
  onPrevious: () => void;
  onNext: () => Promise<boolean>;
  isFirstStep: boolean;
  isLastStep: boolean;
}

export const StepNavigation: React.FC<StepNavigationProps> = ({
  onPrevious,
  onNext,
  isFirstStep,
  isLastStep,
}) => {
  const router = useRouter();

  const handleNextClick = async () => {
    const isValid = await onNext();
    if (isLastStep && isValid) {
      const { realEstateId } = router.query;
      const storageKey = `currentStep_${realEstateId}`;
      sessionStorage.removeItem(storageKey);
      router.push(`/app/shoppingCard/${realEstateId}`);
    }
  };

  return (
    <div className={style.navigationContainer}>
      <div
        className={
          isFirstStep
            ? style.navigationContentFirstPage
            : style.navigationContent
        }
      >
        {!isFirstStep && (
          <Button type="button" onClick={onPrevious}>
            Zurück
          </Button>
        )}
        <Button
          type="button"
          onClick={handleNextClick}
          className={isLastStep ? style.lastButton : ""}
        >
          {isLastStep ? "Weiter zum Bezahlen" : "Weiter"}
        </Button>
      </div>
    </div>
  );
};
