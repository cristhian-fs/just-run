import { ChartArea } from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  LabelList,
  XAxis,
  YAxis,
} from "recharts";

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

const chartData = [
  { month: "Z1", desktop: 186 },
  { month: "Z2", desktop: 305 },
  { month: "Z3", desktop: 237 },
  { month: "Z4", desktop: 73 },
  { month: "Z5", desktop: 209 },
];
const chartConfig = {
  desktop: {
    label: "Desktop",
    color: "var(--chart-2)",
  },
  label: {
    color: "var(--background)",
  },
} satisfies ChartConfig;

interface Props {
  className?: string;
}

export function WeeklyIntensityCard({ className }: Props) {
  return (
    <Card className={cn("gap-0 overflow-hidden py-0", className)}>
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
      <CardContent className="py-4">
        <ChartContainer config={chartConfig}>
          <BarChart
            accessibilityLayer
            data={chartData}
            layout="vertical"
            margin={{
              right: 16,
            }}
          >
            <CartesianGrid horizontal={false} />
            <YAxis
              dataKey="month"
              type="category"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value.slice(0, 3)}
              hide
            />
            <XAxis dataKey="desktop" type="number" hide />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="line" />}
            />
            <Bar dataKey="desktop" fill="var(--color-desktop)" radius={4}>
              <LabelList
                dataKey="month"
                position="insideLeft"
                offset={8}
                className="fill-(--color-label)"
                fontSize={12}
              />
              <LabelList
                dataKey="desktop"
                position="right"
                offset={8}
                className="fill-foreground"
                fontSize={12}
              />
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
