import { format, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";
import { CalendarClockIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import type { TTrainingType, WorkoutSelect } from "@/shared/types";
import { useWorkoutSheetStore } from "../../store/workout-sheet-store";
import { RunTypeBadge } from "../run-type-badge";

export const RUN_TYPE_MAPPING: Record<TTrainingType, string> = {
	EASY_RUN: "Corrida fácil",
	FARTLEK: "Fartlek",
	INTERVAL: "Intervalado",
	LONG_RUN: "Corrida longa",
	PROGRESSIVE_RUN: "Corrida progressiva",
	RECOVERY_RUN: "Recuperação",
	REPETITION: "Repetição",
	THRESHOLD_RUN: "Corrida de limiar/ritmado",
	REST: "Descanso",
};

export const WorkoutCard = ({
	workout,
	inCalendar,
}: {
	workout: WorkoutSelect;
	inCalendar: boolean;
}) => {
	const formatted = format(
		parseISO(workout.scheduledStart),
		"EEEEEE, d 'de' MMMM",
		{
			locale: ptBR,
		},
	);

	const state = useWorkoutSheetStore();

	return (
		<Card
			className='bg-card-outter hover:bg-muted/70 relative cursor-pointer overflow-hidden py-4 transition-all duration-200'
			onClick={() => {
				state.setWorkoutId(workout.id);
				state.setIsOpen(true);
			}}
		>
			<span
				className={cn(
					"pointer-events-none absolute left-0 top-0 h-full w-1.5",
					workout.runType === "FARTLEK" &&
						"bg-gradient-to-b from-orange-600 to-orange-400",
					workout.runType === "PROGRESSIVE_RUN" &&
						"bg-gradient-to-b from-amber-600 to-amber-400",
					workout.runType === "THRESHOLD_RUN" &&
						"bg-gradient-to-b from-rose-600 to-rose-400",
					workout.runType === "LONG_RUN" &&
						"bg-gradient-to-b from-sky-600 to-sky-400",
					workout.runType === "EASY_RUN" &&
						"bg-gradient-to-b from-emerald-600 to-emerald-400",
					workout.runType === "RECOVERY_RUN" &&
						"bg-gradient-to-b from-slate-600 to-slate-400",
					workout.runType === "INTERVAL" &&
						"bg-gradient-to-b from-violet-600 to-violet-400",
				)}
			/>
			<CardHeader>
				<div className='flex justify-between gap-x-2'>
					<div className='flex gap-x-2'>
						{!inCalendar && (
							<Badge variant='secondary' className='text-sm'>
								<CalendarClockIcon />
								{formatted}
							</Badge>
						)}
						<RunTypeBadge variant={workout.runType}>
							{RUN_TYPE_MAPPING[workout.runType]}
						</RunTypeBadge>
					</div>
					{workout.isCompleted && <Checkbox checked={workout.isCompleted} />}
				</div>
				<CardTitle className='truncate text-base'>{workout.title}</CardTitle>
				<div className='flex items-center gap-x-2'>
					<p className='text-muted-foreground text-sm'>
						{RUN_TYPE_MAPPING[workout.runType]}{" "}
						{workout.plannedDurationS !== null &&
							Number(workout.plannedDurationS) > 0 && (
								<span>• {Math.round(workout.plannedDurationS / 60)} min</span>
							)}
						{workout.plannedDistanceM !== null &&
							Number(workout.plannedDistanceM) > 0 && (
								<span>• {Math.round(workout.plannedDistanceM / 1000)} km</span>
							)}
					</p>
				</div>
			</CardHeader>
		</Card>
	);
};

WorkoutCard.Loading = function WorkoutCardSkeleton() {
	return (
		<Card className='bg-muted'>
			<CardHeader>
				<div className='flex gap-x-2'>
					<Skeleton className='h-5 w-24' />
					<Skeleton className='h-5 w-32' />
				</div>
				<Skeleton className='h-7 w-full' />
				<Skeleton className='h-5 w-52' />
			</CardHeader>
		</Card>
	);
};
