import type {
	RaceOption,
	TTrainingType,
	TWeekType,
	WeekAmount,
	WeekPattern,
} from "@/shared/types/training.types";

import { generateVolumeProfile } from "../core/generators/training-generator";
import type {
	MonthVolume,
	PeriodizationType,
} from "../types/periodization.types";

export const MONTH_VOLUME_BY_PERIODIZATION: Record<
	PeriodizationType,
	MonthVolume[]
> = {
	LINEAR: generateVolumeProfile("LINEAR"),
	REVERSE: generateVolumeProfile("REVERSE"),
};

export const weekPatternsByDuration: Record<WeekAmount, WeekPattern> = {
	8: [
		"INTRO", // semana 1 = introdução
		"INTRO", // semana 2 = introdução
		"TEST", // semana 3 = teste
		"BUILD", // semana 4 = intensificador
		"BASE", // semana 5 = deload/recuperativo
		"BUILD", // semana 6 = intensificador
		"PEAK", // semana 7 = pre-competitivo
		"COMPETITION", // semana 8 = competitivo
	],
	12: [
		"INTRO", // semana 1
		"TEST", // semana 2
		"DELOAD", // semana 3
		"BUILD", // semana 4
		"BUILD", // semana 5
		"DELOAD", // semana 6
		"BUILD", // semana 7
		"BUILD", // semana 8
		"DELOAD", // semana 9
		"TEST", // semana 10
		"PEAK", // semana 11
		"COMPETITION", // semana 12
	],
	16: [
		"INTRO", // semana 1
		"INTRO", // semana 2
		"TEST", // semana 3
		"DELOAD", // semana 4
		"BUILD", // semana 5
		"BASE", // semana 6
		"BUILD", // semana 7
		"DELOAD", // semana 8
		"BUILD", // semana 9
		"BASE", // semana 10
		"BUILD", // semana 11
		"BASE", // semana 12
		"TEST", // semana 13
		"PEAK", // semana 14
		"PEAK", // semana 15
		"COMPETITION", // semana 16
	],
	20: [
		"INTRO", // semana 1
		"INTRO", // semana 2
		"TEST", // semana 3
		"DELOAD", // semana 4
		"BUILD", // semana 5
		"BASE", // semana 6
		"BUILD", // semana 7
		"DELOAD", // semana 8
		"TEST", // semana 9
		"BASE", // semana 10
		"BUILD", // semana 11
		"DELOAD", // semana 12
		"BUILD", // semana 13
		"BASE", // semana 14
		"BUILD", // semana 15
		"DELOAD", // semana 16
		"TEST", // semana 17
		"PEAK", // semana 18
		"PEAK", // semana 19
		"COMPETITION", // semana 20
	],
	24: [
		"INTRO", // semana 1
		"INTRO", // semana 2
		"TEST", // semana 3
		"DELOAD", // semana 4
		"BUILD", // semana 5
		"BASE", // semana 6
		"BUILD", // semana 7
		"DELOAD", // semana 8
		"TEST", // semana 9
		"BASE", // semana 10
		"BUILD", // semana 11
		"DELOAD", // semana 12
		"TEST", // semana 13
		"BASE", // semana 14
		"BUILD", // semana 15
		"DELOAD", // semana 16
		"BUILD", // semana 17
		"BASE", // semana 18
		"BUILD", // semana 19
		"DELOAD", // semana 20
		"TEST", // semana 21
		"PEAK", // semana 22
		"PEAK", // semana 23
		"COMPETITION", // semana 24
	],
};

export const getFartlekOrThresholdRun = (): TTrainingType => {
	const options: TTrainingType[] = ["FARTLEK", "THRESHOLD_RUN"];
	// biome-ignore lint/style/noNonNullAssertion: will ever have a value
	return options[Math.floor(Math.random() * options.length)]!;
};

export const getPeriodizationByRaceType = (
	raceType: RaceOption,
): PeriodizationType => {
	if (raceType !== "42K") return "LINEAR";
	return "REVERSE";
};

export function getWeekTypeByWeeks(
	weeks: WeekAmount,
	weekIndex: number,
): TWeekType | undefined {
	const pattern = weekPatternsByDuration[weeks];
	return pattern?.[weekIndex];
}
