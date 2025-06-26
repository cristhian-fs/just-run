import { Link } from "@tanstack/react-router";

import { ChevronRight } from "lucide-react";

import { Test } from "@/shared/types";
import { Session } from "@/lib/auth-client";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

export const OnboardingProfileCard = ({
  user,
  className,
  userTest,
}: {
  user?: Session["user"];
  className?: string;
  userTest: Test | undefined;
}) => {
  const PROFILE_CHECKS = [
    {
      id: "full_name",
      label: "Adicionar nome completo",
      description: "Mostrado em treinos, zonas de treinamento, etc.",
      checked: !!user?.name,
    },
    {
      id: "height_weight",
      label: "Informações adicionais de perfil",
      description:
        "Usaremos essas informações para criar seus treinos, zonas de intensidade, etc.",
      checked: !!user?.heightCm && !!user?.weightKg,
    },
    {
      id: "test",
      label: "Cadastre seu primeiro teste de corrida",
      description:
        "Esse teste é necessário para que sejam criadas suas zonas de treinamento.",
      checked: !!userTest,
    },
  ];

  const completedSteps = PROFILE_CHECKS.filter((step) => step.checked).length;
  const currentPercentageProgress = new Intl.NumberFormat("en-US", {
    style: "percent",
    maximumFractionDigits: 2,
  }).format(completedSteps / PROFILE_CHECKS.length);

  return (
    <Card
      className={cn(
        "divide-border grid grid-cols-1 gap-0 divide-y p-0 md:divide-x lg:grid-cols-2 lg:divide-y-0",
        className,
      )}
    >
      <CardHeader className="flex p-4 md:p-8">
        <div>
          <span className="text-4xl font-semibold tracking-tight md:text-6xl">
            {currentPercentageProgress}
          </span>
          <CardTitle className="mt-3">Vamos configurar seu perfil</CardTitle>
          <CardDescription className="mt-2">
            Nos ajude a conhecer melhor você
          </CardDescription>
          <Button variant="secondary" className="mt-3 w-fit" asChild>
            <Link to="/settings">
              Completar perfil
              <ChevronRight />
            </Link>
          </Button>
        </div>
      </CardHeader>
      <div className="flex items-center justify-start p-4 md:p-8">
        <ul className="space-y-4">
          {PROFILE_CHECKS.map((check) => (
            <div key={check.id} className="flex items-center gap-3">
              <Checkbox id={check.id} checked={check.checked} />
              <div className="flex flex-col gap-y-2">
                <Label htmlFor={check.id} className="md:text-lg">
                  {check.label}
                </Label>
                <span className="text-muted-foreground text-sm md:text-base">
                  {check.description}
                </span>
              </div>
            </div>
          ))}
        </ul>
      </div>
    </Card>
  );
};
