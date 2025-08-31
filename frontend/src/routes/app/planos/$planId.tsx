import { useQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ChevronLeft } from "lucide-react";
import { useMemo } from "react";
import { Button } from "@/components/ui/button";
import { getPlan } from "@/features/plans/api/get-plan";
import { convertPlanData } from "@/features/plans/convert-plan-data";
import { getUserLastTest } from "@/lib/api";
import { PlanView } from "../../../features/plans/components/plan-view";

export const Route = createFileRoute("/app/planos/$planId")({
	component: RouteComponent,
	loader: ({ params: { planId } }) => getPlan(planId),
});

function RouteComponent() {
	const plan = Route.useLoaderData();
	const { data: lastTest } = useQuery({
		queryKey: ["test"],
		queryFn: () => getUserLastTest(),
	});

	const parsedPlan = useMemo(
		() => ({
			...plan,
			createdAt: new Date(plan.createdAt),
		}),
		[plan],
	);

	const convertedPlan = useMemo(() => {
		if (!lastTest?.data) return null;

		return convertPlanData({
			plan: parsedPlan,
			userTest: {
				distance: lastTest.data.distanceM,
				duration: lastTest.data.durationS,
			},
		});
	}, [parsedPlan, lastTest?.data]);

	return (
		<main className='py-4 md:py-8'>
			<div className='px-4'>
				<Button asChild variant='link' className='-mx-4 mb-4'>
					<Link to='/app/planos'>
						<ChevronLeft />
						Voltar para planos
					</Link>
				</Button>
				{convertedPlan && <PlanView plan={convertedPlan} />}
			</div>
		</main>
	);
}
