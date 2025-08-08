import { Button } from "@/components/ui/button";
import { useMultiStepForm } from "./stepped-form";

export const NextButton = ({
	onClick,
	type,
	...rest
}: React.ButtonHTMLAttributes<HTMLButtonElement>) => {
	const { isLastStep } = useMultiStepForm();

	return (
		<Button
			className='transition-colors w-full'
			type={type ?? "button"}
			onClick={onClick}
			{...rest}
		>
			{isLastStep ? "Enviar" : "Continuar"}
		</Button>
	);
};
