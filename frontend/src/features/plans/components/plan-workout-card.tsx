import { ChevronDown, ChevronRight } from "lucide-react";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { RunTypeBadge } from "@/features/trainings/components/run-type-badge";
import { RUN_TYPE_MAPPING } from "@/features/trainings/components/workouts/workout-card";
import { formatDistance, formatDuration } from "@/lib/calculations";
import { cn } from "@/lib/utils";
import type { TrainingPlanWorkoutWithBlock } from "@/shared/types";
import { PlanBlockCard } from "./plan-block-card";

export function PlanWorkoutCard({
	workout,
}: {
	workout: TrainingPlanWorkoutWithBlock;
}) {
	const [open, setOpen] = useState(false);

	if (workout.runType === "REST") {
		return (
			<Card className='py-0 relative overflow-hidden'>
				<span
					className={cn(
						"pointer-events-none absolute left-0 top-0 h-full w-1.5",
						"bg-gradient-to-b from-slate-600 to-slate-400",
					)}
				/>
				<CardHeader className='py-3 px-10'>
					<div className='flex items-center justify-between'>
						<div>
							<CardTitle className='text-base'>{workout.title}</CardTitle>
							<div className='flex items-center gap-2 mt-1'>
								<RunTypeBadge variant={workout.runType}>
									{RUN_TYPE_MAPPING[workout.runType]}
								</RunTypeBadge>
								<span className='text-sm text-muted-foreground'>
									{formatDistance(workout.plannedDistanceM)} •{" "}
									{formatDuration(workout.plannedDurationS)}
								</span>
							</div>
						</div>
					</div>
				</CardHeader>
			</Card>
		);
	}

	return (
		<Card className='relative py-0 overflow-hidden'>
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
					workout.runType === "REPETITION" &&
						"bg-gradient-to-b from-violet-600 to-violet-400",
				)}
			/>
			<Collapsible open={open} onOpenChange={setOpen}>
				<CollapsibleTrigger asChild>
					<CardHeader className='transition-colors hover:bg-muted py-3 px-3'>
						<div className='flex items-center gap-3'>
							{open ? (
								<ChevronDown className='h-4 w-4 text-muted-foreground' />
							) : (
								<ChevronRight className='h-4 w-4 text-muted-foreground' />
							)}
							<div>
								<CardTitle className='text-base'>{workout.title}</CardTitle>
								<div className='flex items-center gap-2 mt-1'>
									<RunTypeBadge variant={workout.runType}>
										{RUN_TYPE_MAPPING[workout.runType]}
									</RunTypeBadge>
									<span className='text-sm text-muted-foreground'>
										{formatDistance(workout.plannedDistanceM)} •{" "}
										{formatDuration(workout.plannedDurationS)}
									</span>
								</div>
							</div>
						</div>
					</CardHeader>
				</CollapsibleTrigger>

				<CollapsibleContent>
					<CardContent className='pt-2 px-4 md:px-10 pb-3'>
						{workout.notes && (
							<p className='text-sm text-muted-foreground mb-4 italic'>
								{workout.notes}
							</p>
						)}
						<div className='space-y-3'>
							{workout.planBlocks.map((block) => (
								<PlanBlockCard key={block.id} block={block} />
							))}
						</div>
					</CardContent>
				</CollapsibleContent>
			</Collapsible>
		</Card>
	);
}
