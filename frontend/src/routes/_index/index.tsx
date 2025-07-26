import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";

import { getMonthlySummary } from "@/features/home/api/get-monthly-summary";
import { getVolumeProgression } from "@/features/home/api/get-volume-progression";
import { getWeeklyIntensity } from "@/features/home/api/get-weekly-intensity";
import { getWeeklyVolume } from "@/features/home/api/get-weekly-volume";
import { MonthlySummaryCard } from "@/features/home/components/monthly-summary-card";
import { RunningProgressionCard } from "@/features/home/components/running-progression-card";
import { WeeklyIntensityCard } from "@/features/home/components/weekly-intensity-card";
import { WeeklyVolumeCard } from "@/features/home/components/weekly-volume-card";
import { getNextWorkout } from "@/features/trainings/api/use-get-next-workout";
import { CreatePeriodizationDialog } from "@/features/trainings/components/workouts-planning/create-periodization-dialog";
import { WorkoutCard } from "@/features/trainings/components/workouts/workout-card";
import { parseISO } from "date-fns";
import { ChevronRight, Zap } from "lucide-react";

import { userQueryOptions } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { DashboardCard } from "@/components/dashboard-card";

export const Route = createFileRoute("/_index/")({
  component: RouteComponent,
});

function RouteComponent() {
  const { data: user } = useQuery(userQueryOptions());
  const [period, setPeriod] = useState<"7 days" | "14 days" | "30 days">(
    "7 days",
  );
  if (!user) {
    return null;
  }

  const { data: nextWorkout, isLoading: isNextWorkoutLoading } = useQuery({
    queryKey: ["user", "next-workout"],
    queryFn: () => getNextWorkout(),
  });

  const { data: weeklyVolume, isLoading: isWeeklyVolumeLoading } = useQuery({
    queryKey: ["weekly-volume"],
    queryFn: () => getWeeklyVolume(),
  });

  const { data: monthlySummary, isLoading: isMonthlySummaryLoading } = useQuery(
    {
      queryKey: ["monthly-summary"],
      queryFn: () => getMonthlySummary(),
    },
  );

  const { data: volumeProgression, isLoading: isVolumeProgressionLoading } =
    useQuery({
      queryKey: ["volume-progression", period],
      queryFn: () =>
        getVolumeProgression({
          period,
        }),
    });

  const { data: weeklyIntensitym, isLoading: isWeeklyIntensityLoading } =
    useQuery({
      queryKey: ["weekly-intensity-volume"],
      queryFn: () => getWeeklyIntensity(),
    });

  const nextWorkoutToday =
    nextWorkout?.data?.scheduledStart?.split("T")[0] ===
    new Date().toISOString().split("T")[0];

  return (
    <main className="px-2 py-4 md:py-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col">
          <h3 className="text-xl font-semibold md:text-2xl">
            Bem vindo de volta, {user.name}!
          </h3>
          {nextWorkoutToday ? (
            <p className="text-muted-foreground text-base">
              Você tem{" "}
              <span className="text-foreground font-medium">
                1 treino para hoje
              </span>
            </p>
          ) : (
            <p className="text-muted-foreground text-base">
              Você não tem treinos para hoje
            </p>
          )}
        </div>
        <div className="flex gap-x-2">
          <CreatePeriodizationDialog />
        </div>
      </div>
      <div className="mt-8 grid grid-cols-1 gap-4 lg:grid-cols-2 xl:grid-cols-3">
        <DashboardCard
          title="Proximo treino"
          icon={Zap}
          footerContent={
            <Button
              size="sm"
              variant="link"
              className="h-auto w-full justify-between gap-2 py-2 text-current"
              asChild
            >
              <Link to="/planejamento">
                Ver todos os treinos
                <ChevronRight />
              </Link>
            </Button>
          }
        >
          {isNextWorkoutLoading ? (
            <WorkoutCard.Loading />
          ) : nextWorkout?.data ? (
            <WorkoutCard
              inCalendar={false}
              workout={{
                ...nextWorkout.data,
                createdAt: parseISO(nextWorkout.data.createdAt),
                updatedAt: parseISO(nextWorkout.data.updatedAt),
              }}
            />
          ) : null}
        </DashboardCard>
        {isWeeklyVolumeLoading ? (
          <WeeklyVolumeCard.Loading />
        ) : (
          weeklyVolume && <WeeklyVolumeCard data={weeklyVolume} />
        )}
        {isMonthlySummaryLoading ? (
          <MonthlySummaryCard.Loading />
        ) : (
          monthlySummary && (
            <MonthlySummaryCard
              data={monthlySummary}
              className="lg:col-span-2 xl:col-span-1"
            />
          )
        )}
        {isVolumeProgressionLoading ? (
          <RunningProgressionCard.Loading className="xl:col-span-2" />
        ) : (
          volumeProgression && (
            <RunningProgressionCard
              className="xl:col-span-2"
              data={volumeProgression}
              onPeriodChange={setPeriod}
              period={period}
            />
          )
        )}
        {isWeeklyIntensityLoading ? (
          <WeeklyIntensityCard.Loading />
        ) : (
          weeklyIntensitym && (
            <WeeklyIntensityCard weeklyIntensityData={weeklyIntensitym} />
          )
        )}
      </div>
    </main>
  );
}
