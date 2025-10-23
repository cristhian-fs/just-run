import { Badge } from "@/components/ui/badge";
import {
	formatDistance,
	formatDuration,
	getSegmentKindColor,
	getSegmentKindLabel,
	secondsToPace,
} from "@/lib/calculations";
import type { TrainingPlanSegment } from "@/shared/types";

// SegmentCard.tsx
export function PlanSegmentCard({ segment }: { segment: TrainingPlanSegment }) {
	return (
		<div className='rounded-lg border p-4'>
			<div className='mb-3 flex items-center justify-between'>
				<Badge className={getSegmentKindColor(segment.segmentKind)}>
					{getSegmentKindLabel(segment.segmentKind)}
				</Badge>
				<span className='text-muted-foreground text-sm'>
					Segmento {segment.orderInBlock}
				</span>
			</div>

			<div className='grid grid-cols-1 gap-4 text-sm md:grid-cols-3'>
				<div>
					<p className='text-muted-foreground'>Distância</p>
					<p className='font-medium'>
						{formatDistance(segment.plannedDistanceM)}
					</p>
				</div>
				<div>
					<p className='text-muted-foreground'>Pace Alvo</p>
					<p className='font-medium'>
						{segment.targetPaceSPerKm
							? `${secondsToPace(segment.targetPaceSPerKm)} /km`
							: "Pace não definido"}
					</p>
				</div>
				<div>
					<p className='text-muted-foreground'>Duração</p>
					<p className='font-medium'>
						{formatDuration(segment.plannedDurationS)}
					</p>
				</div>
			</div>
		</div>
	);
}
