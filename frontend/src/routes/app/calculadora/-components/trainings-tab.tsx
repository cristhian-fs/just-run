import { Button } from "@/components/ui/button";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { useTrainingDialogStore } from "@/features/vdot/store/training-dialog-store";
import {
	type HeartRaceZone,
	heartRaceZoneMapping,
	TRAINING_DISTANCES,
	type TrainingSegmentPaces,
	type VDOTTrainingSegmentType,
	VDOTTrainingSegmentTypeMapping,
	vdotTrainingSegmentTypes,
} from "@/features/vdot/types";

interface TrainingTabProps {
	trainings: TrainingSegmentPaces;
}

export function TrainingsTab({ trainings }: TrainingTabProps) {
	const { setTrainingType, setIsOpen } = useTrainingDialogStore();

	return (
		<div className='space-y-8'>
			<Table>
				<TableHeader>
					<TableRow className='border-0 hover:bg-transparent dark:hover:bg-transparent'>
						<TableHead className='px-3'>Tipo</TableHead>
						<TableHead className='px-3'>1km</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{Object.keys(trainings.defaults).map((type, index) => {
						const heartRaceZone =
							heartRaceZoneMapping[type as keyof typeof heartRaceZoneMapping];
						const VDOTTrainingSegmentType =
							VDOTTrainingSegmentTypeMapping[
								type as keyof typeof VDOTTrainingSegmentTypeMapping
							];
						const cell = heartRaceZone || VDOTTrainingSegmentType;

						return (
							<TableRow
								key={type}
								className='odd:hover:bg-muted/90 dark:odd:hover:bg-muted/90 dark:odd:bg-muted/90 rounded-md border-0 hover:bg-transparent dark:hover:bg-transparent'
							>
								<TableCell className='px-3 py-4'>
									<Button
										variant='link'
										className='p-0'
										onClick={() => {
											setTrainingType(
												Object.keys(trainings.defaults)[index] as
													| HeartRaceZone
													| VDOTTrainingSegmentType,
											);
											setIsOpen(true);
										}}
									>
										{cell}
									</Button>
								</TableCell>
								<TableCell className='px-3 py-4'>
									{Object.values(trainings.defaults)[index].paceKm}
								</TableCell>
							</TableRow>
						);
					})}
				</TableBody>
			</Table>
			<Table>
				<TableHeader>
					<TableRow className='border-0 hover:bg-transparent dark:hover:bg-transparent'>
						<TableHead className='px-3'>Tipo</TableHead>
						{TRAINING_DISTANCES.slice(3, 6)
							.toReversed()
							.map((training) => (
								<TableHead key={training.distance}>
									{training.distance}
								</TableHead>
							))}
					</TableRow>
				</TableHeader>
				<TableBody>
					{vdotTrainingSegmentTypes.map((type) => (
						<TableRow
							key={type}
							className='odd:hover:bg-muted/90 dark:odd:hover:bg-muted/90 dark:odd:bg-muted/90 rounded-md border-0 hover:bg-transparent dark:hover:bg-transparent'
						>
							<TableCell className='px-3 py-4'>
								<Button
									variant='link'
									className='p-0'
									onClick={() => {
										setTrainingType(type);
										setIsOpen(true);
									}}
								>
									{VDOTTrainingSegmentTypeMapping[type]}
								</Button>
							</TableCell>
							{trainings[type]
								.slice(3, 6)
								.toReversed()
								.map(({ distance }) => {
									const paceObj = trainings[type].find(
										(d) => d.distance === distance,
									);

									return (
										<TableCell key={`${type}-${distance}`}>
											{paceObj?.pace ?? "-"}
										</TableCell>
									);
								})}
						</TableRow>
					))}
				</TableBody>
			</Table>
			<Table>
				<TableHeader>
					<TableRow className='border-0 hover:bg-transparent dark:hover:bg-transparent'>
						<TableHead className='px-3'>Tipo</TableHead>
						{TRAINING_DISTANCES.slice(0, 3)
							.toReversed()
							.map((training) => (
								<TableHead key={training.distance}>
									{training.distance}
								</TableHead>
							))}
					</TableRow>
				</TableHeader>
				<TableBody>
					{vdotTrainingSegmentTypes.map((type) => (
						<TableRow
							key={type}
							className='odd:hover:bg-muted/90 dark:odd:hover:bg-muted/90 dark:odd:bg-muted/90 rounded-md border-0 hover:bg-transparent dark:hover:bg-transparent'
						>
							<TableCell className='px-3 py-4'>
								<Button
									variant='link'
									className='p-0'
									onClick={() => {
										setTrainingType(type);
										setIsOpen(true);
									}}
								>
									{VDOTTrainingSegmentTypeMapping[type]}
								</Button>
							</TableCell>
							{trainings[type]
								.slice(0, 3)
								.toReversed()
								.map(({ distance }) => {
									const paceObj = trainings[type].find(
										(d) => d.distance === distance,
									);

									return (
										<TableCell key={`${type}-${distance}`}>
											{paceObj?.pace ?? "-"}
										</TableCell>
									);
								})}
						</TableRow>
					))}
				</TableBody>
			</Table>
		</div>
	);
}
