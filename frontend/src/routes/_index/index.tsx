import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";

import { getNextWorkout } from "@/features/trainings/api/use-get-next-workout";
import { WorkoutCard } from "@/features/trainings/components/workouts/workout-card";
import { parseISO } from "date-fns";
import { ChevronRight, Flag } from "lucide-react";

import { userQueryOptions } from "@/lib/api";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Hint } from "@/components/hint";

export const Route = createFileRoute("/_index/")({
  component: RouteComponent,
});

function RouteComponent() {
  const { data: user } = useQuery(userQueryOptions());
  if (!user) {
    return null;
  }

  const { data: nextWorkout, isLoading: isNextWorkoutLoading } = useQuery({
    queryKey: ["user", "next-workout"],
    queryFn: () => getNextWorkout(user.id),
  });

  const nextWorkoutToday =
    nextWorkout?.data?.scheduledStart?.split("T")[0] ===
    new Date().toISOString().split("T")[0];

  return (
    <main className="px-2 py-4 md:py-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col">
          <h3 className="text-xl md:text-2xl">
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
          <Button>Criar nova programação</Button>
        </div>
      </div>
      <div className="mt-8 grid grid-cols-1 gap-4 lg:grid-cols-2 xl:grid-cols-3">
        <Card className="gap-0 overflow-hidden py-0">
          <CardHeader className="items-center border-b py-4 pb-0">
            <div className="flex items-center gap-x-2">
              <Flag className="size-4" />
              <CardTitle className="text-lg md:text-xl">
                Proximo treino
              </CardTitle>
            </div>
            <CardAction>
              <Hint description="Ver todos os treinos" side="top">
                <Button size="icon" variant="outline" asChild>
                  <Link to="/">
                    <ChevronRight />
                  </Link>
                </Button>
              </Hint>
            </CardAction>
          </CardHeader>
          <CardContent className="py-4">
            {isNextWorkoutLoading ? (
              <WorkoutCard.Loading />
            ) : nextWorkout?.data ? (
              <WorkoutCard
                workout={{
                  ...nextWorkout.data,
                  createdAt: parseISO(nextWorkout.data.createdAt),
                  updatedAt: parseISO(nextWorkout.data.updatedAt),
                }}
              />
            ) : null}
          </CardContent>
        </Card>
        <Card className="gap-0 overflow-hidden py-0 xl:col-span-2">
          <CardHeader className="border-b py-4 pb-0">
            <CardTitle className="text-lg md:text-xl">Resumo semanal</CardTitle>
            <CardAction>
              <Hint description="Ver os treinos da semana" side="top">
                <Button size="icon" variant="outline" asChild>
                  <Link to="/">
                    <ChevronRight />
                  </Link>
                </Button>
              </Hint>
            </CardAction>
          </CardHeader>
          <CardContent className="py-4"></CardContent>
        </Card>
        <Card className="gap-0 overflow-hidden py-0 xl:col-span-2">
          <CardHeader className="border-b py-4 pb-0">
            <CardTitle className="text-lg md:text-xl">
              Volume de treino
            </CardTitle>
          </CardHeader>
          <CardContent className="py-4"></CardContent>
        </Card>
      </div>
    </main>
  );
}
