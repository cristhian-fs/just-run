import { z } from "zod";
import {
	raceOptions,
	segmentKinds,
	testTypes,
	trainingGoals,
	trainingTypes,
} from "../constants/training.constants";

export const TestFormSchema = z.object({
	testType: z.enum(testTypes),
	distanceM: z.coerce
		.number()
		.min(0, { message: "A distância percorrida é obrigatória" }),
	time: z
		.string()
		.regex(/^\d{2}:\d{2}:\d{2}$/, { message: "Formato deve ser hh:mm:ss" }),
	goal: z.enum(trainingGoals),
	raceDate: z
		.union([z.string(), z.date()])
		.transform((val) => (val ? new Date(val) : undefined))
		.optional()
		.or(z.literal("")),
	testDate: z.coerce.date(),
});

export type TestFormData = z.infer<typeof TestFormSchema>;

export const registerWorkoutSchema = z.object({
	date: z.coerce.date({
		required_error: "Data é obrigatória",
	}),
	time: z.string().regex(/^\d{2}:\d{2}$/, "Hora inválida"),
	runType: z.enum(trainingTypes),
	workoutType: z.enum(["Treino completo", "treino pulado", "treino parcial"], {
		required_error: "Selecione o tipo de treino",
	}),
	duration: z
		.string()
		.regex(
			/^([0-9]{1,2}):([0-5][0-9]):([0-5][0-9])$/,
			"Formato de duração inválido (HH:MM:SS)",
		),
	distance: z
		.string()
		.min(1, "Distância é obrigatória")
		.refine((val) => {
			const num = Number.parseFloat(val);
			return !Number.isNaN(num) && num > 0;
		}, "Distância deve ser um número positivo"),
	perceivedEffort: z.string(),
	observations: z.string().optional(),
});

export type RegisterWorkoutFormData = z.infer<typeof registerWorkoutSchema>;

export const newPeriodizationPlanSchema = z.object({
	weeks: z.coerce.number(),
	race: z.enum(raceOptions),
	baseValuePerWeek: z.coerce.number(),
	weeklyFrequency: z.coerce.number().min(3).max(6),
	unit: z.enum(["KM", "MINUTES"]),
	startDate: z.coerce.date({
		required_error: "Data é obrigatória",
	}),
});

export type NewPeriodizationPlanFormData = z.infer<
	typeof newPeriodizationPlanSchema
>;

export const segmentSchema = z.object({
	orderInBlock: z.number().min(1),
	segmentKind: z.enum(segmentKinds),
	plannedDistanceM: z
		.number()
		.min(0, {
			message: "A distância precisa ser 0 ou maior",
		})
		.optional(),
	duration: z
		.string()
		.regex(
			/^([0-9]{1,2}):([0-5][0-9]):([0-5][0-9])$/,
			"Formato de duração inválido (HH:MM:SS)",
		),
	targetPaceTime: z
		.string()
		.regex(
			/^([0-5][0-9]):([0-5][0-9])$/,
			"Formato de duração inválido (MM:SS)",
		),
	targetHr: z.number().min(50).max(220).optional(),
	// Rest Periods
	restDistanceM: z.number().optional(),
	restDuration: z
		.string()
		.regex(
			/^([0-5][0-9]):([0-5][0-9])$/,
			"Formato de duração inválido (MM:SS)",
		),
	// Actual (for completed workouts)
	actualDistanceM: z.number().positive().optional(),
	actualDurationS: z.number().positive().optional(),
	avgPaceSPerKm: z.number().positive().optional(),
	avgHr: z
		.number()
		.min(50, {
			message: "O valor deve estar entre 50 e 220",
		})
		.max(220, {
			message: "O valor deve estar entre 50 e 220",
		})
		.optional(),
	notes: z.string().optional(),
});

export const blockSchema = z.object({
	blockKind: z.enum(segmentKinds),
	repeatCount: z.number().min(1).max(50),
	orderIndex: z.number().min(0),
	description: z.string().optional(),
	segments: z.array(segmentSchema).min(1),
});

export const workoutSchema = z
	.object({
		scheduledStart: z.coerce.date(),
		runType: z.enum(trainingTypes),
		title: z.string().min(1, "O título é obrigatório").max(100),
		notes: z.string().optional(),
		// Planning
		plannedDistanceM: z.coerce.number().positive().optional(),
		duration: z
			.string()
			.regex(
				/^([0-9]{1,2}):([0-5][0-9]):([0-5][0-9])$/,
				"Formato de duração inválido (HH:MM:SS)",
			)
			.optional(),
		// Actual (for completed workouts)
		actualDistanceM: z.number().positive().optional(),
		actualDurationS: z.number().positive().optional(),
		avgPaceSPerKm: z.number().positive().optional(),
		avgHr: z.number().min(50).max(220).optional(),
		elevationGainM: z.number().min(0).optional(),
		// Structure
		segments: z.array(segmentSchema).optional(),
		blocks: z.array(blockSchema).optional(),
	})
	.refine((data) => data.segments?.length || data.blocks?.length, {
		message: "O treino precisa ter pelo menos um segmento ou um bloco",
	});

export type WorkoutFormData = z.infer<typeof workoutSchema>;
export type BlockFormData = z.infer<typeof blockSchema>;
export type SegmentFormData = z.infer<typeof segmentSchema>;

// Custon planning
export const customPlanningSchema = z
	.object({
		startDate: z.coerce.date({
			required_error: "Data inicial é obrigatória",
		}),
		endDate: z
			.union([z.string(), z.date()])
			.transform((val) => (val ? new Date(val) : undefined))
			.optional(),
		distance: z.string().min(1, "Distância deve ser maior que 0").optional(),
		duration: z
			.string()
			.regex(
				/^([0-9]{1,2}):([0-5][0-9]):([0-5][0-9])$/,
				"Formato de duração inválido (HH:MM:SS)",
			)
			.optional(),
	})
	.superRefine((data, ctx) => {
		if (data.startDate && data.endDate && data.endDate <= data.startDate) {
			ctx.addIssue({
				code: "custom",
				message: "Data final deve ser posterior à data inicial",
				path: ["endDate"],
			});
		}
	});

export type CustomPlanningFormData = z.infer<typeof customPlanningSchema>;
