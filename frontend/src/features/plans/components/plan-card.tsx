import { Link } from "@tanstack/react-router";
import { Calendar, Clock, Flag, User } from "lucide-react";
import { DashboardCard } from "@/components/dashboard-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { TrainingPlan } from "@/shared/types";

export const levelColors = {
	beginner: "bg-green-100 text-green-800 border-green-200",
	intermediate: "bg-blue-100 text-blue-800 border-blue-200",
	advanced: "bg-orange-100 text-orange-800 border-orange-200",
	elite: "bg-red-100 text-red-800 border-red-200",
};

export const LEVEL_MAPPING = {
	beginner: "Iniciante",
	intermediate: "Intermediário",
	advanced: "Avançado",
	elite: "Elite",
};

export const PlanCard = ({ plan }: { plan: TrainingPlan }) => {
	return (
		<DashboardCard
			title={plan.name}
			icon={Flag}
			description={plan.description || "Sem descrição"}
		>
			<div className='space-y-3'>
				{/* Coach Info */}
				{plan.coach && (
					<div className='flex items-center gap-2 text-sm text-muted-foreground'>
						<User className='h-4 w-4' />
						<span>Coach: {plan.coach}</span>
					</div>
				)}

				{Number(plan.weeklyVolume) > 0 && (
					<div className='flex items-center gap-2 text-sm text-muted-foreground'>
						<Clock className='h-4 w-4' />
						<span>{plan.weeklyVolume} km/semana</span>
					</div>
				)}

				{/* Duration */}
				{plan.totalWeeks && (
					<div className='flex items-center gap-2 text-sm text-muted-foreground'>
						<Calendar className='h-4 w-4' />
						<span>{plan.totalWeeks} semanas</span>
					</div>
				)}
				<div className="flex items-center gap-2 flex-wrap">
					<Badge
						variant='outline'
						className={levelColors[plan.level as keyof typeof levelColors]}
					>
						{LEVEL_MAPPING[plan.level as keyof typeof LEVEL_MAPPING]}
					</Badge>
					{plan.distances.map((distance) => (
						<Badge variant={'outline'}>{distance}</Badge>
					))}
				</div>
			</div>

			<Link
				to={"/app/planos/$planId"}
				params={{
					planId: plan.id,
				}}
			>
				<Button className='w-full mt-6' size='lg'>
					Iniciar plano
				</Button>
			</Link>
		</DashboardCard>
	);
};
