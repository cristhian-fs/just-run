import { create } from "zustand";

import { HeartRaceZone, VDOTTrainingSegmentType } from "../types";

type State = {
  trainingType: HeartRaceZone | VDOTTrainingSegmentType | null;
  setTrainingType: (
    trainingType: HeartRaceZone | VDOTTrainingSegmentType,
  ) => void;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
};

export const useTrainingDialogStore = create<State>((set) => ({
  trainingType: null,
  setTrainingType: (trainingType: HeartRaceZone | VDOTTrainingSegmentType) =>
    set({ trainingType }),
  isOpen: false,
  setIsOpen: (isOpen: boolean) => set({ isOpen }),
}));
