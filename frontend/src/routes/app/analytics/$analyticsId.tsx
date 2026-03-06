import { DashboardCard } from '@/components/dashboard-card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { getUserAnalyticsById } from '@/features/trainings/api/get-user-analytics-by-id'
import { formatDistance, formatDuration, secondsToPace } from '@/lib/calculations';
import { RUN_TYPE_MAPPING } from '@/lib/consts';
import { formatDateRange } from '@/lib/utils';
import { TTrainingType } from '@/shared/types';
import { createFileRoute, Link } from '@tanstack/react-router'
import { Activity, Award, ChevronLeft, Mountain, Target, TrendingUp, Zap } from 'lucide-react';
import { useState } from 'react';
import { Bar, BarChart, CartesianGrid, Cell, Line, LineChart, XAxis, YAxis } from 'recharts';


const runTypeChartConfig = {
  count: {
    label: "Treinos",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig;

const workoutTrendChartConfig = {
  pace: {
    label: "Pace",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig;

export const Route = createFileRoute('/app/analytics/$analyticsId')({
  component: RouteComponent,
  loader: ({ params: { analyticsId } }) => getUserAnalyticsById(analyticsId),
})

function RouteComponent() {
  const analyticsData = Route.useLoaderData();

  const { summary, runTypeBreakdown, progressMetrics, workouts } = analyticsData.analyticsData

  // Prepare chart data for run type breakdown
  const runTypeChartData = Object.entries(runTypeBreakdown).map(([type, stats]) => ({
    type: type.charAt(0).toUpperCase() + type.slice(1),
    count: stats.count,
    distance: (stats.totalDistanceM / 1000).toFixed(1),
    avgPace: stats.avgPace,
  }))

  // Prepare workout trend data
  const workoutTrendData = workouts.map((workout) => ({
    date: new Date(workout.scheduledStart).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
    pace: workout.actual.avgPaceSPerKm || 0,
    hr: workout.actual.avgHr,
  }));

  const paceValues = workoutTrendData.map((d) => d.pace);
  const minPace = Math.min(...paceValues); // best pace (ex: 230s)
  const maxPace = Math.max(...paceValues); // worst pace (ex: 360s)

  // A little bit of margin (optional)
  const lowerLimit = Math.floor(maxPace + 10); // lower part of the graph
  const upperLimit = Math.ceil(minPace - 10);


  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  return (
    <div className='py-4 md:py-8'>

      <div className='px-3 md:px-6'>
        <Button asChild variant='link' className='-mx-4 mb-4'>
          <Link to='/app/analytics'>
            <ChevronLeft />
            Voltar para o analytics
          </Link>
        </Button>
        <div className='flex flex-col gap-2 sm:flex-row sm:justify-between'>
          <h3 className='text-xl md:text-2xl font-semibold'>{analyticsData.analyticsData.metadata.planName}</h3>
          <Badge>
            {formatDateRange(summary.dateRange.startDate, summary.dateRange.endDate)}
          </Badge>
        </div>
      </div>
      <div className='mt-4 p-3 md:p-6 space-y-4'>
        {/* Summary Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <DashboardCard
            title='Total de treinos'
            icon={Activity}
          >
            <p className="text-3xl font-bold">{summary.totalWorkouts}</p>
          </DashboardCard>
          <DashboardCard
            title="Distância total"
            icon={Target}
          >
            <p className="text-3xl font-bold">{formatDistance(summary.totalDistanceM)}</p>
          </DashboardCard>
          <DashboardCard
            title='Pace médio'
            icon={Zap}
          >
            <p className="text-2xl font-bold">{secondsToPace(summary.avgPaceOverall)}</p>
          </DashboardCard>
          <DashboardCard
            title='Média de batimentos cardíacos'
            icon={Zap}
          >
            <p className="text-3xl font-bold">
              {summary.avgHrOverall} <span className="text-lg text-muted-foreground">bpm</span>
            </p>
          </DashboardCard>
        </div>

        {/* Progress Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <DashboardCard
            title='Métricas de progresso'
            icon={TrendingUp}
          >
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Melhoria de pace</span>
              <span className="text-lg font-bold">
                {progressMetrics.improvementTrends.paceImprovement > 0 ? "+" : ""}
                {progressMetrics.improvementTrends.paceImprovement.toFixed(1)}%
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Pontuação de consistência</span>
              <span className="text-lg font-bold">{progressMetrics.improvementTrends.consistencyScore.toFixed(2)}%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Conclusão</span>
              <span className="text-lg font-bold">{progressMetrics.improvementTrends.completionRate.toFixed(2)}%</span>
            </div>
          </DashboardCard>

          {/* Personal Bests */}
          <DashboardCard
            title='Recordes pessoais'
            icon={Award}
          >
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Melhor pace</span>
              <span className="font-semibold">{secondsToPace(progressMetrics.personalBests.fastestPace)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Maior distância</span>
              <span className="font-semibold">{formatDistance(progressMetrics.personalBests.longestDistance)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Maior duração</span>
              <span className="font-semibold">{formatDuration(progressMetrics.personalBests.longestDuration)}</span>
            </div>
          </DashboardCard>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Run Type Breakdown Chart */}
          {runTypeChartData.length > 0 && (
            <DashboardCard
              title='Discriminação por tipo de corrida'
              icon={Award}
            >
              <ChartContainer config={runTypeChartConfig}>
                <BarChart
                  accessibilityLayer
                  data={runTypeChartData}
                  onMouseLeave={() => setActiveIndex(null)}
                  margin={{
                    bottom: 0,
                    top: 0,
                    left: 0,
                    right: 0
                  }}
                >
                  <CartesianGrid
                    className='stroke-border'
                    vertical={false}
                    horizontal={true}
                  />
                  <XAxis
                    dataKey="type"
                    tickLine={false}
                    tickMargin={10}
                    axisLine={false}
                    tickFormatter={(value) => RUN_TYPE_MAPPING[value as TTrainingType]}
                  />
                  <ChartTooltip
                    cursor={false}
                    content={<ChartTooltipContent hideLabel />}
                  />
                  <Bar dataKey="count" radius={4} fill="var(--chart-1)">
                    {runTypeChartData.map((_, index) => (
                      <Cell
                        className="duration-200"
                        key={`cell-${index}`}
                        fillOpacity={
                          activeIndex === null ? 1 : activeIndex === index ? 1 : 0.3
                        }
                        stroke={activeIndex === index ? "var(--chart-1)" : ""}
                        onMouseEnter={() => setActiveIndex(index)}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ChartContainer>
            </DashboardCard>
          )}

          {/* Workout Trends */}
          {workoutTrendData.length > 0 && (
            <DashboardCard
              title='Tendências recentes em exercícios físicos'
              icon={Award}
            >
              <ChartContainer
                config={workoutTrendChartConfig}
              >
                <LineChart data={workoutTrendData}
                  margin={{
                    bottom: 0,
                    right: 0,
                    top: 0,
                    left: 0
                  }}>
                  <CartesianGrid
                    className='stroke-border'
                    vertical={false}
                    horizontal={true}
                  />
                  <XAxis dataKey="date" className="text-xs"
                  />
                  <YAxis
                    reversed
                    domain={[upperLimit, lowerLimit]}
                    tickFormatter={(value) => secondsToPace(value)}
                    className="text-xs"
                  />
                  <ChartTooltip
                    content={<ChartTooltipContent valueFormatter={(value) => secondsToPace(value)} />}
                  />
                  <Line
                    type="monotone"
                    dataKey="pace"
                    stroke="var(--color-pace)"
                    strokeWidth={2}
                    dot={{ fill: "var(--color-pace)", r: 4 }}
                  />
                </LineChart>
              </ChartContainer>
            </DashboardCard>
          )}
        </div>
        {/* Additional Stats */}
        <DashboardCard
          title='Estatísticas adicionais'
          icon={Mountain}
        >
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Total de ganhos de elevação</span>
            <span className="font-semibold">{summary.totalElevationGainM.toFixed(0)} m</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Duração total</span>
            <span className="font-semibold">{formatDuration(summary.totalDurationS)}</span>
          </div>
        </DashboardCard>
      </div>
    </div>
  );
}
