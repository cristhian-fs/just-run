import { useQuery } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { zodValidator } from "@tanstack/zod-adapter";
import { useMemo, useState } from "react";
import z from "zod";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { getPlans } from "@/features/plans/api/get-plans";
import { PlanCard } from "../../../features/plans/components/plan-card";

const plansSearchSchema = z.object({
	distance: z.array(z.string()).optional(),
	coach: z.string().optional().default("all"),
	level: z
		.enum(["all", "beginner", "intermediate", "advanced", "elite"])
		.optional()
		.default("all"),
});

export const Route = createFileRoute("/app/planos/")({
	component: RouteComponent,
	validateSearch: zodValidator(plansSearchSchema),
});

function RouteComponent() {
	const { data: plans } = useQuery({
		queryKey: ["plans"],
		queryFn: () => getPlans(),
	});

	const params = Route.useSearch();
	const navigate = useNavigate({ from: Route.fullPath });

	const [filters, setFilters] = useState({
		level: params.level,
		coach: params.coach,
		distances: params.distance || ([] as string[]),
	});

	const uniqueCoaches = useMemo(() => {
		if (!plans) return [];
		return Array.from(new Set(plans.map((plan) => plan.coach)));
	}, [plans]);

	const uniqueDistances = useMemo(() => {
		if (!plans) return ["5k", "10k", "21k", "42k"];

		const allDistances = plans.flatMap((plan) => plan.distances || []);
		return Array.from(new Set(allDistances)).sort();
	}, [plans]);

	const filteredPlans = useMemo(() => {
		if (!plans) return [];
		return plans.filter((plan) => {
			if (filters.level !== "all" && plan.level !== filters.level) return false;
			if (filters.coach !== "all" && plan.coach !== filters.coach) return false;
			if (
				filters.distances.length > 0 &&
				!filters.distances.some((d) => (plan.distances || []).includes(d))
			)
				return false;
			return true;
		});
	}, [plans, filters]);

	const handleFilterChange = (key: keyof typeof filters, value: any) => {
		const newFilters = { ...filters, [key]: value };
		setFilters(newFilters);

		// Atualiza a URL
		navigate({
			search: {
				level: newFilters.level !== "all" ? newFilters.level : undefined,
				coach: newFilters.coach !== "all" ? newFilters.coach : undefined,
				distance:
					newFilters.distances.length > 0 ? newFilters.distances : undefined,
			},
			replace: true,
		});
	};

	// Função para limpar filtros
	const clearFilters = () => {
		setFilters({
			level: "all",
			coach: "all",
			distances: [],
		});
	};

	if (!plans || !plans.length) {
		return (
			<main className='py-4 md:py-8'>
				<div className='px-4'>
					<div className='flex flex-col items-start justify-between gap-4 md:flex-row md:items-center'>
						<div>
							<h1 className='text-3xl font-semibold tracking-tighter'>
								Planos de corrida
							</h1>
							<p className='text-muted-foreground'>
								Selecione o plano de corrida ideal para você de acordo com seus
								objetivos
							</p>
						</div>
						<Badge variant='secondary' className='text-sm'>
							0 planos disponiveis
						</Badge>
					</div>

					<div className='flex flex-col items-center justify-center flex-1'>
						<span className='text-lg'>Nenhum plano disponivel</span>
					</div>
				</div>
			</main>
		);
	}

	return (
		<main className='py-4 md:py-8'>
			<div className='px-4'>
				<div className='flex flex-col items-start justify-between gap-4 md:flex-row md:items-center'>
					<div>
						<h1 className='text-3xl font-semibold tracking-tighter'>
							Planos de corrida
						</h1>
						<p className='text-muted-foreground'>
							Selecione o plano de corrida ideal para você de acordo com seus
							objetivos
						</p>
					</div>
					<Badge variant='secondary' className='text-sm'>
						{plans.length} planos disponiveis
					</Badge>
				</div>

				{/* Seção de filtros */}
				<div className='mt-8 mb-8'>
					<h2 className='text-lg font-medium mb-4'>Filtros</h2>
					<div className='flex flex-col gap-4 md:flex-row md:items-end md:gap-3'>
						{/* Filtro por level */}
						<div className='flex flex-col'>
							<Label htmlFor='level' className='text-sm font-medium mb-1'>
								Nível
							</Label>
							<Select
								value={filters.level || "all"}
								onValueChange={(value) => handleFilterChange("level", value)}
							>
								<SelectTrigger className='w-[180px]'>
									<SelectValue placeholder='Todos' />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value='all'>Todos</SelectItem>
									<SelectItem value='beginner'>Iniciante</SelectItem>
									<SelectItem value='intermediate'>Intermediário</SelectItem>
									<SelectItem value='advanced'>Avançado</SelectItem>
									<SelectItem value='elite'>Elite</SelectItem>
								</SelectContent>
							</Select>
						</div>

						{/* Filtro por coach */}
						<div className='flex flex-col'>
							<Label htmlFor='coach' className='text-sm font-medium mb-1'>
								Coach
							</Label>
							<Select
								value={filters.coach || "all"}
								onValueChange={(value) => handleFilterChange("coach", value)}
							>
								<SelectTrigger className='w-[180px]'>
									<SelectValue placeholder='Todos' />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value='all'>Todos</SelectItem>
									{uniqueCoaches.map((coach) => (
										<SelectItem key={coach} value={coach || "N/A"}>
											{coach}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>

						{/* Filtro por distances (múltiplas seleções) */}
						<Popover>
							<PopoverTrigger asChild>
								<Button variant={"outline"}>
									{filters.distances.length
										? filters.distances.join(", ")
										: "Distancias"}
								</Button>
							</PopoverTrigger>
							<PopoverContent className='w-80'>
								<div className='flex flex-col gap-2'>
									{uniqueDistances.map((distance) => (
										<div key={distance} className='flex items-center space-x-2'>
											<Checkbox
												id={distance}
												checked={filters.distances.includes(distance)}
												onCheckedChange={(checked) => {
													if (checked) {
														handleFilterChange("distances", [
															...filters.distances,
															distance,
														]);
													} else {
														handleFilterChange(
															"distances",
															filters.distances.filter((d) => d !== distance),
														);
													}
												}}
											/>
											<Label htmlFor={distance}>{distance}</Label>
										</div>
									))}
								</div>
							</PopoverContent>
						</Popover>

						{/* Botão para limpar filtros */}
						<Button onClick={clearFilters} variant='outline' size='sm'>
							Limpar Filtros
						</Button>
					</div>
				</div>

				<div className='mt-8 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
					{filteredPlans.map((plan) => {
						const sanitizedPlan = {
							...plan,
							createdAt: new Date(plan.createdAt),
						};
						return <PlanCard plan={sanitizedPlan} key={plan.id} />;
					})}
				</div>
			</div>
		</main>
	);
}
