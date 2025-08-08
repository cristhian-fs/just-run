/** biome-ignore-all lint/complexity/noStaticOnlyClass: keep WorkoutService */
import { blocks as blockTable } from "@/db/schemas";
import type { Block } from "@/shared/types";
import type { DbTransaction } from "../training-weeks/training-week.service";

export class BlockService {
	static async createBlock(block: Block, workoutId: string, tx: DbTransaction) {
		// biome-ignore lint/correctness/noUnusedVariables: will be used only restBlock
		const { segments, ...restBlock } = block;

		const [insertedBlock] = await tx
			.insert(blockTable)
			.values({
				...restBlock,
				workoutId,
			})
			.returning({ id: blockTable.id });

		if (!insertedBlock) {
			throw new Error("Falha ao criar block");
		}

		return insertedBlock;
	}

	static async createBlocks(
		blocks: Block[],
		workoutId: string,
		tx: DbTransaction,
	) {
		const createdBlocks = [];

		for (const block of blocks) {
			const insertedBlock = await BlockService.createBlock(
				block,
				workoutId,
				tx,
			);
			createdBlocks.push({ ...insertedBlock, originalBlock: block });
		}

		return createdBlocks;
	}
}
