import { ChartArea } from "lucide-react";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";

import { WeeklyIntensityZoneVolume } from "@/shared/types";
import { cn } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { DashboardCard } from "@/components/dashboard-card";

const chartConfig = {
  volume: {
    label: "Volume",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig;

interface Props {
  weeklyIntensityData: WeeklyIntensityZoneVolume[];
  className?: string;
}

export function WeeklyIntensityCard({ weeklyIntensityData, className }: Props) {
  return (
    <DashboardCard
      title="Intensidade semanal"
      description="Distribuição das intensidades dos treinos"
      icon={ChartArea}
      className={className}
    >
      {weeklyIntensityData.length > 0 && (
        <ChartContainer
          config={chartConfig}
          className="[&_.recharts-cartesian-grid]:outline-border h-full w-full [&_.recharts-cartesian-grid]:rounded-t-sm [&_.recharts-cartesian-grid]:outline"
        >
          <BarChart accessibilityLayer data={weeklyIntensityData}>
            <defs>
              <linearGradient id="gradientBar" x1="0" y1="0" x2="0" y2="100%">
                <stop offset="0" stopColor="var(--chart-2)" />
                <stop offset="1" stopColor="var(--chart-3)" />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="zone"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
            />
            <YAxis
              dataKey="volume"
              tickLine={false}
              axisLine={false}
              orientation="right"
              width={52}
              domain={[0, (dataMax) => dataMax * 1.2]}
              tickFormatter={(value) => `${(value / 1000).toFixed(2)}km`}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  indicator="line"
                  valueFormatter={(value) =>
                    `${((value as number) / 1000).toFixed(2)}km`
                  }
                />
              }
              cursor={false}
            />
            <Bar
              dataKey="volume"
              fill="url(#gradientBar)"
              stroke="var(--chart-2)"
              radius={[4, 4, 0, 0]}
              barSize={48}
            />
          </BarChart>
        </ChartContainer>
      )}
      {weeklyIntensityData.length === 0 && (
        <div className="flex h-full w-full items-center justify-center">
          <span className="text-muted-foreground">
            Sem dados suficientes para essa semana
          </span>
        </div>
      )}
    </DashboardCard>
  );
}

WeeklyIntensityCard.Loading = function WeeklyIntensityCardSkeleton() {
  const mocked = Array.from({ length: 5 }).map((_, index) => ({
    volume: Math.floor(Math.random() * 1000),
    zone: `Z${index + 1}`,
  }));
  return (
    <Card className={cn("gap-0 overflow-hidden py-0")}>
      <CardHeader className="items-center gap-0 border-b py-4 pb-0">
        <div className="flex items-center gap-x-2">
          <div className="bg-background shadow-xs rounded-md border p-3">
            <ChartArea className="text-muted-foreground size-4" />
          </div>
          <div className="grid gap-1">
            <CardTitle>Intensidade semanal</CardTitle>
            <CardDescription>
              Distribuição das intensidades dos treinos
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex-1 py-4">
        <ChartContainer
          config={chartConfig}
          className="[&_.recharts-cartesian-grid]:outline-border h-full w-full [&_.recharts-cartesian-grid]:rounded-t-sm [&_.recharts-cartesian-grid]:outline"
        >
          <BarChart accessibilityLayer data={mocked}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="zone"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
            />
            <YAxis
              dataKey="volume"
              tickLine={false}
              axisLine={false}
              orientation="right"
              width={48}
              domain={[0, (dataMax) => dataMax * 2]}
            />
            <ChartTooltip content={<ChartTooltipContent hideLabel />} />
            <Bar
              dataKey="volume"
              fill="var(--border)"
              stroke="var(--chart-2)"
              radius={[4, 4, 0, 0]}
              barSize={48}
              className="animate-pulse"
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};
