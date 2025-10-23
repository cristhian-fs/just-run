import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { ChartColumn, Logs } from "lucide-react";
import { DashboardCard } from "@/components/dashboard-card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { secondsToPace } from "@/lib/calculations";
import type { Test } from "@/shared/types";

interface TestsStatsProps {
	tests: Test[];
}

export function TestStats({ tests }: TestsStatsProps) {
	// Calculate various statistics
	const totalTests = tests.length;
	const testTypes = [...new Set(tests.map((test) => test.testType))];

	// Best Performance
	const bestVO2Max = Math.max(
		...tests.filter((t) => t.vo2Max).map((t) => t.vo2Max!),
	);
	const bestVAM = Math.max(...tests.filter((t) => t.vam).map((t) => t.vam!));

	// Average values
	const avgVO2Max =
		tests.filter((t) => t.vo2Max).reduce((acc, t) => acc + t.vo2Max!, 0) /
		tests.filter((t) => t.vo2Max).length;

	const avgVAM =
		tests.filter((t) => t.vam).reduce((acc, t) => acc + t.vam!, 0) /
		tests.filter((t) => t.vam).length;
	const avgFCMax =
		tests.filter((t) => t.fcmax).reduce((acc, t) => acc + t.fcmax!, 0) /
		tests.filter((t) => t.fcmax).length;

	// Progress calculation (comparing first and last test)
	const sortedTests = tests.sort(
		(a, b) => new Date(a.testDate).getTime() - new Date(b.testDate).getTime(),
	);
	const firstTest = sortedTests[0];
	const lastTest = sortedTests[sortedTests.length - 1];

	const vo2MaxImprovement =
		firstTest?.vo2Max && lastTest?.vo2Max
			? ((lastTest.vo2Max - firstTest.vo2Max) / firstTest.vo2Max) * 100
			: 0;

	const vamImprovement =
		firstTest?.vam && lastTest?.vam
			? ((lastTest.vam - firstTest.vam) / firstTest.vam) * 100
			: 0;

	// Test frequency by month
	const testsByMonth = tests.reduce(
		(acc, test) => {
			const month = format(new Date(test.testDate), "LLLL', 'yyyy", {
				locale: ptBR,
			});
			acc[month] = acc[month] ? [...acc[month], test] : [test];
			return acc;
		},
		{} as Record<string, Test[]>,
	);

	const getTestTypeBadgeColor = (testType: string) => {
		const colors = {
			"1600m": "bg-blue-100 text-blue-800 border-blue-200",
			"2400m": "bg-green-100 text-green-800 border-green-200",
			"3200m": "bg-yellow-100 text-yellow-800 border-yellow-200",
			"3000m": "bg-purple-100 text-purple-800 border-purple-200",
			"5000m": "bg-red-100 text-red-800 border-red-200",
		};
		return (
			colors[testType as keyof typeof colors] ||
			"bg-gray-100 text-gray-800 border-gray-200"
		);
	};

	return (
		<div className='space-y-6'>
			<div className='grid gap-4 md:grid-cols-3'>
				<DashboardCard
					title='Resumo da performance'
					icon={ChartColumn}
					contentClassName='space-y-4'
				>
					<div className='flex items-center justify-between'>
						<span className='text-muted-foreground text-sm'>
							Melhor VO2 máximo
						</span>
						<Badge variant='secondary'>{bestVO2Max.toFixed(1)} ml/kg/min</Badge>
					</div>
					<div className='flex items-center justify-between'>
						<span className='text-muted-foreground text-sm'>Melhor VAM</span>
						<Badge variant='secondary'>{bestVAM.toFixed(1)} km/h</Badge>
					</div>
					<div className='flex items-center justify-between'>
						<span className='text-muted-foreground text-sm'>
							Vo2 máximo médio
						</span>
						<span className='text-sm font-medium'>{avgVO2Max.toFixed(1)}</span>
					</div>
					<div className='flex items-center justify-between'>
						<span className='text-muted-foreground text-sm'>VAM medio</span>
						<span className='text-sm font-medium'>{avgVAM.toFixed(1)}</span>
					</div>
					<div className='flex items-center justify-between'>
						<span className='text-muted-foreground text-sm'>
							FC máximo medio
						</span>
						<span className='text-sm font-medium'>
							{avgFCMax.toFixed(0)} bpm
						</span>
					</div>
				</DashboardCard>
				<DashboardCard
					title='Indicadores de progresso'
					icon={ChartColumn}
					contentClassName='space-y-4'
				>
					<div className='space-y-2'>
						<div className='flex justify-between text-sm'>
							<span>Melhoria no VO2 máximo</span>
							<span
								className={
									vo2MaxImprovement >= 0
										? "text-green-600 dark:text-green-400"
										: "text-red-600 dark:text-red-400"
								}
							>
								{vo2MaxImprovement >= 0 ? "+" : ""}
								{vo2MaxImprovement.toFixed(1)}%
							</span>
						</div>
						<Progress
							value={Math.min(Math.abs(vo2MaxImprovement), 100)}
							className='h-2'
						/>
					</div>
					<div className='space-y-2'>
						<div className='flex justify-between text-sm'>
							<span>Melhoria no VAM(velocidade aerobica máxima)</span>
							<span
								className={
									vamImprovement >= 0
										? "text-green-600 dark:text-green-400"
										: "text-red-600 dark:text-red-400"
								}
							>
								{vamImprovement >= 0 ? "+" : ""}
								{vamImprovement.toFixed(1)}%
							</span>
						</div>
						<Progress
							value={Math.min(Math.abs(vamImprovement), 100)}
							className='h-2'
						/>
					</div>
					<div className='pt-2'>
						<div className='text-muted-foreground text-sm'>
							Baseado na comparação do primeiro e último teste
						</div>
					</div>
				</DashboardCard>
				<DashboardCard
					title='Atividade de testes'
					icon={Logs}
					contentClassName='space-y-4'
				>
					<div className='flex items-center justify-between'>
						<span className='text-muted-foreground text-sm'>
							Total de testes realizados
						</span>
						<Badge>{totalTests}</Badge>
					</div>
					<div className='flex items-center justify-between'>
						<span className='text-muted-foreground text-sm'>
							Total de tipos de teste
						</span>
						<span className='text-sm font-medium'>{testTypes.length}</span>
					</div>
					<div className='space-y-2'>
						<span className='text-muted-foreground text-sm'>
							Cobertura de distância
						</span>
						<div className='flex flex-wrap gap-1'>
							{testTypes.map((type) => (
								<Badge key={type} variant='outline' className='text-xs'>
									{type}
								</Badge>
							))}
						</div>
					</div>
				</DashboardCard>
			</div>
			<DashboardCard
				title='Atividade de testes por mes'
				description='Numero de testes completados a cada mes'
				icon={Logs}
			>
				<div className='grid gap-8'>
					{Object.entries(testsByMonth)
						.sort(([a], [b]) => new Date(b).getTime() - new Date(a).getTime())
						.map(([month]) => {
							const monthTests = tests.filter(
								(test) =>
									format(new Date(test.testDate), "LLLL', 'yyyy", {
										locale: ptBR,
									}) === month,
							);
							return (
								<div key={month} className='space-y-3'>
									<div className='flex items-center justify-between'>
										<h3 className='text-foreground text-lg font-semibold'>
											{month}
										</h3>
										<Badge variant='outline' className='text-sm'>
											{monthTests.length} teste
											{monthTests.length !== 1 ? "s" : ""}
										</Badge>
									</div>

									<div className='grid gap-3 md:grid-cols-2 lg:grid-cols-3'>
										{monthTests
											.sort(
												(a, b) =>
													new Date(b.testDate).getTime() -
													new Date(a.testDate).getTime(),
											)
											.map((test) => (
												<div
													key={test.id}
													className='bg-card relative overflow-hidden rounded-lg border p-4 shadow-sm transition-all hover:shadow-md'
												>
													{/* Test Type Header */}
													<div className='mb-3 flex items-center justify-between'>
														<Badge
															variant='secondary'
															className={`font-medium ${getTestTypeBadgeColor(test.testType)}`}
														>
															{test.testType}
														</Badge>
														<span className='text-muted-foreground text-xs'>
															{format(new Date(test.testDate), "dd/MM")}
														</span>
													</div>

													{/* Performance Metrics Grid */}
													<div className='mb-3 grid grid-cols-2 gap-3'>
														{test.paceMinKm && (
															<div className='bg-muted rounded-md p-2 text-center'>
																<div className='text-muted-foreground mb-1 text-xs'>
																	Pace
																</div>
																<div className='font-mono text-sm font-semibold'>
																	{test.paceMinKm}/km
																</div>
															</div>
														)}

														{test.vo2Max && (
															<div className='bg-muted rounded-md p-2 text-center'>
																<div className='text-muted-foreground mb-1 text-xs'>
																	VO2 Max
																</div>
																<div className='text-sm font-semibold'>
																	{test.vo2Max.toFixed(1)}
																</div>
															</div>
														)}

														{test.vam && (
															<div className='bg-muted rounded-md p-2 text-center'>
																<div className='text-muted-foreground mb-1 text-xs'>
																	VAM
																</div>
																<div className='text-sm font-semibold'>
																	{test.vam.toFixed(1)} km/h
																</div>
															</div>
														)}

														{test.fcmax && (
															<div className='bg-muted rounded-md p-2 text-center'>
																<div className='text-muted-foreground mb-1 text-xs'>
																	FC Max
																</div>
																<div className='text-sm font-semibold'>
																	{test.fcmax} bpm
																</div>
															</div>
														)}
													</div>

													{/* Duration Bar */}
													<div className='space-y-1'>
														<div className='flex justify-between text-xs'>
															<span className='text-muted-foreground'>
																Duração
															</span>
															<span className='font-medium'>
																{secondsToPace(test.durationS)}
															</span>
														</div>
														<div className='bg-muted h-1.5 w-full rounded-full'>
															<div
																className='bg-primary h-1.5 rounded-full transition-all duration-300'
																style={{
																	width: `${Math.min((test.durationS / 1800) * 100, 100)}%`, // Assuming 30min as max for visual
																}}
															/>
														</div>
													</div>
												</div>
											))}
									</div>
								</div>
							);
						})}
				</div>
			</DashboardCard>
		</div>
	);
}

