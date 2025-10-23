import type { LucideIcon } from "lucide-react";
import type { ZodType } from "zod";
import type { CombinedOnboardingType } from "@/shared/schemas";

export type FieldKeys = keyof CombinedOnboardingType;

export type FormStep = {
	title: string;
	position: number;
	component: React.ReactElement;
	icon: LucideIcon;

	// Validation
	validationSchema?: ZodType<unknown>;
	fields?: FieldKeys[];

	// Responsive setting
	mobileOnly?: boolean;
};

export interface MultiStepFormContextProps {
	currentStep: FormStep;
	currentStepIndex: number;
	isFirstStep: boolean;
	isLastStep: boolean;
	nextStep: () => void;
	previousStep: () => void;
	goToStep: (step: number) => void;
	steps: FormStep[];
}
