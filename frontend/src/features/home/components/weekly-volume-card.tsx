import { Target, TrendingUp } from "lucide-react";

import { WeeklyVolumeData } from "@/shared/types";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";

interface WeeklyVolumeCardProps {
  data: WeeklyVolumeData;
}

export function WeeklyVolumeCard({ data }: WeeklyVolumeCardProps) {
  return (
    <Card className="gap-0 overflow-hidden py-0">
      <CardHeader className="grid-rows-1 items-center gap-0 border-b py-4 pb-0">
        <div className="flex items-center gap-x-2">
          <div className="bg-background shadow-xs rounded-md border p-3">
            <Target className="text-muted-foreground size-4" />
          </div>
          <CardTitle>Volume semanal</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="py-4">
        <div className="text-2xl font-bold">
          {data.currentWeekVolume / 1000} km
        </div>
        <div className="text-muted-foreground flex items-center space-x-2 text-xs">
          <span>Meta: {data.weekGoalM / 1000} km</span>
          <Badge variant={data.weekProgress >= 100 ? "default" : "secondary"}>
            {data.weekProgress.toFixed(0)}%
          </Badge>
        </div>
        <div className="flex items-center pt-1">
          <TrendingUp className="mr-1 h-3 w-3 text-green-500" />
          <span className="text-xs text-green-500">
            +{data.progressOverWeek.toFixed(1)}% em relação a última semana
          </span>
        </div>
        <Progress value={data.progressOverWeek} className="mt-2" />
      </CardContent>
    </Card>
  );
}

WeeklyVolumeCard.Loading = function WeeklyVolumeLoading() {
  return (
    <Card className="gap-0 overflow-hidden py-0">
      <CardHeader className="grid-rows-1 items-center gap-0 border-b py-4 pb-0">
        <div className="flex items-center gap-x-2">
          <div className="bg-background shadow-xs rounded-md border p-3">
            <Target className="text-muted-foreground size-4" />
          </div>
          <CardTitle>Volume semanal</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="py-4">
        <Skeleton className="h-5 w-full" />
        <div className="text-muted-foreground flex items-center space-x-2 text-xs">
          <Skeleton className="h-4 w-28" />
          <Skeleton className="h-4 w-12" />
        </div>
        <div className="flex items-center pt-1">
          <TrendingUp className="mr-1 h-3 w-3 text-green-500" />
          <Skeleton className="h-4 w-28" />
        </div>
        <Skeleton className="h-2 w-full rounded-full" />
      </CardContent>
    </Card>
  );
};
