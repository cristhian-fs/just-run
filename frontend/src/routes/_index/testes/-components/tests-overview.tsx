import { Activity, Heart, Timer, TrendingUp } from "lucide-react";

import { Test } from "@/shared/types";
import { secondsToPace } from "@/lib/calculations";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { DashboardCard } from "@/components/dashboard-card";

interface TestsOverviewProps {
  tests: Test[];
  className?: string;
}

export function TestsOverview({ tests, className }: TestsOverviewProps) {
  const latestTest = tests.sort(
    (a, b) => new Date(b.testDate).getTime() - new Date(a.testDate).getTime(),
  )[0];
  const bestVO2Max = Math.max(
    ...tests.filter((t) => t.vo2Max).map((t) => t.vo2Max!),
  );
  const averagePace =
    tests.filter((t) => t.paceMinKm).length > 0
      ? tests
          .filter((t) => t.paceMinKm)
          .reduce((acc, test) => {
            const [min, sec] = test.paceMinKm!.split(":").map(Number);
            return acc + (min * 60 + sec);
          }, 0) / tests.filter((t) => t.paceMinKm).length
      : 0;

  const totalDistance = tests.reduce((acc, test) => acc + test.distanceM, 0);

  return (
    <div className={cn("grid gap-4 md:grid-cols-2 lg:grid-cols-4", className)}>
      <DashboardCard title="Ultimo teste realizado" icon={Timer}>
        <div className="text-2xl font-bold">
          {latestTest?.testType || "N/A"}
        </div>
        <p className="text-muted-foreground text-xs">
          {latestTest
            ? new Date(latestTest.testDate).toLocaleDateString()
            : "No tests"}
        </p>
        {latestTest?.paceMinKm && (
          <Badge variant="outline" className="mt-2">
            {latestTest.paceMinKm}/km
          </Badge>
        )}
      </DashboardCard>
      <DashboardCard title="Melhor VO2 máximo" icon={TrendingUp}>
        <div className="text-2xl font-bold">{bestVO2Max.toFixed(1)}</div>
        <p className="text-muted-foreground text-xs">ml/kg/min</p>
      </DashboardCard>
      <DashboardCard title="Média de velocidade" icon={Activity}>
        <div className="text-2xl font-bold">{secondsToPace(averagePace)}</div>
        <p className="text-muted-foreground text-xs">Minutos por km</p>
      </DashboardCard>
      <DashboardCard title="Distância total" icon={Heart}>
        <div className="text-2xl font-bold">
          {(totalDistance / 1000).toFixed(1)}km
        </div>
        <p className="text-muted-foreground text-xs">
          Durante {tests.length} testes
        </p>
      </DashboardCard>
    </div>
  );
}

TestsOverview.Loading = function TestsOverviewLoading({
  className,
}: {
  className?: string;
}) {
  return (
    <div className={cn("grid gap-4 md:grid-cols-2 lg:grid-cols-4", className)}>
      <DashboardCard title="Ultimo teste realizado" icon={Timer}>
        <div className="text-2xl font-bold">
          <Skeleton className="h-5 w-24" />
        </div>
        <p className="text-muted-foreground text-xs">
          <Skeleton className="h-5 w-24" />
        </p>
        <Skeleton className="h-5 w-24" />
      </DashboardCard>
      <DashboardCard title="Melhor VO2 máximo" icon={TrendingUp}>
        <Skeleton className="h-4 w-16" />
        <p className="text-muted-foreground text-xs">ml/kg/min</p>
      </DashboardCard>
      <DashboardCard title="Média de velocidade" icon={Activity}>
        <Skeleton className="h-4 w-16" />
        <p className="text-muted-foreground text-xs">ml/kg/min</p>
      </DashboardCard>
      <DashboardCard title="Distância total" icon={Heart}>
        <div className="text-2xl font-bold">
          <Skeleton className="h-4 w-16" />
        </div>
        <Skeleton className="h-4 w-16" />
      </DashboardCard>
    </div>
  );
};
