import { useEffect, useState } from "react";
import { WorkoutSheet } from "@/features/trainings/components/workouts/workout-sheet";
import { useWorkoutSheetStore } from "@/features/trainings/store/workout-sheet-store";
import { TrainingsDialog } from "@/routes/app/calculadora/-components/trainings-dialog";

export const Modals = () => {
	// Prevent hydration erros
	const [mounted, setMounted] = useState(false);
	const workoutStoreState = useWorkoutSheetStore();

	useEffect(() => {
		setMounted(true);
	}, []);

	if (!mounted) return null;

	return (
		<>
			<WorkoutSheet isOpen={workoutStoreState.isOpen} />
			<TrainingsDialog />
		</>
	);
};
