import {
	MAPPED_RACE_METERS_DISTANCE,
	MAPPED_RACE_MILES_DISTANCE,
	type RaceDistanceKey,
} from "../types";

export function calculateRaceProjection({
	durationS,
	selectedDistance,
	distanceMiles,
}: {
	selectedDistance: RaceDistanceKey;
	durationS: number;
	distanceMiles: number;
}) {
	const targetDistanceInMiles = MAPPED_RACE_MILES_DISTANCE[selectedDistance];

	if (!targetDistanceInMiles) {
		throw new Error(
			`Distancia não encontrada para a corrida: ${selectedDistance}`,
		);
	}

	const raceProjectionInDays =
		durationS * (targetDistanceInMiles / distanceMiles) ** 1.06;

	return raceProjectionInDays;
}

export function calculateRacePaceProjection({
	selectedDistance,
	totalTime,
}: {
	selectedDistance: RaceDistanceKey;
	totalTime: number;
}): number {
	const distanceInKm = MAPPED_RACE_METERS_DISTANCE[selectedDistance]! / 1000;

	if (!distanceInKm) {
		throw new Error(
			`Distancia não encontrada para a corrida: ${selectedDistance}`,
		);
	}
	return totalTime / distanceInKm;
}
