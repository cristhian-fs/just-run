import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { parseISO } from "date-fns";
import { getUserPlanning } from "@/features/trainings/api/get-user-planning";
import { DataCalendar } from "@/features/trainings/components/workouts-planning/data-calendar";
import { userQueryOptions } from "@/lib/api";

export const Route = createFileRoute("/app/planejamento")({
	component: RouteComponent,
});

function RouteComponent() {
	const { data: user } = useQuery(userQueryOptions());
	const { data: planning } = useQuery({
		queryKey: ["planning"],
		queryFn: () => getUserPlanning(),
	});

	if (!user) {
		return null;
	}

	const workouts = planning?.flatMap((week) => week.workouts);

	const formattedWorkouts = workouts?.map((workout) => ({
		...workout,
		createdAt: parseISO(workout.createdAt),
		updatedAt: parseISO(workout.updatedAt),
	}));

	return (
		<main className='h-full flex-1 px-4 py-4 md:py-6'>
			<div className='h-full'>
				<DataCalendar data={formattedWorkouts || []} />
			</div>
		</main>
	);
}
