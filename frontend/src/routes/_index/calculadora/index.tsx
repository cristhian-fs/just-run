import { createFileRoute } from "@tanstack/react-router";

import { VDOTTabContent } from "./-components/vdot-tab-content";

export const Route = createFileRoute("/_index/calculadora/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="py-4 md:py-8">
      <div className="px-3 md:px-6">
        <h3 className="text-xl md:text-2xl">Calculadora</h3>
        <p className="text-muted-foreground text-base">
          Otimize seus treinos de corrida com a nossa calculadora de VDOT
        </p>
      </div>
      <div className="mt-4 p-3 md:p-6">
        <VDOTTabContent />
      </div>
    </div>
  );
}
