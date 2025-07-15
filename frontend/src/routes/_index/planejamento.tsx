import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";

import { getUserPlanning } from "@/features/trainings/api/get-user-planning";
import { DataCalendar } from "@/features/trainings/components/workouts-planning/data-calendar";
import { parseISO } from "date-fns";

import { userQueryOptions } from "@/lib/api";

export const Route = createFileRoute("/_index/planejamento")({
  component: RouteComponent,
});

function RouteComponent() {
  const { data: user } = useQuery(userQueryOptions());
  if (!user) {
    return null;
  }
  const { data: planning } = useQuery({
    queryKey: ["planning"],
    queryFn: () => getUserPlanning(),
  });

  const workouts = planning?.map((week) => week.workouts).flat();

  const formattedWorkouts = workouts?.map((workout) => ({
    ...workout,
    createdAt: parseISO(workout.createdAt),
    updatedAt: parseISO(workout.updatedAt),
  }));

  return (
    <main className="h-full flex-1 px-2 py-4 md:py-6">
      <div className="h-full">
        <DataCalendar data={formattedWorkouts || []} />
      </div>
    </main>
  );
}
