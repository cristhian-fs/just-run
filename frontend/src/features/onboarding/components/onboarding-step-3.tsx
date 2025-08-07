import { Button } from "@/components/ui/button";
import { motion } from "motion/react";
import { useFormContext } from "react-hook-form";
import { onboardingStep1, TestFormSchema } from "@/shared/schemas";
import { z } from "zod";
import { useUpdateProfile } from "@/features/settings/api/use-update-profile";
import { useAddTest } from "@/features/settings/api/use-add-test";
import { useNavigate } from "@tanstack/react-router";
import { useGeneratePeriodization } from "@/features/trainings/api/use-generate-periodization";
import { toast } from "sonner";

export function OnboardingStep3(){

  const { getValues: getValuesStep1 } = useFormContext<z.infer<typeof onboardingStep1>>()
  const { getValues: getValuesStep2 } = useFormContext<z.infer<typeof TestFormSchema>>()
  
  const { mutateAsync: updateProfileMutate } =
    useUpdateProfile();
  const { mutateAsync: addTestAsync } = useAddTest();
  const { mutateAsync: generatePeriodizationAsync } = useGeneratePeriodization();
  const navigate = useNavigate();
  
 const handleSubmit = async ({ generateUserPeriodization }: { generateUserPeriodization: boolean }) => {
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
        weeklyFrequency: testData.weeklyFrequency.toString(),
        raceDate: testData.raceDate ? testData.raceDate.toISOString() : undefined,
      },
    });

    // 3. Gera periodização (opcional)
    if (generateUserPeriodization) {
      await generatePeriodizationAsync();
    }
    toast.success("Onboarding finalizado com sucesso.");
    // 4. Navega somente se tudo deu certo
    navigate({ to: "/app", replace: true });

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
      className="space-y-4 flex flex-col min-h-screen justify-end p-6 py-24 md:min-h-0 md:py-0 md:justify-start"
    >
      <div className="flex flex-col relative z-10 max-w-lg mx-auto md:text-center">
        <h1 
          className="text-3xl font-semibold"
        >
          Planejamento de treinos
        </h1>
        <p
          className="text-muted-foreground"
        >
          Quer que nós criamos um planejamento de treinos específico para voce?
        </p>
        <div className="flex flex-col gap-y-2 mt-6">
          <Button
            className={"w-full"}
            type="button"
            onClick={() => handleSubmit({ generateUserPeriodization: true })}
          >
            Criar planejamento
          </Button>
          <Button
            variant="ghost"
            type="button"
            className={"w-full"} 
            onClick={() => handleSubmit({ generateUserPeriodization: false })}
          >
            Não, obrigado
          </Button>
        </div>
      </div>
    </motion.div>
  )
}