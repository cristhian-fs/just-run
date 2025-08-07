import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";

import { getTrainingZones } from "@/features/trainings/api/get-training-zones";
import { Columns } from "@/features/trainings/components/zones/columns";
import { DataTable } from "@/features/trainings/components/zones/data-table";
import { parseISO } from "date-fns";

import { userQueryOptions } from "@/lib/api";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/app/zonas-de-treino")({
  component: RouteComponent,
});

function RouteComponent() {
  const { data: user } = useQuery(userQueryOptions());
  if (!user) {
    return null;
  }

  const { data: trainingZones, isLoading: isLoadingTraningZones } = useQuery({
    queryKey: ["training-zones"],
    queryFn: () => getTrainingZones(),
  });

  const formattedTrainingZones = trainingZones?.data.map((zone) => ({
    ...zone,
    createdAt: parseISO(zone.createdAt),
  }));

  return (
    <main className="px-4 py-4 md:py-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col">
          <h3 className="text-xl font-medium md:text-2xl">
            Suas zonas de treino
          </h3>
          <p className="text-muted-foreground text-base">
            Aqui é onde você pode ver suas zonas de treino, e quais as
            velocidades para cada tipo de treino.
          </p>
        </div>
        <div className="flex gap-x-2">
          <Button>Adicionar novo teste</Button>
        </div>
      </div>
      <div className="mt-6">
        {isLoadingTraningZones && <DataTable.Loading length={Columns.length} />}
        {trainingZones?.data && (
          <DataTable columns={Columns} data={formattedTrainingZones || []} />
        )}
      </div>
    </main>
  );
}
