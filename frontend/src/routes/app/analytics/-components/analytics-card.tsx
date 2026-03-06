import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { formatDistance, formatDuration, secondsToPace } from "@/lib/calculations"
import { formatDateRange } from "@/lib/utils"
import { WorkoutAnalytics } from "@/shared/types"
import { Activity, TrendingUp, Calendar, Target } from "lucide-react"

interface AnalyticsCardProps {
  data: WorkoutAnalytics
  onClick: () => void
}

export function AnalyticsCard({ data, onClick }: AnalyticsCardProps) {

  const { progressMetrics, summary, metadata } = data.analyticsData

  return (
    <Card
      className="cursor-pointer transition-all hover:shadow-lg hover:scale-[1.01] active:scale-[0.99]"
      onClick={onClick}
    >
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-xl">{metadata.planName}</CardTitle>
            <CardDescription className="flex items-center gap-1.5 mt-1">
              <Calendar className="h-3.5 w-3.5" />
              {formatDateRange(summary.dateRange.startDate, summary.dateRange.endDate)}
            </CardDescription>
          </div>
          <div className="flex items-center gap-1 text-accent text-sm font-medium">
            <TrendingUp className="h-4 w-4" />
            {progressMetrics.improvementTrends.paceImprovement > 0 ? "+" : ""}
            {progressMetrics.improvementTrends.paceImprovement.toFixed(1)}%
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-muted-foreground text-sm">
              <Activity className="h-4 w-4" />
              <span>Treinos</span>
            </div>
            <p className="text-2xl font-bold">{summary.totalWorkouts}</p>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2 text-muted-foreground text-sm">
              <Target className="h-4 w-4" />
              <span>Distancia</span>
            </div>
            <p className="text-2xl font-bold">{formatDistance(summary.totalDistanceM)}</p>
          </div>

          <div className="space-y-1">
            <p className="text-muted-foreground text-sm">Pace medio</p>
            <p className="text-lg font-semibold">{secondsToPace(summary.avgPaceOverall)}</p>
          </div>

          <div className="space-y-1">
            <p className="text-muted-foreground text-sm">Tempo total</p>
            <p className="text-lg font-semibold">{formatDuration(summary.totalDurationS)}</p>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t flex items-center justify-between text-sm">
          <div className="flex items-center gap-4">
            <div>
              <span className="text-muted-foreground">Consistencia</span>
              <span className="ml-2 font-medium">{progressMetrics.improvementTrends.consistencyScore.toFixed(2)}%</span>
            </div>
            <div>
              <span className="text-muted-foreground">Conclusão</span>
              <span className="ml-2 font-medium">{progressMetrics.improvementTrends.completionRate.toFixed(2)}%</span>
            </div>
          </div>
          <span className="text-primary font-medium">Ver detalhes</span>
        </div>
      </CardContent>
    </Card>
  )
}
