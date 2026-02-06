import { useNavigate } from "@tanstack/react-router";
import { motion } from "motion/react";
import { useFormContext } from "react-hook-form";
import { toast } from "sonner";
import type { z } from "zod";
import { Button } from "@/components/ui/button";
import { useAddTest } from "@/features/settings/api/use-add-test";
import { useUpdateProfile } from "@/features/settings/api/use-update-profile";
import type { onboardingStep1, TestFormSchema } from "@/shared/schemas";

const MAP_RACE_TO_DISTANCE_PARAMS = {
	race5k: "5km",
	race10k: "10km",
	race21k: "21km",
	race42k: "42km",
};

export function OnboardingStep3() {
	const { getValues: getValuesStep1 } =
		useFormContext<z.infer<typeof onboardingStep1>>();
	const { getValues: getValuesStep2 } =
		useFormContext<z.infer<typeof TestFormSchema>>();

	const { mutateAsync: updateProfileMutate } = useUpdateProfile();
	const { mutateAsync: addTestAsync } = useAddTest();
	const navigate = useNavigate();

	const handleSubmit = async () => {
		try {
			const profileData = getValuesStep1();
			const testData = getValuesStep2();

			// 1. Atualiza perfil
			await updateProfileMutate({
				form: {
					age: profileData.age.toString(),
					email: profileData.email,
					gender: profileData.gender,
					heightCm: profileData.heightCm.toString(),
					name: profileData.name,
					weightKg: profileData.weightKg.toString(),
					trainingLevel: profileData.trainingLevel,
				},
			});

			// 2. Cria teste
			await addTestAsync({
				form: {
					distanceM: testData.distanceM.toString(),
					time: testData.time,
					testType: testData.testType,
					goal: testData.goal,
					testDate: testData.testDate.toISOString(),
					raceDate: testData.raceDate
						? testData.raceDate.toISOString()
						: undefined,
				},
			});
			toast.success("Onboarding finalizado com sucesso.");
			navigate({
				to: "/app/planos",
				params: {
					level: profileData.trainingLevel,
					...(["race5k", "race10k", "race21k", "race42k"].includes(
						testData.goal,
					) && {
						distance:
							MAP_RACE_TO_DISTANCE_PARAMS[
								testData.goal as keyof typeof MAP_RACE_TO_DISTANCE_PARAMS
							],
					}),
				},
			});
		} catch (error) {
			console.error("Erro ao finalizar onboarding:", error);
			toast.error("Erro ao finalizar onboarding. Tente novamente.");
		}
	};

	return (
		<motion.div
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			exit={{ opacity: 0 }}
			transition={{ duration: 0.4, ease: "easeOut" }}
			className='space-y-4 flex flex-col min-h-screen justify-end p-6 py-24 md:min-h-0 md:py-0 md:justify-start'
		>
			<div className='flex flex-col relative z-10 max-w-lg mx-auto md:text-center'>
				<h1 className='text-3xl font-semibold'>Planos de treinamento</h1>
				<p className='text-muted-foreground mt-2'>
					Com base nos dados que voce forneceu, aqui estao alguns planos de
					treinamento que se encaixam no seu objetivo e nivel atual
				</p>
				<div className='flex flex-col gap-y-2 mt-6'>
					<Button
						className={"w-full"}
						type='button'
						onClick={() => handleSubmit()}
					>
						Ver planos
					</Button>
				</div>
			</div>
		</motion.div>
	);
}
