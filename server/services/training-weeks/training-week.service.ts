import { eq } from "drizzle-orm";

import type { db } from "@/db";
import { trainingWeeks } from "@/db/schemas";

import type { WeeklyKmTrainingDistribution } from "@/lib/types";
import { formatDate } from "@/lib/utils";

export type DbTransaction = Parameters<Parameters<typeof db.transaction>[0]>[0];

export class TrainingWeekService {
	static async deleteUserTrainingWeeks(userId: string, tx: DbTransaction) {
		return await tx
			.delete(trainingWeeks)
			.where(eq(trainingWeeks.userId, userId));
	}

	static async createTrainingWeek(
		weekData: WeeklyKmTrainingDistribution,
		userId: string,
		tx: DbTransaction,
	) {
		const [insertedWeek] = await tx
			.insert(trainingWeeks)
			.values({
				totalVolumeMin: weekData.totalVolumeMin,
				userId,
				weekStart: formatDate(new Date(weekData.weekStart)),
				weekType: weekData.weekType,
				createdAt: new Date(),
			})
			.returning({ id: trainingWeeks.id });

		if (!insertedWeek) throw new Error("Falha ao criar semana de treinamento");

		return insertedWeek;
	}
}
