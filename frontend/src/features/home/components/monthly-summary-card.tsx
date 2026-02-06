import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { CalendarDays, Clock, MapPin, Target, TrendingUp } from "lucide-react";
import { DashboardCard } from "@/components/dashboard-card";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Tracker } from "@/components/ui/tracker";
import { secondsToPace } from "@/lib/calculations";
import type { MonthSummary } from "@/shared/types";

interface MonthlySummaryCardProps {
	data: MonthSummary;
	className?: string;
}

const MAX_BARS_LENGTH = 30;

export function MonthlySummaryCard({
	data,
	className,
}: MonthlySummaryCardProps) {
	const today = new Date();

	const progressPercentage = (data.totalDistance / data.goalDistance) * 100;
	const filledBars = Math.round((progressPercentage / 100) * MAX_BARS_LENGTH);

	const trackerData = Array.from({ length: MAX_BARS_LENGTH }).map((_, i) => ({
		key: i,
		color: i < filledBars ? "bg-primary" : "bg-muted-foreground/10",
	}));

	const getCongratsText = () => {
		const remainingDistance = data.goalDistance - data.totalDistance;
		const progressPercentage = Math.round(
			(data.totalDistance / data.goalDistance) * 100,
		);

		if (data.totalDistance >= data.goalDistance) {
			const exceededDistance = data.totalDistance - data.goalDistance;
			const exceededKm = exceededDistance / 1000;

			if (exceededKm >= 1) {
				return `Parabéns! Você superou sua meta em ${exceededKm.toFixed(1)}km (${progressPercentage}%)`;
			}
			return `Meta concluída! Parabéns pelo excelente trabalho!`;
		}

		if (data.totalDistance > 0) {
			const remainingKm = remainingDistance / 1000;

			// Mensagens motivacionais baseadas no progresso
			if (progressPercentage >= 90) {
				return `Falta muito pouco! Apenas ${remainingKm.toFixed(1)}km para completar sua meta`;
			}

			if (progressPercentage >= 75) {
				return `Você está quase lá! Faltam ${remainingKm.toFixed(1)}km (${progressPercentage}% concluído)`;
			}

			if (progressPercentage >= 50) {
				return `Bom trabalho! Faltam ${remainingKm.toFixed(1)}km para sua meta`;
			}

			if (progressPercentage >= 25) {
				return `Continue assim! Faltam ${remainingKm.toFixed(1)}km`;
			}

			// Menos de 25%
			if (remainingKm >= 1) {
				return `Você começou! Faltam ${remainingKm.toFixed(1)}km para sua meta`;
			}
			return `Você começou! Faltam ${remainingDistance}m`;
		}

		const goalKm = data.goalDistance / 1000;
		return `Comece seu primeiro treino! Meta: ${goalKm.toFixed(1)}km`;
	};

	return (
		<DashboardCard
			className={className}
			title='Resumo mensal'
			icon={Target}
			description={`Progresso de ${format(today, "MMMM 'de' yyyy", { locale: ptBR })}`}
			footerVariant={progressPercentage > 0 ? "success" : "default"}
			footerContent={
				<>
					{data.totalDistance > 0 && data.goalDistance > 0 && (
						<div className='flex items-center py-2'>
							<TrendingUp className='mr-1 size-4' />
							<span className='text-sm'>{getCongratsText()}</span>
						</div>
					)}
					{data.totalDistance === 0 && data.goalDistance > 0 && (
						<div className='flex items-center py-2'>
							<span className='text-sm'>
								Você ainda nao fez nenhum treino esse mês
							</span>
						</div>
					)}
				</>
			}
		>
			<div className='space-y-4'>
				<div>
					<div className='mb-1 flex justify-between text-sm'>
						<span>Meta de distância</span>
						<span>
							{data.totalDistance / 1000}km / {data.goalDistance / 1000}km
						</span>
					</div>
					<Tracker data={trackerData} className='mt-3' />
				</div>

				<div className='@xs/card:grid-cols-2 @sm/card:grid-cols-3 grid grid-cols-1 gap-4 text-sm'>
					<div className='flex items-center space-x-2'>
						<CalendarDays className='text-muted-foreground h-4 w-4' />
						<div>
							<p className='font-medium'>{data.totalRuns}</p>
							<p className='text-muted-foreground text-xs'>Treinos</p>
						</div>
					</div>

					<div className='flex items-center space-x-2'>
						<Clock className='text-muted-foreground h-4 w-4' />
						<div>
							<p className='font-medium'>{`${Math.floor(data.totalTimeMinutes / 60)}h ${Math.floor(data.totalTimeMinutes % 60)}min`}</p>
							<p className='text-muted-foreground text-xs'>Tempo total</p>
						</div>
					</div>

					<div className='flex items-center space-x-2'>
						<MapPin className='text-muted-foreground h-4 w-4' />
						<div>
							<p className='font-medium'>{secondsToPace(data.avgPaceS)}</p>
							<p className='text-muted-foreground text-xs'>Pace médio</p>
						</div>
					</div>
				</div>
			</div>
		</DashboardCard>
	);
}

MonthlySummaryCard.Loading = function MonthlySummaryLoading() {
	const trackerData = Array.from({ length: MAX_BARS_LENGTH }).map((_, i) => ({
		key: i,
		color: "bg-muted-foreground/10 animate-pulse",
	}));

	return (
		<Card className='gap-0 overflow-hidden py-0'>
			<CardHeader className='grid-rows-1 items-center border-b py-4 pb-0'>
				<div className='flex items-center gap-x-2'>
					<div className='bg-background shadow-xs rounded-md border p-3'>
						<Target className='text-muted-foreground size-4' />
					</div>
					<div className='grid gap-1'>
						<CardTitle>Resumo mensal</CardTitle>
						<CardDescription>
							Progresso de{" "}
							{format(new Date(), "MMMM 'de' yyyy", { locale: ptBR })}
						</CardDescription>
					</div>
				</div>
			</CardHeader>
			<CardContent className='space-y-4 py-4'>
				<div>
					<div className='mb-1 flex justify-between text-sm'>
						<span>Meta de distância</span>
						<Skeleton className='h-4 w-32' />
					</div>
					<Tracker data={trackerData} className='mt-3' />
				</div>

				<div className='grid grid-cols-3 gap-4 text-sm'>
					<div className='flex items-center space-x-2'>
						<CalendarDays className='text-muted-foreground h-4 w-4' />
						<div>
							<Skeleton className='h-4 w-full' />
							<p className='text-muted-foreground text-xs'>Treinos</p>
						</div>
					</div>

					<div className='flex items-center space-x-2'>
						<Clock className='text-muted-foreground h-4 w-4' />
						<div>
							<Skeleton className='h-4 w-full' />
							<p className='text-muted-foreground text-xs'>Tempo total</p>
						</div>
					</div>

					<div className='flex items-center space-x-2'>
						<MapPin className='text-muted-foreground h-4 w-4' />
						<div>
							<Skeleton className='h-4 w-full' />
							<p className='text-muted-foreground text-xs'>Pace médio</p>
						</div>
					</div>
				</div>
			</CardContent>
		</Card>
	);
};
