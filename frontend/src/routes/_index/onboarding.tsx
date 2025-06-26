import { createFileRoute } from "@tanstack/react-router";
import { queryOptions, useQuery } from "@tanstack/react-query";

import { OnboardingProfileCard } from "@/features/onboarding/components/onboarding-profile-card";
import { ChevronRight } from "lucide-react";

import { getUserLastTest, userQueryOptions } from "@/lib/api";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Hint } from "@/components/hint";

export const Route = createFileRoute("/_index/onboarding")({
  component: RouteComponent,
});

const testQueryOptions = () =>
  queryOptions({
    queryKey: ["test"],
    queryFn: async () => getUserLastTest(),
  });

function RouteComponent() {
  const { data: user } = useQuery(userQueryOptions());

  const { data: lastTest } = useQuery(testQueryOptions());

  if (!user) {
    return null;
  }

  return (
    <div className="p-4 md:p-6">
      <h3 className="text-xl md:text-2xl">Bem vindo ao JustRun</h3>
      <p className="text-muted-foreground mb-6 mt-2">
        Você está a alguns passos de concluir o seu cadastro.
      </p>
      <div className="grid grid-cols-1 gap-4 md:gap-6 lg:grid-cols-2">
        <OnboardingProfileCard
          user={user}
          userTest={lastTest?.data ?? undefined}
          className="col-span-full"
        />
        <Card>
          <CardHeader className="gap-0">
            <CardTitle>Crie sua primeira periodização de treinos</CardTitle>
            <CardDescription className="mt-2">
              Deixe que nós montamos toda sua programação de treinos
            </CardDescription>
            {lastTest?.data && user?.hasCompleteOnboarding ? (
              <Button variant="secondary" className="mt-3 w-fit">
                Criar programação de treinos
                <ChevronRight className="size-4" />
              </Button>
            ) : (
              <Hint description="Conclua os passos inicias para criar uma programação de treinos">
                <Button variant="secondary" className="mt-3 w-fit" disabled>
                  Criar programação de treinos
                  <ChevronRight className="size-4" />
                </Button>
              </Hint>
            )}
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="gap-0">
            <CardTitle>Adicione seu próprio treino personalizado</CardTitle>
            <CardDescription className="mt-2">
              Você também pode criar seus próprios treinos!
            </CardDescription>
            {lastTest?.data && user?.hasCompleteOnboarding ? (
              <Button variant="secondary" className="mt-3 w-fit">
                Criar treino
                <ChevronRight className="size-4" />
              </Button>
            ) : (
              <Hint description="Conclua os passos inicias para criar uma programação de treinos">
                <Button variant="secondary" className="mt-3 w-fit" disabled>
                  Criar treino
                  <ChevronRight className="size-4" />
                </Button>
              </Hint>
            )}
          </CardHeader>
        </Card>
      </div>
    </div>
  );
}
