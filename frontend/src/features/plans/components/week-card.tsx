import { ChevronDown, ChevronRight } from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from "@/components/ui/collapsible";
import type { TrainingPlanWeekWithWorkouts } from "@/shared/types";
import { PlanWorkoutCard } from "./plan-workout-card";

// WeekCard.tsx
export function WeekCard({ week }: { week: TrainingPlanWeekWithWorkouts }) {
	const [open, setOpen] = useState(false);

	return (
		<Card className='py-0 overflow-hidden'>
			<Collapsible open={open} onOpenChange={setOpen}>
				<CollapsibleTrigger asChild>
					<CardHeader className='cursor-pointer hover:bg-muted/50 py-4 transition-colors'>
						<div className='flex items-center justify-between'>
							<div className='flex items-center gap-3'>
								{open ? (
									<ChevronDown className='h-5 w-5 text-muted-foreground' />
								) : (
									<ChevronRight className='h-5 w-5 text-muted-foreground' />
								)}
								<div>
									<CardTitle className='text-lg'>
										Semana {week.weekNumber}
									</CardTitle>
									<CardDescription>
										{week.planWorkouts.length} treinos{" "}
										{week.totalVolumeMin
											? `• ${week.totalVolumeMin}km total`
											: ""}
									</CardDescription>
								</div>
							</div>
							<Badge variant='secondary'>
								{week.planWorkouts.length} treinos
							</Badge>
						</div>
					</CardHeader>
				</CollapsibleTrigger>

				<CollapsibleContent>
					<CardContent className='pt-2 pb-3'>
						<div className='space-y-3'>
							{week.planWorkouts.map((workout) => (
								<PlanWorkoutCard key={workout.id} workout={workout} />
							))}
						</div>
					</CardContent>
				</CollapsibleContent>
			</Collapsible>
		</Card>
	);
}
