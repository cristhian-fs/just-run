import { useQuery } from "@tanstack/react-query";
import { Loader, Play } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { getUserPlanning } from "@/features/trainings/api/get-user-planning";
import { useConfirm } from "@/hooks/use-confirm";
import type { TrainingPlanSelect } from "@/shared/types";
import { activatePlan } from "../api/activate-plan";
import { CustomizePlanDialog } from "./custom-plan-dialog";
import { LEVEL_MAPPING, levelColors } from "./plan-card";
import { WeekCard } from "./week-card";

interface PlanViewProps {
	plan: TrainingPlanSelect;
}

// PlanView.tsx
export function PlanView({ plan }: PlanViewProps) {
	const [OverrideCurrentPlanningDialog, confirm] = useConfirm({
		title: "Sobreescrever treino atual?",
		message:
			"Você já tem um plano de treinamento ativo, deseja sobreescrever? Não se preocupe, se já tiver concluido algum treino, seu histórico será salvo e poderá ser acessado na tela de histórico.",
		buttonCopy: {
			idle: "Ativar plano",
			loading: <Loader size={16} color='rgba(255, 255, 255, 0.65)' />,
		},
		variant: "gradient",
	});

	const { mutate: activePlan } = activatePlan();
	const planning = useQuery({
		queryKey: ["planning"],
		queryFn: () => getUserPlanning(),
	});

	const handleActivePlan = async () => {
		if (planning.data?.length) {
			await confirm();
		}

		activePlan({
			param: {
				planId: plan.id,
			},
		});
	};

	return (
		<>
			<OverrideCurrentPlanningDialog />
			<div className='flex flex-col items-start gap-4 md:flex-row md:items-center'>
				<h1 className='text-3xl font-semibold tracking-tight'>{plan.name}</h1>
				<Badge
					variant='outline'
					className={levelColors[plan.level as keyof typeof levelColors]}
				>
					{LEVEL_MAPPING[plan.level as keyof typeof LEVEL_MAPPING]}
				</Badge>
			</div>
			<p className='text-muted-foreground'>{plan.description}</p>
			<div className='flex flex-col items-start sm:flex-row sm:flex-wrap w-full gap-2 sm:items-center mt-4'>
				<Button variant='gradient' onClick={() => handleActivePlan()}>
					Ativar plano
					<Play />
				</Button>
				<CustomizePlanDialog planId={plan.id} />
			</div>

			<div className='mt-10'>
				<p className='text-lg text-muted-foreground'>Semanas de treino</p>
				<Separator className='mt-1' />
				<div className='mt-4 space-y-4'>
					{plan.planWeeks.map((week) => (
						<WeekCard key={week.id} week={week} />
					))}
				</div>
			</div>
		</>
	);
}
