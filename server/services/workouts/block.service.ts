import { blocks as blockTable } from "@/db/schemas";

import type { Block } from "@/shared/types";

import type { DbTransaction } from "../training-weeks/training-week.service";

export class BlockService {
  static async createBlock(block: Block, workoutId: string, tx: DbTransaction) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
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
      const insertedBlock = await this.createBlock(block, workoutId, tx);
      createdBlocks.push({ ...insertedBlock, originalBlock: block });
    }

    return createdBlocks;
  }
}
