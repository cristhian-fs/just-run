import { BadgeCheck, Clock, FlagIcon, Goal } from "lucide-react";
import { motion, type Variants } from "motion/react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import {
	formatDistance,
	formatDuration,
	getSegmentKindColor,
	getSegmentKindLabel,
	secondsToPace,
} from "@/lib/calculations";
import type {
	BlockWithSegments,
	SegmentSelect,
	WorkoutWithBlocksAndSegments,
} from "@/shared/types";
import { RunTypeBadge } from "../run-type-badge";
import { RUN_TYPE_MAPPING } from "./workout-card";

export const WorkoutSegment = ({ segment }: { segment: SegmentSelect }) => {
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
						{segment.targetPaceSPerKm &&
							secondsToPace(segment.targetPaceSPerKm || 0) + "/km"}
						{!segment.targetPaceSPerKm && "Pace não definido"}
					</p>
				</div>
				<div>
					<p className='text-muted-foreground'>Duração</p>
					<p className='font-medium'>
						{formatDuration(segment.plannedDurationS)}
					</p>
				</div>
			</div>

			{segment.notes && (
				<div className='bg-muted mt-3 rounded p-2 px-3 text-sm'>
					{segment.notes}
				</div>
			)}
		</div>
	);
};

WorkoutSegment.Loading = function WorkoutSegmentSkeleton() {
	return (
		<div className='rounded-lg border p-4'>
			<div className='mb-3 flex items-center justify-between'>
				<Skeleton className='h-5 w-32' />
				<span className='text-muted-foreground text-sm'>
					Carregando segmento...
				</span>
			</div>

			<div className='grid grid-cols-1 gap-4 text-sm md:grid-cols-3'>
				<div>
					<p className='text-muted-foreground'>Distância</p>
					<Skeleton className='h-4 w-40' />
				</div>
				<div>
					<p className='text-muted-foreground'>Pace Alvo</p>
					<Skeleton className='h-4 w-40' />
				</div>
				<div>
					<p className='text-muted-foreground'>Duração</p>
					<Skeleton className='h-4 w-40' />
				</div>
			</div>
			<div className='bg-muted mt-3 rounded p-2 px-3 text-sm'>
				<Skeleton className='h-3 w-28' />
			</div>
		</div>
	);
};

const containerVariant = {
	hidden: { opacity: 0 },
	show: {
		opacity: 1,
		transition: {
			staggerChildren: 0.05,
			ease: "easeInOut",
			duration: 0.2,
		},
	},
} as Variants;

const itemVariant = {
	hidden: { opacity: 0, y: 10 },
	show: { opacity: 1, y: 0 },
} as Variants;

export const WorkoutBlock = ({ block }: { block: BlockWithSegments }) => {
	return (
		<motion.div variants={itemVariant}>
			<Card className='gap-2'>
				<CardHeader className=''>
					<div className='flex items-center justify-between'>
						<CardTitle className='text-base'>
							Bloco {block.orderIndex} - {block.description}
						</CardTitle>
						<Badge variant='outline'>{block.repeatCount}x</Badge>
					</div>
				</CardHeader>
				<CardContent>
					<div className='space-y-3'>
						{block.segments.map((segment) => (
							<WorkoutSegment key={segment.id} segment={segment} />
						))}
					</div>
				</CardContent>
			</Card>
		</motion.div>
	);
};

WorkoutBlock.Loading = function WorkoutBlockSkeleton() {
	return (
		<div>
			<Card className='gap-2'>
				<CardHeader className=''>
					<div className='flex items-center justify-between'>
						<CardTitle className='text-base'>Carregando bloco...</CardTitle>
						<Skeleton className='h-3 w-16' />
					</div>
				</CardHeader>
				<CardContent>
					<div className='space-y-3'>
						<WorkoutSegment.Loading />
					</div>
				</CardContent>
			</Card>
		</div>
	);
};

