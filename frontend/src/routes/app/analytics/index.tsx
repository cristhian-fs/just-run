import LoadingScreen from '@/components/loading-screen'
import { getUserPlanAnalytics } from '@/features/trainings/api/get-user-analytics'
import { useQuery } from '@tanstack/react-query'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { AnalyticsCard } from './-components/analytics-card'

export const Route = createFileRoute('/app/analytics/')({
  component: RouteComponent,
})

function RouteComponent() {

  const { data: planAnalytics, isLoading } = useQuery({
    queryKey: ['plan-analytics'],
    queryFn: () => getUserPlanAnalytics(),
  })

  const navigate = useNavigate()

  if (isLoading) {
    return <LoadingScreen />
  }

  const onClickAnalyticsCard = (id: string) => {
    navigate({ to: '/app/analytics/$analyticsId', params: { analyticsId: id } })
  }
  return (
    <div className='py-4 md:py-8'>
      <div className='px-3 md:px-6'>
        <h3 className='text-xl md:text-2xl font-semibold'>Analytics</h3>
        <p className='text-muted-foreground text-base'>
          Veja a analise de todos os seus planos ja concluidos
        </p>
      </div>
      <div className='mt-4 p-3 md:p-6 space-y-4'>
        {planAnalytics && planAnalytics.length === 0 && (
          <div className='bg-muted border rounded-md p-4 flex flex-col items-center justify-center gap-2'>
            <h4 className='text-md sm:text-xl font-medium'>Voce ainda nao concluiu nenhum plano de corrida</h4>
            <p className='text-muted-foreground text-base'>
              As analises de seus planos concluidos aparecerao aqui assim que voce finalizar algum plano
            </p>
          </div>
        )}
        {planAnalytics?.map((planAnalytic) => (
          <AnalyticsCard
            data={planAnalytic}
            onClick={() => onClickAnalyticsCard(planAnalytic.id)}
          />
        ))}
      </div>
    </div>
  )
}
