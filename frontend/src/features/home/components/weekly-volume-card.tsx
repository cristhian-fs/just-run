import { Target, TrendingUp } from "lucide-react";

import { WeeklyVolumeData } from "@/shared/types";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Tracker, TrackerBlockProps } from "@/components/ui/tracker";
import { DashboardCard } from "@/components/dashboard-card";

interface WeeklyVolumeCardProps {
  data: WeeklyVolumeData;
}

const MAX_BARS_LENGTH = 30;

export function WeeklyVolumeCard({ data }: WeeklyVolumeCardProps) {
  const filledBars = Math.round((data.weekProgress / 100) * MAX_BARS_LENGTH);

  const trackerData = Array.from({ length: MAX_BARS_LENGTH }).map((_, i) => ({
    key: i,
    color: i < filledBars ? "bg-primary" : "bg-muted-foreground/10",
  })) as TrackerBlockProps[];

  return (
    <DashboardCard
      title="Volume semanal"
      icon={Target}
      footerVariant={data.progressOverWeek >= 100 ? "success" : "default"}
      footerContent={
        <>
          <div className="flex items-center py-2">
            <TrendingUp className="mr-1 h-3 w-3" />
            <span className="text-sm">
              +{data.progressOverWeek.toFixed(1)}% em relação a última semana
            </span>
          </div>
        </>
      }
    >
      <div className="text-2xl font-bold">
        {data.currentWeekVolume / 1000} km
      </div>
      <div className="text-muted-foreground mt-2 flex items-center space-x-2 text-sm">
        <span>Meta: {data.weekGoalM / 1000} km</span>
        <Badge variant={data.weekProgress >= 100 ? "default" : "secondary"}>
          {data.weekProgress.toFixed(0)}%
        </Badge>
      </div>
      <Tracker data={trackerData} className="mt-3" />
    </DashboardCard>
  );
}

WeeklyVolumeCard.Loading = function WeeklyVolumeLoading() {
  return (
    <DashboardCard
      title="Volume semanal"
      icon={Target}
      footerVariant={"default"}
      footerContent={
        <>
          <div className="flex items-center py-2">
            <TrendingUp className="mr-1 h-3 w-3" />
            <span className="text-sm">Carregando dados...</span>
          </div>
        </>
      }
    >
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
    </DashboardCard>
  );
};