export const WorkoutData = ({
	workout,
}: {
	workout: WorkoutWithBlocksAndSegments;
}) => {
	return (
		<>
			<div className='space-y-4 p-4'>
				<p className='text-foreground text-base font-medium sm:text-lg'>
					Detalhes do treino
				</p>
				<motion.ul
					className='space-y-5'
					key='details'
					variants={containerVariant}
					initial='hidden'
					animate='show'
				>
					<motion.li variants={itemVariant} className='flex items-center'>
						<Goal className='text-muted-foreground size-4' />
						<p className='text-muted-foreground ml-2 text-sm sm:text-base'>
							Tipo de treino:
						</p>
						<RunTypeBadge variant={workout.runType} className='ml-2'>
							{RUN_TYPE_MAPPING[workout.runType]}
						</RunTypeBadge>
					</motion.li>
					<motion.li variants={itemVariant} className='flex items-center'>
						<Clock className='text-muted-foreground size-4' />
						<p className='text-muted-foreground ml-2 text-sm sm:text-base'>
							Duração:
						</p>
						{workout.plannedDurationS ? (
							<p className='ml-2 text-sm sm:text-base'>
								{Math.round(workout.plannedDurationS / 60)} min
							</p>
						) : (
							<p className='ml-2 text-sm sm:text-base'>N/A</p>
						)}
					</motion.li>
					<motion.li variants={itemVariant} className='flex items-center'>
						<FlagIcon className='text-muted-foreground size-4' />
						<p className='text-muted-foreground ml-2 text-sm sm:text-base'>
							Distância:
						</p>
						{workout.plannedDistanceM ? (
							<p className='ml-2 text-sm sm:text-base'>
								~{Math.round(workout.plannedDistanceM / 1000)} km
							</p>
						) : (
							<p className='ml-2 text-sm sm:text-base'>N/A</p>
						)}
					</motion.li>
					<motion.li variants={itemVariant} className='flex items-center'>
						<BadgeCheck className='text-muted-foreground size-4' />
						<p className='text-muted-foreground ml-2 text-sm sm:text-base'>
							Status:
						</p>
						{workout.isCompleted ? (
							<Badge className='ml-2 border-green-500 bg-green-500/5 dark:bg-green-500/10'>
								<span className='text-sm text-green-600 dark:text-green-400'>
									Concluido
								</span>
							</Badge>
						) : (
							<Badge className='ml-2 border-red-500 bg-red-500/5 dark:bg-red-500/10'>
								<span className='text-sm text-red-600 dark:text-red-400'>
									Não concluido
								</span>
							</Badge>
						)}
					</motion.li>
				</motion.ul>
			</div>
			<Separator />
			{/* Blocks and Segments */}
			<motion.div
				className='space-y-4 p-4'
				variants={containerVariant}
				initial='hidden'
				animate='show'
			>
				<h3 className='text-lg font-semibold'>Estrutura do Treino</h3>
				{workout.blocks?.map((block) => (
					<WorkoutBlock block={block} key={block.id} />
				))}
				{workout.segments?.map((segment) => (
					<WorkoutSegment segment={segment} key={segment.id} />
				))}
			</motion.div>
		</>
	);
};

WorkoutData.Loading = function WorkoutDataSkeleton() {
	return (
		<>
			<div className='space-y-4 p-4'>
				<p className='text-foreground text-base font-medium sm:text-lg'>
					Detalhes do treino
				</p>
				<ul className='space-y-5'>
					<li className='flex items-center'>
						<Goal className='text-muted-foreground size-4' />
						<p className='text-muted-foreground ml-2 text-sm sm:text-base'>
							Tipo de treino:
						</p>
						<Skeleton className='h-5 w-40' />
					</li>
					<li className='flex items-center'>
						<Clock className='text-muted-foreground size-4' />
						<p className='text-muted-foreground ml-2 text-sm sm:text-base'>
							Duração:
						</p>
						<Skeleton className='h-5 w-40' />
					</li>
					<li className='flex items-center'>
						<FlagIcon className='text-muted-foreground size-4' />
						<p className='text-muted-foreground ml-2 text-sm sm:text-base'>
							Distância:
						</p>
						<Skeleton className='h-5 w-40' />
					</li>
					<li className='flex items-center'>
						<BadgeCheck className='text-muted-foreground size-4' />
						<p className='text-muted-foreground ml-2 text-sm sm:text-base'>
							Status:
						</p>
						<Skeleton className='h-5 w-40' />
					</li>
				</ul>
			</div>
			<Separator />
			{/* Blocks and Segments */}
			<div className='space-y-4 p-4'>
				<h3 className='text-lg font-semibold'>Estrutura do Treino</h3>
				{Array.from({ length: 3 }).map((_, i) => (
					// biome-ignore lint/suspicious/noArrayIndexKey: just loading screen
					<WorkoutBlock.Loading key={i} />
				))}
			</div>
		</>
	);
};
