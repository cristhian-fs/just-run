import { createContext, useState, useContext  } from "react";
import { FieldKeys, FormStep, MultiStepFormContextProps } from "../types";
import { FormProvider, useForm } from "react-hook-form";
import { CombinedOnboardingSchema } from "@/shared/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import ProgressIndicator from "./progress-indicator";
import { useIsMobile } from "@/hooks/use-mobile";

export const MultiStepFormContext = createContext<MultiStepFormContextProps | null>(null);

export const useMultiStepForm = () => {
  const context = useContext(MultiStepFormContext);
  if (!context) {
    throw new Error(
      'useMultiStepForm must be used within MultiStepForm.Provider'
    )
  }
  return context
}

export const MultiStepForm = ({ 
  steps, 
  defaultValues 
}: { 
  steps: FormStep[], 
  defaultValues: Partial<z.infer<typeof CombinedOnboardingSchema>> 
}) => {

  const methods = useForm<z.infer<typeof CombinedOnboardingSchema>>({
    resolver: zodResolver(CombinedOnboardingSchema),
    defaultValues
  });

  const isMobile = useIsMobile();

  const filteredSteps = steps.filter((step) => {
    if (isMobile) return true;
    return !step.mobileOnly;
  });

  // FormState
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const currentStep = filteredSteps[currentStepIndex];

  // Navigation Functions
  const nextStep = async () => {

    // steps can have empty fields, because must be a screen to the user just click on a button
    if(currentStep.fields){
      const isValid = await methods.trigger(currentStep.fields);

      if(!isValid){
        return; // Stop progression if validation fails
      }

      console.log({
        fields: currentStep.fields,
        values: methods.getValues(currentStep.fields),
        isValid: isValid
      })

      // grab values in current step and transform array to object
      const currentStepValues = methods.getValues(currentStep.fields);
      const formValues = Object.fromEntries(
        currentStep.fields.map((field, index) => [field, currentStepValues[index]]) || ''
      );

      // Validate the form state agains the current step's schema
      if(currentStep.validationSchema){
        const validationResult = currentStep.validationSchema.safeParse(formValues);

        console.log(validationResult);

        if(!validationResult.success){
          validationResult.error.errors.forEach((err) => {
            methods.setError(err.path.join('.') as FieldKeys, {
              type: "manual",
              message: err.message
            })
          });

          return;
        }
      }
    } 

    if(currentStepIndex < steps.length - 1){
      setCurrentStepIndex(currentStepIndex + 1);
    }
  }

  const previousStep = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(currentStepIndex - 1);
    }
  };

  const goToStep = (position: number) => {
    if (position >= 0 && position - 1 < steps.length) {
      setCurrentStepIndex(position - 1);
    }
  }

  // Context value
  const value: MultiStepFormContextProps = {
    currentStep: steps[currentStepIndex],
    currentStepIndex,
    isFirstStep: currentStepIndex === 0,
    isLastStep: currentStepIndex === steps.length - 1,
    goToStep,
    nextStep,
    previousStep,
    steps,
  };

  return (
    <MultiStepFormContext.Provider value={value}>
        <div className="w-full mx-auto md:py-6">
          {!isMobile && <ProgressIndicator />}
          <FormProvider {...methods}>
            <form className="md:mt-24 max-w-lg mx-auto">
              {currentStep.component}
            </form>
          </FormProvider>
        </div>
    </MultiStepFormContext.Provider>
  )
}