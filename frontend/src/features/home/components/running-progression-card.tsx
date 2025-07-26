import { format, formatISO } from "date-fns";
import { ChartArea } from "lucide-react";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";

import { VolumeProgression } from "@/shared/types";
import { cn } from "@/lib/utils";
import {
  Card,
  CardAction,
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { DashboardCard } from "@/components/dashboard-card";

const chartConfig = {
  desktop: {
    label: "Desktop",
    color: "var(--chart-1)",
  },
  mobile: {
    label: "Mobile",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig;

type SelectValue = "7 days" | "14 days" | "30 days";

interface Props {
  className?: string;
  data: VolumeProgression[];
  onPeriodChange: (value: SelectValue) => void;
  period: SelectValue;
}

export function RunningProgressionCard({
  className,
  data,
  onPeriodChange,
  period,
}: Props) {
  return (
    <DashboardCard
      title="Progressão de volume"
      description={`Volume de treinos nos ultimos ${period} dias`}
      icon={ChartArea}
      className={className}
      action={
        <>
          <Select defaultValue={period} onValueChange={onPeriodChange}>
            <SelectTrigger className="w-36">
              <SelectValue placeholder="Theme" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7 days">7 dias</SelectItem>
              <SelectItem value="14 days">14 dias</SelectItem>
              <SelectItem value="30 days">30 dias</SelectItem>
            </SelectContent>
          </Select>
        </>
      }
    >
      {data.length > 1 ? (
        <ChartContainer config={chartConfig} className="h-80 w-full">
          <AreaChart
            accessibilityLayer
            data={data}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => format(formatISO(value), "dd/MM")}
            />
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            <defs>
              <linearGradient id="fillDesktop" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-desktop)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-desktop)"
                  stopOpacity={0.1}
                />
              </linearGradient>
              <linearGradient id="fillMobile" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-mobile)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-mobile)"
                  stopOpacity={0.1}
                />
              </linearGradient>
            </defs>
            <Area
              dataKey="volume"
              type="natural"
              fill="url(#fillMobile)"
              fillOpacity={0.4}
              stroke="var(--color-mobile)"
              stackId="a"
            />
            <Area
              dataKey="minutes"
              type="natural"
              fill="url(#fillDesktop)"
              fillOpacity={0.4}
              stroke="var(--color-desktop)"
              stackId="a"
            />
          </AreaChart>
        </ChartContainer>
      ) : (
        <div className="flex h-80 w-full items-center justify-center">
          <p className="text-muted-foreground">
            Sem dados de treinamento suficientes para exibir
          </p>
        </div>
      )}
    </DashboardCard>
  );
}

RunningProgressionCard.Loading = function RunningProgressionLoading({
  className,
}: {
  className?: string;
}) {
  return (
    <Card className={cn("gap-0 overflow-hidden py-0", className)}>
      <CardHeader className="flex flex-col items-start gap-4 border-b py-4 pb-0 sm:grid sm:items-center">
        <div className="flex items-center gap-x-2">
          <div className="bg-background shadow-xs rounded-md border p-3">
            <ChartArea className="text-muted-foreground size-4" />
          </div>
          <div className="grid gap-1">
            <CardTitle>Progressão de volume</CardTitle>
            <CardDescription>
              Volume de treinos nos ultimos 30 dias
            </CardDescription>
          </div>
        </div>
        <CardAction className="self-auto">
          <Skeleton className="h-9 w-36" />
        </CardAction>
      </CardHeader>
      <CardContent className="py-4">
        <Skeleton className="h-80 w-full" />
      </CardContent>
    </Card>
  );
};