TestStats.Loading = function TestsStatsLoading() {
	return (
		<div className='space-y-6'>
			<div className='grid gap-4 md:grid-cols-3'>
				<DashboardCard
					title='Resumo da performance'
					icon={ChartColumn}
					contentClassName='space-y-4'
				>
					<div className='flex items-center justify-between'>
						<span className='text-muted-foreground text-sm'>
							Melhor VO2 maximo
						</span>
						<Skeleton className='h-6 w-32' />
					</div>
					<div className='flex items-center justify-between'>
						<span className='text-muted-foreground text-sm'>Melhor VAM</span>
						<Skeleton className='h-6 w-32' />
					</div>
					<div className='flex items-center justify-between'>
						<span className='text-muted-foreground text-sm'>
							Vo2 Maximo medio
						</span>
						<Skeleton className='h-4 w-16' />
					</div>
					<div className='flex items-center justify-between'>
						<span className='text-muted-foreground text-sm'>VAM medio</span>
						<Skeleton className='h-4 w-16' />
					</div>
					<div className='flex items-center justify-between'>
						<span className='text-muted-foreground text-sm'>
							FC Maximo medio
						</span>
						<span className='text-sm font-medium'>
							<Skeleton className='h-4 w-16' />
						</span>
					</div>
				</DashboardCard>
				<DashboardCard
					title='Indicadores de progresso'
					icon={ChartColumn}
					contentClassName='space-y-4'
				>
					<div className='space-y-2'>
						<div className='flex justify-between text-sm'>
							<span>Melhoria no VO2 maximo</span>
							<Skeleton className='h-4 w-16' />
						</div>
						<Skeleton className='h-2 w-full' />
					</div>
					<div className='space-y-2'>
						<div className='flex justify-between text-sm'>
							<span>Melhoria no VAM(velocidade aerobica maxima)</span>
							<Skeleton className='h-4 w-16' />
						</div>
						<Skeleton className='h-2 w-full' />
					</div>
					<div className='pt-2'>
						<div className='text-muted-foreground text-sm'>
							Baseado na comparacao do primeiro e ultimo teste
						</div>
					</div>
				</DashboardCard>
				<DashboardCard
					title='Atividade de testes'
					icon={Logs}
					contentClassName='space-y-4'
				>
					<div className='flex items-center justify-between'>
						<span className='text-muted-foreground text-sm'>
							Total de testes realizados
						</span>
						<Skeleton className='h-6 w-32' />
					</div>
					<div className='flex items-center justify-between'>
						<span className='text-muted-foreground text-sm'>
							Total de tipos de teste
						</span>
						<Skeleton className='h-4 w-16' />
					</div>
					<div className='space-y-2'>
						<span className='text-muted-foreground text-sm'>
							Cobertura de distância
						</span>
						<Skeleton className='h-6 w-32' />
					</div>
				</DashboardCard>
			</div>
			<DashboardCard
				title='Atividade de testes por mes'
				description='Numero de testes completados a cada mes'
				icon={Logs}
			>
				<div className='grid gap-8'></div>
			</DashboardCard>
		</div>
	);
};
