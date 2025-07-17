import { db } from "@/db";

import type { Training, Workout } from "@/shared/types";
import type { WeeklyKmTrainingDistribution } from "@/lib/types";

import { BlockService } from "../workouts/block.service";
import { SegmentService } from "../workouts/segment.service";
import { WorkoutService } from "../workouts/workout.service";
import {
  TrainingWeekService,
  type DbTransaction,
} from "./training-week.service";

export class TrainingWeekOrchestratorService {
  static async saveTrainingWeekWithWorkouts({
    trainings,
    userId,
  }: {
    userId: string;
    trainings: {
      week: WeeklyKmTrainingDistribution;
      weekStart: Date;
      trainingDays: Training[];
      workouts: Workout[];
    }[];
  }): Promise<void> {
    await db.transaction(async (tx) => {
      // Limpa treinos existentes do usuário
      await TrainingWeekService.deleteUserTrainingWeeks(userId, tx);

      for (const training of trainings) {
        if (!training.workouts.length) continue;

        // Cria a semana de treino
        const insertedWeek = await TrainingWeekService.createTrainingWeek(
          training.week,
          userId,
          tx,
        );

        // Cria os workouts
        const createdWorkouts = await WorkoutService.createWorkouts(
          training.workouts,
          insertedWeek.id,
          tx,
        );

        // Processa blocos e segmentos para cada workout
        for (const { id: workoutId, originalWorkout } of createdWorkouts) {
          await this.processWorkoutBlocksAndSegments(
            originalWorkout,
            workoutId,
            tx,
          );
        }
      }
    });
  }

  static async saveWorkout({
    userId,
    workout,
  }: {
    workout: Workout;
    userId: string;
  }) {
    await db.transaction(async (tx) => {
      const insertedWorkout = await WorkoutService.createWorkout(
        workout,
        userId,
        tx,
      );
      await this.processWorkoutBlocksAndSegments(
        workout,
        insertedWorkout.id,
        tx,
      );
    });
  }

  private static async processWorkoutBlocksAndSegments(
    workout: Workout,
    workoutId: string,
    tx: DbTransaction,
  ) {
    // Processa segmentos dos blocos
    if (workout.blocks?.length) {
      const createdBlocks = await BlockService.createBlocks(
        workout.blocks,
        workoutId,
        tx,
      );

      for (const { id: blockId, originalBlock } of createdBlocks) {
        if (originalBlock.segments.length) {
          await SegmentService.createSegments(
            originalBlock.segments,
            blockId,
            "block",
            tx,
          );
        }
      }
    }

    // Processa segmentos diretos do workout
    if (workout.segments?.length) {
      await SegmentService.createSegments(
        workout.segments,
        workoutId,
        "workout",
        tx,
      );
    }
  }
}
