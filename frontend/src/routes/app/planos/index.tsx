import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { Badge } from "@/components/ui/badge";
import { getPlans } from "@/features/plans/api/get-plans";
import { PlanCard } from "../../../features/plans/components/plan-card";

export const Route = createFileRoute("/app/planos/")({
	component: RouteComponent,
});

function RouteComponent() {
	const { data: plans } = useQuery({
		queryKey: ["plans"],
		queryFn: () => getPlans(),
	});

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

				<div className='mt-8 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
					{plans.map((plan) => {
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
