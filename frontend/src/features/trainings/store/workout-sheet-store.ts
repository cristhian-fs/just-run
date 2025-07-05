import { create } from "zustand";

import { WorkoutSelect } from "@/shared/types";

type State = {
  workout: WorkoutSelect | null;
  setWorkout: (workout: WorkoutSelect) => void;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
};

export const useWorkoutSheetStore = create<State>((set) => ({
  workout: null,
  setWorkout: (workout: WorkoutSelect) => set({ workout }),
  isOpen: false,
  setIsOpen: (isOpen: boolean) => set({ isOpen }),
}));
