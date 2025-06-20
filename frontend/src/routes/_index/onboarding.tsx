import { createFileRoute } from "@tanstack/react-router";

import { OnboardingForm } from "@/features/onboarding/components/onboarding-form";

import { Separator } from "@/components/ui/separator";

export const Route = createFileRoute("/_index/onboarding")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="mx-auto max-w-3xl p-4 md:p-6 md:pt-10">
      <h3 className="text-xl md:text-2xl">Bem vindo ao JustRun</h3>
      <p className="text-muted-foreground mb-6 mt-2">
        Preencha os campos abaixo para completar o cadastro
      </p>
      <Separator className="my-5" />
      <OnboardingForm />
    </div>
  );
}
