// BlockCard.tsx

import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from "@radix-ui/react-collapsible";
import { ChevronDown, ChevronRight } from "lucide-react";
import { useState } from "react";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { getSegmentKindLabel } from "@/lib/calculations";
import type { PlanBlockWithSegment } from "@/shared/types";
import { PlanSegmentCard } from "./plan-segment-card";

export function PlanBlockCard({ block }: { block: PlanBlockWithSegment }) {
	const [open, setOpen] = useState(false);

	return (
		<Card className='bg-muted/30 py-0'>
			<Collapsible open={open} onOpenChange={setOpen}>
				<CollapsibleTrigger asChild>
					<CardHeader className='transition-colors py-4'>
						<div className='flex items-center gap-2'>
							{open ? (
								<ChevronDown className='size-4 text-muted-foreground' />
							) : (
								<ChevronRight className='size-4 text-muted-foreground' />
							)}
							<div>
								<CardTitle className='text-sm font-medium'>
									{block.description}
								</CardTitle>
								<CardDescription className='text-xs'>
									{getSegmentKindLabel(block.blockKind)} •{" "}
									{block.repeatCount > 1 ? `${block.repeatCount}x` : "1x"}
								</CardDescription>
							</div>
						</div>
					</CardHeader>
				</CollapsibleTrigger>

				<CollapsibleContent>
					<CardContent className='pt-0 pb-3'>
						<div className='grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3'>
							{block.planSegments.map((segment) => (
								<PlanSegmentCard key={segment.id} segment={segment} />
							))}
						</div>
					</CardContent>
				</CollapsibleContent>
			</Collapsible>
		</Card>
	);
}
