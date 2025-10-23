import { create } from "zustand";

type State = {
	workoutId: string | null;
	setWorkoutId: (workoutId: string) => void;
	isOpen: boolean;
	setIsOpen: (isOpen: boolean) => void;
};

export const useWorkoutSheetStore = create<State>((set) => ({
	workoutId: null,
	setWorkoutId: (workoutId: string) => set({ workoutId }),
	isOpen: false,
	setIsOpen: (isOpen: boolean) => set({ isOpen }),
}));
