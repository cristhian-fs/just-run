import { useQuery } from "@tanstack/react-query";
import { createFileRoute, redirect, useNavigate } from "@tanstack/react-router";
import { Flag, LogOut, UserIcon } from "lucide-react";
import { AppLogo } from "@/components/logo";
import { Button } from "@/components/ui/button";
import { OnboardingHome } from "@/features/onboarding/components/onboarding-home";
import { OnboardingStep1 } from "@/features/onboarding/components/onboarding-step-1";
import { OnboardingStep2 } from "@/features/onboarding/components/onboarding-step-2";
import { OnboardingStep3 } from "@/features/onboarding/components/onboarding-step-3";
import { MultiStepForm } from "@/features/onboarding/components/stepped-form";
import type { FormStep } from "@/features/onboarding/types";
import { userQueryOptions } from "@/lib/api";
import { authClient } from "@/lib/auth-client";
import { onboardingStep1, TestFormSchema } from "@/shared/schemas";

export const Route = createFileRoute("/onboarding")({
	component: RouteComponent,
	beforeLoad: async ({ context }) => {
		const user = await context.queryClient.ensureQueryData(userQueryOptions());

		if (!user) {
			throw redirect({ to: "/login" });
		}

		if (user.hasCompleteOnboarding) {
			throw redirect({ to: "/app" });
		}
	},
});

export const onboardingSteps: FormStep[] = [
	{
		title: "Bem vindo ao JustRun",
		component: <OnboardingHome />,
		icon: UserIcon,
		position: 1,
		mobileOnly: true,
	},
	{
		title: "Informações pessoais",
		component: <OnboardingStep1 />,
		icon: UserIcon,
		position: 2,
		validationSchema: onboardingStep1,
		fields: [
			"name",
			"email",
			"gender",
			"age",
			"weightKg",
			"heightCm",
			"trainingLevel",
		],
		mobileOnly: false,
	},
	{
		title: "Teste de corrida",
		component: <OnboardingStep2 />,
		icon: Flag,
		position: 3,
		validationSchema: TestFormSchema,
		fields: ["testType", "time", "distanceM", "goal", "testDate", "raceDate"],
		mobileOnly: false,
	},
	{
		title: "Planejamento",
		component: <OnboardingStep3 />,
		icon: Flag,
		position: 4,
		mobileOnly: false,
	},
];

function RouteComponent() {
	const { data: user } = useQuery(userQueryOptions());
	const gender = (user?.gender ?? "male") as "male" | "female";

	const navigate = useNavigate();

	if (!user) {
		return null;
	}

	const logout = async () => {
		await authClient.signOut();
		navigate({ to: "/login", replace: true });
	};

	return (
		<main className=''>
			<header className='fixed top-0 left-1/2 -translate-x-1/2 w-full px-4 md:px-6 py-3'>
				<div className='flex w-full items-center justify-between gap-x-2'>
					<AppLogo className='w-14' />
					<Button variant='ghost' onClick={logout}>
						Sair
						<LogOut />
					</Button>
				</div>
			</header>
			<div className='w-full max-w-3xl mx-auto'>
				<MultiStepForm
					steps={onboardingSteps}
					defaultValues={{
						name: user?.name ?? "",
						email: user?.email ?? "",
						gender: gender,
						age: user?.age ?? 18,
						weightKg: 70,
						heightCm: 170,
					}}
				/>
			</div>
		</main>
	);
}
