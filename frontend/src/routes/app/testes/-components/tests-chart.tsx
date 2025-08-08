import { ChartArea } from "lucide-react";
import {
	Area,
	AreaChart,
	Bar,
	BarChart,
	CartesianGrid,
	Line,
	LineChart,
	ResponsiveContainer,
	XAxis,
	YAxis,
} from "recharts";
import { DashboardCard } from "@/components/dashboard-card";
import {
	ChartContainer,
	ChartTooltip,
	ChartTooltipContent,
} from "@/components/ui/chart";
import { Skeleton } from "@/components/ui/skeleton";
import type { Test } from "@/shared/types";

interface TestsChartsProps {
	tests: Test[];
}

export function TestsCharts({ tests }: TestsChartsProps) {
	// Sort tests by date for proper timeline
	const sortedTests = tests.sort(
		(a, b) => new Date(a.testDate).getTime() - new Date(b.testDate).getTime(),
	);

	// Prepare data for VO2 Max progress chart
	const vo2MaxData = sortedTests
		.filter((test) => test.vo2Max)
		.map((test, index) => ({
			test: `Test ${index + 1}`,
			date: new Date(test.testDate).toLocaleDateString(),
			vo2Max: test.vo2Max,
			testType: test.testType,
		}));

	// Prepare data for pace progress chart (convert pace to seconds for comparison)
	const paceData = sortedTests
		.filter((test) => test.paceMinKm)
		.map((test, index) => {
			const [min, sec] = test.paceMinKm!.split(":").map(Number);
			const totalSeconds = min * 60 + sec;
			return {
				test: `Test ${index + 1}`,
				date: new Date(test.testDate).toLocaleDateString(),
				paceSeconds: totalSeconds,
				paceDisplay: test.paceMinKm,
				testType: test.testType,
			};
		});

	const paceValues = paceData.map((d) => d.paceSeconds);
	const minPace = Math.min(...paceValues); // best pace (ex: 230s)
	const maxPace = Math.max(...paceValues); // worst pace (ex: 360s)

	// A little bit of margin (optional)
	const lowerLimit = Math.floor(maxPace + 10); // lower part of the graph
	const upperLimit = Math.ceil(minPace - 10);

	// Prepare data for test type distribution
	const testTypeData = Object.entries(
		tests.reduce(
			(acc, test) => {
				acc[test.testType] = (acc[test.testType] || 0) + 1;
				return acc;
			},
			{} as Record<string, number>,
		),
	).map(([type, count]) => ({
		testType: type,
		count,
	}));

	// Prepare data for VAM progress
	const vamData = sortedTests
		.filter((test) => test.vam)
		.map((test, index) => ({
			test: `Teste ${index + 1}`,
			date: new Date(test.testDate).toLocaleDateString(),
			vam: test.vam,
			testType: test.testType,
		}));

	return (
		<div className='grid gap-6 md:grid-cols-2'>
			<DashboardCard
				title='Progresso de VO2 máximo'
				description='Analise seu progresso ao longo do tempo'
				icon={ChartArea}
			>
				<ChartContainer
					config={{
						vo2Max: {
							label: "VO2 Max",
							color: "var(--chart-3)",
						},
					}}
					className='[&_.recharts-cartesian-grid]:outline-border h-full max-h-[224px] min-h-[300px] w-full [&_.recharts-cartesian-grid]:rounded-t-sm [&_.recharts-cartesian-grid]:outline'
				>
					<AreaChart
						accessibilityLayer
						data={vo2MaxData}
						margin={{
							top: 0,
							left: 0,
							right: 0,
							bottom: 0,
						}}
					>
						<defs>
							<linearGradient id='v02MaxGradient' x1='0' y1='0' x2='0' y2='1'>
								<stop
									offset='-10%'
									stopColor='var(--chart-3)'
									stopOpacity={0.1}
								/>
								<stop
									offset='100%'
									stopColor='var(--chart-3)'
									stopOpacity={0}
								/>
							</linearGradient>
						</defs>
						<CartesianGrid strokeDasharray='3 3' />
						<YAxis
							dataKey='vo2Max'
							tickLine={false}
							axisLine={false}
							orientation='left'
							width={52}
							domain={[0, (dataMax) => dataMax * 1.2]}
							allowDataOverflow={false}
							tickFormatter={(value) => `${(value / 1000).toFixed(2)}km`}
						/>
						<ChartTooltip
							content={
								<ChartTooltipContent
									indicator='line'
									valueFormatter={(value) =>
										`${((value as number) / 1000).toFixed(2)}km`
									}
								/>
							}
							cursor={false}
						/>
						<Area
							type='step'
							dataKey='vo2Max'
							stroke='var(--chart-3)'
							fill='url(#v02MaxGradient)' // customize a cor
						/>
					</AreaChart>
				</ChartContainer>
			</DashboardCard>

			<DashboardCard
				title='Progresso de pace'
				description='Analise seu progresso de pace ao longo do tempo'
				icon={ChartArea}
			>
				<ChartContainer
					config={{
						pace: {
							label: "Pace (min/km)",
							color: "hsl(var(--chart-2))",
						},
					}}
					className='[&_.recharts-cartesian-grid]:outline-border h-full max-h-[224px] min-h-[300px] w-full [&_.recharts-cartesian-grid]:rounded-t-sm [&_.recharts-cartesian-grid]:outline'
				>
					<ResponsiveContainer width='100%' height='100%'>
						<LineChart
							data={paceData}
							margin={{
								left: 0,
								top: 12,
								right: 12,
								bottom: 12,
							}}
						>
							<CartesianGrid strokeDasharray='3 3' />
							<YAxis
								tickFormatter={(value) => {
									const min = Math.floor(value / 60);
									const sec = Math.floor(value % 60);
									return `${min.toString().padStart(2, "0")}:${sec.toString().padStart(2, "0")}`;
								}}
								width={52}
								reversed
								domain={[upperLimit, lowerLimit]}
							/>
							<ChartTooltip
								content={<ChartTooltipContent />}
								labelFormatter={(label, payload) => {
									const data = payload?.[0]?.payload;
									return data ? `${data.testType} - ${data.date}` : label;
								}}
								formatter={(value: number) => {
									const data = paceData.find((d) => d.paceSeconds === value);
									return [data?.paceDisplay || value, "Pace"];
								}}
							/>
							<Line
								type='monotone'
								dataKey='paceSeconds'
								stroke='var(--chart-3)'
								strokeWidth={2}
								dot={{ fill: "var(--chart-3)" }}
							/>
						</LineChart>
					</ResponsiveContainer>
				</ChartContainer>
			</DashboardCard>

			<DashboardCard
				title='Distribuição de testes'
				description='Distribuição de testes ao longo do tempo'
				icon={ChartArea}
			>
				<ChartContainer
					config={{
						count: {
							label: "Testes",
							color: "var(--chart-3)",
						},
					}}
					className='[&_.recharts-cartesian-grid]:outline-border h-full max-h-[224px] min-h-[300px] w-full [&_.recharts-cartesian-grid]:rounded-t-sm [&_.recharts-cartesian-grid]:outline'
				>
					<ResponsiveContainer width='100%' height='100%'>
						<BarChart
							data={testTypeData}
							margin={{
								left: 0,
								top: 0,
								right: 0,
								bottom: 0,
							}}
						>
							<defs>
								<linearGradient id='gradientBar' x1='0' y1='0' x2='0' y2='100%'>
									<stop offset='0' stopColor='var(--chart-2)' />
									<stop offset='1' stopColor='var(--chart-3)' />
								</linearGradient>
							</defs>
							<CartesianGrid strokeDasharray='3 3' />
							<XAxis dataKey='testType' />
							<YAxis width={52} />
							<ChartTooltip
								content={<ChartTooltipContent />}
								labelFormatter={(label, payload) => {
									const data = payload?.[0]?.payload;
									return data ? `Teste de ${data.testType}` : label;
								}}
							/>
							<Bar
								dataKey='count'
								fill='url(#gradientBar)'
								stroke='var(--chart-2)'
								radius={[4, 4, 0, 0]}
								barSize={80}
							/>
						</BarChart>
					</ResponsiveContainer>
				</ChartContainer>
			</DashboardCard>

			<DashboardCard
				title='Progresso de VAM'
				description='Analise seu progresso de VAM ao longo do tempo'
				icon={ChartArea}
			>
				<ChartContainer
					config={{
						vam: {
							label: "VAM (km/h)",
							color: "var(--chart-4)",
						},
					}}
					className='[&_.recharts-cartesian-grid]:outline-border h-full max-h-[224px] min-h-[300px] w-full [&_.recharts-cartesian-grid]:rounded-t-sm [&_.recharts-cartesian-grid]:outline'
				>
					<ResponsiveContainer width='100%' height='100%'>
						<LineChart
							data={vamData}
							margin={{
								left: 0,
								top: 0,
								right: 0,
								bottom: 0,
							}}
						>
							<CartesianGrid strokeDasharray='3 3' />
							<XAxis dataKey='test' />
							<YAxis />
							<ChartTooltip
								content={<ChartTooltipContent />}
								labelFormatter={(label, payload) => {
									const data = payload?.[0]?.payload;
									return data ? `${data.testType} - ${data.date}` : label;
								}}
							/>
							<Line
								type='monotone'
								dataKey='vam'
								stroke='var(--chart-3)'
								strokeWidth={2}
								dot={{ fill: "var(--chart-3)" }}
							/>
						</LineChart>
					</ResponsiveContainer>
				</ChartContainer>
			</DashboardCard>
		</div>
	);
}

TestsCharts.Loading = function TestsChartsLoading() {
	return (
		<div className='grid gap-6 md:grid-cols-2'>
			<DashboardCard
				title='Progresso de VO2 máximo'
				description='Analise seu progresso ao longo do tempo'
				icon={ChartArea}
			>
				<Skeleton className='h-full min-h-[224px] w-full' />
			</DashboardCard>

			<DashboardCard
				title='Progresso de pace'
				description='Analise seu progresso de pace ao longo do tempo'
				icon={ChartArea}
			>
				<Skeleton className='h-full min-h-[224px] w-full' />
			</DashboardCard>

			<DashboardCard
				title='Distribuição de testes'
				description='Distribuição de testes ao longo do tempo'
				icon={ChartArea}
			>
				<Skeleton className='h-full min-h-[224px] w-full' />
			</DashboardCard>

			<DashboardCard
				title='Progresso de VAM'
				description='Analise seu progresso de VAM ao longo do tempo'
				icon={ChartArea}
			>
				<Skeleton className='h-full min-h-[224px] w-full' />
			</DashboardCard>
		</div>
	);
};
