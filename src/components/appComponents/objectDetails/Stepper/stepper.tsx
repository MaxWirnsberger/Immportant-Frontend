import { cn } from "@/lib/utils";
import { Check } from 'lucide-react';
import styles from "./stepper.module.css";

interface StepperProps {
  steps: string[];
  currentStep: number;
  onStepClick: (index: number) => void;
}

export const Stepper: React.FC<StepperProps> = ({ steps, currentStep, onStepClick }) => {
  return (
    <div className={styles.stepperContainer}>
      <div className={styles.stepsWrapper}>
        {steps.map((step, index) => (
          <div key={step} className={styles.stepItem}>
            <button
              // onClick={() => onStepClick(index)}
              className={cn(
                styles.stepButton,
                index <= currentStep && styles.stepButtonActive
              )}
            >
              {index <= currentStep && (
                <Check />
              )}
            </button>
            <span className={styles.stepLabel}>{step}</span>
          </div>
        ))}
      </div>
      <div className={styles.separatorContainer}>
        <div
          className={styles.separatorActive}
          style={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
        />
      </div>
    </div>
  );
};
