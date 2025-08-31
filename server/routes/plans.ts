import { zValidator } from "@hono/zod-validator";
import { eq } from "drizzle-orm";
import { Hono } from "hono";
import z from "zod";
import { db } from "@/db";
import { tests, trainingWeeks } from "@/db/schemas";
import { activePlans, plans } from "@/db/schemas/plans";
import { workoutAnalytics } from "@/db/schemas/workouts";
import type { Context } from "@/lib/context";
import { formatDate, parseHHMMSS } from "@/lib/utils";
import { loggedIn } from "@/middlewares/logged-in";
import { activatePlanToUser } from "@/services/plans/activate-plan-to-user.service";
import { TrainingHistoryService } from "@/services/training-weeks/training-history.service";
import { customPlanningSchema } from "@/shared/schemas";
import type {
	ErrorResponse,
	SuccessResponse,
	TrainingPlan,
	TrainingPlanSelect,
} from "@/shared/types";

export const plansRouter = new Hono<Context>()
	.get("/", async (c) => {
		const plans = await db.query.plans.findMany();

		return c.json<SuccessResponse<TrainingPlan[]>>({
			success: true,
			message: "Fetched plans successfully",
			data: plans,
		});
	})
	.get("/:planId", async (c) => {
		const { planId } = c.req.param();

		const plan = await db.query.plans.findFirst({
			where: eq(plans.id, planId),
			with: {
				planWeeks: {
					with: {
						planWorkouts: {
							with: {
								planBlocks: {
									with: {
										planSegments: {
											orderBy(fields, operators) {
												return operators.asc(fields.orderInBlock);
											},
										},
									},
									orderBy(fields, operators) {
										return operators.asc(fields.orderIndex);
									},
								},
								planSegments: true,
							},
							orderBy(fields, operators) {
								return operators.asc(fields.dayIndex);
							},
						},
					},
					orderBy: (planWeeks, { asc }) => asc(planWeeks.weekNumber),
				},
			},
		});

		if (!plan) {
			return c.json<ErrorResponse>(
				{
					success: false,
					error: "Plan not found",
				},
				404,
			);
		}

		return c.json<SuccessResponse<TrainingPlanSelect>>(
			{
				success: true,
				message: "Fetched plan successfully",
				data: plan,
			},
			200,
		);
	})
	.post(
		"/activate-plan/:planId",
		loggedIn,
		zValidator("param", z.object({ planId: z.string() })),
		async (c) => {
			const { planId } = c.req.param();
			const user = c.get("user");

			if (!user) {
				throw new Error("Usuário não encontrado");
			}

			const { id: userId } = user;

			const plan = await db.query.plans.findFirst({
				where: eq(plans.id, planId),
				with: {
					planWeeks: {
						with: {
							planWorkouts: {
								with: {
									planBlocks: {
										with: {
											planSegments: true,
										},
									},
									planSegments: true,
								},
							},
						},
						orderBy: (planWeeks, { asc }) => asc(planWeeks.weekNumber),
					},
				},
			});

			if (!plan) {
				return c.json<ErrorResponse>(
					{
						success: false,
						error: "Plano não encontrado",
					},
					404,
				);
			}

			// Busca o ultimo teste do usuario
			const lastUserTest = await db.query.tests.findFirst({
				where: eq(tests.userId, userId),
			});

			if (!lastUserTest) {
				return c.json<ErrorResponse>({
					success: false,
					error:
						"Nenhum teste foi feito pelo usuário, adicione um teste de corrida",
				});
			}

			const distanceM = lastUserTest.distanceM;
			const durationS = lastUserTest.durationS;

			if (distanceM == null || durationS == null) {
				return c.json<ErrorResponse>({
					success: false,
					error: "Dados de teste incompletos",
				});
			}

			const currentPlanning = await db.query.trainingWeeks.findMany({
				where: eq(trainingWeeks.userId, userId),
				with: {
					workouts: {
						with: {
							blocks: {
								with: {
									segments: true,
								},
							},
						},
						orderBy: (workouts, { asc }) => asc(workouts.scheduledStart),
					},
				},
			});

			if (currentPlanning) {
				const [currentActivePlan] = await db
					.select({
						planId: activePlans.planId,
						startDate: activePlans.startDate,
						name: plans.name,
						level: plans.level,
					})
					.from(activePlans)
					.where(eq(activePlans.userId, userId))
					.leftJoin(plans, eq(plans.id, activePlans.planId));

				const completedWorkouts = currentPlanning
					.flatMap((week) => week.workouts)
					.filter((workout) => workout.isCompleted);

				await db.transaction(async (tx) => {
					if (completedWorkouts.length) {
						const oldWorkoutAnalytics = await TrainingHistoryService({
							activePlan: {
								id: currentActivePlan?.planId ?? undefined,
								name: currentActivePlan?.name ?? "Plano Customizado",
								userId,
							},
							planningSelect: currentPlanning,
						});

						await tx.insert(workoutAnalytics).values({
							analyticsData: oldWorkoutAnalytics,
							userId,
							completedAt: formatDate(new Date()),
						});
					}

					await tx
						.delete(trainingWeeks)
						.where(eq(trainingWeeks.userId, userId));
				});
			}
			await db.delete(activePlans).where(eq(activePlans.userId, userId));
			await activatePlanToUser({
				plan,
				userId,
				userTestData: { distance: +distanceM, duration: durationS },
			});

			await db.insert(activePlans).values({
				userId,
				planId,
				startDate: formatDate(new Date()),
			});

			return c.json(
				{
					success: true,
					message: "Plano gerado com sucesso",
				},
				200,
			);
		},
	)
	.post(
		"/activate-custom-plan/:planId",
		loggedIn,
		zValidator("form", customPlanningSchema),
		async (c) => {
			const { planId } = c.req.param();
			const user = c.get("user");

			if (!user) {
				throw new Error("Usuário não encontrado");
			}

			const { id: userId } = user;

			const plan = await db.query.plans.findFirst({
				where: eq(plans.id, planId),
				with: {
					planWeeks: {
						with: {
							planWorkouts: {
								with: {
									planBlocks: {
										with: {
											planSegments: true,
										},
									},
									planSegments: true,
								},
								orderBy(fields, operators) {
									return operators.asc(fields.dayIndex);
								},
							},
						},
						orderBy: (planWeeks, { asc }) => asc(planWeeks.weekNumber),
					},
				},
			});

			if (!plan) {
				return c.json<ErrorResponse>(
					{
						success: false,
						error: "Plano não encontrado",
					},
					404,
				);
			}

			// Busca o ultimo teste do usuario
			const lastUserTest = await db.query.tests.findFirst({
				where: eq(tests.userId, userId),
			});

			const params = c.req.valid("form");

			if (!lastUserTest && (!params.distance || !params.duration)) {
				return c.json<ErrorResponse>({
					success: false,
					error: "Nenhum teste foi feito pelo usuário ou adicionado",
				});
			}

			const distanceM = params.distance ?? lastUserTest?.distanceM;
			const durationS = params.duration
				? parseHHMMSS(params.duration)
				: lastUserTest?.durationS;

			if (distanceM == null || durationS == null) {
				return c.json<ErrorResponse>({
					success: false,
					error: "Dados de teste incompletos",
				});
			}

			const currentPlanning = await db.query.trainingWeeks.findMany({
				where: eq(trainingWeeks.userId, userId),
				with: {
					workouts: {
						with: {
							blocks: {
								with: {
									segments: true,
								},
							},
						},
						orderBy: (workouts, { asc }) => asc(workouts.scheduledStart),
					},
				},
			});

			if (currentPlanning) {
				const [currentActivePlan] = await db
					.select({
						planId: activePlans.planId,
						startDate: activePlans.startDate,
						name: plans.name,
						level: plans.level,
					})
					.from(activePlans)
					.where(eq(activePlans.userId, userId))
					.leftJoin(plans, eq(plans.id, activePlans.planId));

				const completedWorkouts = currentPlanning
					.flatMap((week) => week.workouts)
					.filter((workout) => workout.isCompleted);

				await db.transaction(async (tx) => {
					if (completedWorkouts.length) {
						const oldWorkoutAnalytics = await TrainingHistoryService({
							activePlan: {
								id: currentActivePlan?.planId ?? undefined,
								name: currentActivePlan?.name ?? "Plano Customizado",
								userId,
							},
							planningSelect: currentPlanning,
						});

						await tx.insert(workoutAnalytics).values({
							analyticsData: oldWorkoutAnalytics,
							userId,
							completedAt: formatDate(new Date()),
						});
					}

					await tx
						.delete(trainingWeeks)
						.where(eq(trainingWeeks.userId, userId));
				});
			}
			await db.delete(activePlans).where(eq(activePlans.userId, userId));
			await activatePlanToUser({
				plan,
				userId,
				userTestData: { distance: +distanceM, duration: durationS },
				startDate: params.startDate,
				endDate: params.endDate,
			});

			await db.insert(activePlans).values({
				userId,
				planId,
				startDate: formatDate(params.startDate ?? new Date()),
			});

			return c.json<SuccessResponse>(
				{
					success: true,
					message: "Plano gerado com sucesso",
				},
				200,
			);
		},
	);
