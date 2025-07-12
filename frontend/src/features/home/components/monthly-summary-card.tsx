import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { CalendarDays, Clock, MapPin, Target } from "lucide-react";

import { MonthSummary } from "@/shared/types";
import { secondsToPace } from "@/lib/calculations";
import { cn } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";

interface MonthlySummaryCardProps {
  data: MonthSummary;
  className?: string;
}

export function MonthlySummaryCard({
  data,
  className,
}: MonthlySummaryCardProps) {
  const progressPercentage = (data.totalDistance / data.goalDistance) * 100;
  const today = new Date();

  return (
    <Card className={cn("gap-0 overflow-hidden py-0", className)}>
      <CardHeader className="grid-rows-1 items-center border-b py-4 pb-0">
        <div className="flex items-center gap-x-2">
          <div className="bg-background shadow-xs rounded-md border p-3">
            <Target className="text-muted-foreground size-4" />
          </div>
          <div className="grid gap-1">
            <CardTitle>Resumo mensal</CardTitle>
            <CardDescription>
              Progresso de {format(today, "MMMM 'de' yyyy", { locale: ptBR })}
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4 py-4">
        <div>
          <div className="mb-1 flex justify-between text-sm">
            <span>Meta de distância</span>
            <span>
              {data.totalDistance / 1000}km / {data.goalDistance / 1000}km
            </span>
          </div>
          <Progress value={progressPercentage} className="h-2" />
        </div>

        <div className="grid grid-cols-3 gap-4 text-sm">
          <div className="flex items-center space-x-2">
            <CalendarDays className="text-muted-foreground h-4 w-4" />
            <div>
              <p className="font-medium">{data.totalRuns}</p>
              <p className="text-muted-foreground text-xs">Treinos</p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Clock className="text-muted-foreground h-4 w-4" />
            <div>
              <p className="font-medium">{`${Math.floor(data.totalTimeMinutes / 60)}h ${Math.floor(data.totalTimeMinutes % 60)}min`}</p>
              <p className="text-muted-foreground text-xs">Tempo total</p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <MapPin className="text-muted-foreground h-4 w-4" />
            <div>
              <p className="font-medium">{secondsToPace(data.avgPaceS)}</p>
              <p className="text-muted-foreground text-xs">Pace médio</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

MonthlySummaryCard.Loading = function MonthlySummaryLoading() {
  return (
    <Card className="gap-0 overflow-hidden py-0">
      <CardHeader className="grid-rows-1 items-center border-b py-4 pb-0">
        <div className="flex items-center gap-x-2">
          <div className="bg-background shadow-xs rounded-md border p-3">
            <Target className="text-muted-foreground size-4" />
          </div>
          <div className="grid gap-1">
            <CardTitle>Resumo mensal</CardTitle>
            <CardDescription>
              Progresso de{" "}
              {format(new Date(), "MMMM 'de' yyyy", { locale: ptBR })}
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4 py-4">
        <div>
          <div className="mb-1 flex justify-between text-sm">
            <span>Meta de distância</span>
            <Skeleton className="h-4 w-32" />
          </div>
          <Progress value={0} className="h-2" />
        </div>

        <div className="grid grid-cols-3 gap-4 text-sm">
          <div className="flex items-center space-x-2">
            <CalendarDays className="text-muted-foreground h-4 w-4" />
            <div>
              <Skeleton className="h-4 w-full" />
              <p className="text-muted-foreground text-xs">Treinos</p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Clock className="text-muted-foreground h-4 w-4" />
            <div>
              <Skeleton className="h-4 w-full" />
              <p className="text-muted-foreground text-xs">Tempo total</p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <MapPin className="text-muted-foreground h-4 w-4" />
            <div>
              <Skeleton className="h-4 w-full" />
              <p className="text-muted-foreground text-xs">Pace médio</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
