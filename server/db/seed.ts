import { getTableName, sql, type Table } from "drizzle-orm";
import env from "@/env-runtime";
import { connection, db } from ".";
import {
	planBlocks,
	planSegments,
	plans,
	planWeeks,
	planWorkouts,
} from "./schemas/plans";
import * as seeds from "./seeds";

if (!env.DB_SEEDING) {
	throw new Error('You must need DB_SEEDING to "true" when running seeds');
}

async function resetTable(db: db, table: Table) {
	return db.execute(
		sql.raw(`TRUNCATE TABLE ${getTableName(table)} RESTART IDENTITY CASCADE`),
	);
}

await resetTable(db, plans);
await resetTable(db, planWeeks);
await resetTable(db, planWorkouts);
await resetTable(db, planBlocks);
await resetTable(db, planSegments);

await seeds.seedPlan();

await connection.end();
