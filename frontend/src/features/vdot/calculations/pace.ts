export function calculatePace({
	calcVDOT,
	vdotPercentage,
	correctionFactor,
	type = "minutes",
}: {
	calcVDOT: number;
	vdotPercentage: number;
	correctionFactor: number;
	type?: "seconds" | "minutes";
}): string {
	const distanceM = 1_000;
	const intensity = calcVDOT * vdotPercentage;

	const speed = 29.54 + 5.000663 * intensity - 0.007546 * intensity ** 2;

	const timeMinutes = distanceM / speed;
	const timeSeconds = timeMinutes * 60;

	const correctedTime = timeSeconds * (1 + correctionFactor);

	const paceMinutes = Math.floor(correctedTime / 60);
	const paceSeconds = Math.round(correctedTime % 60);

	if (type === "seconds") return correctedTime.toString();

	return `${paceMinutes.toString().padStart(2, "0")}:${paceSeconds.toString().padStart(2, "0")}`;
}

export function calculatePeriodPace({
	calcVDOT,
	vdotIntensity,
}: {
	calcVDOT: number;
	vdotIntensity: number;
}): number {
	const intensity = calcVDOT * vdotIntensity;
	const speed = 29.54 + 5.000663 * intensity - 0.007546 * intensity ** 2;

	const invertedSpeed = 1 / speed;
	const timeToRunAnKilometerInMinutes = invertedSpeed * 1_000;
	const paceInSeconds = timeToRunAnKilometerInMinutes * 60;

	return Math.floor(paceInSeconds);
}

export function calculateRepetitionPace({
	intervalPaceInSeconds,
}: {
	intervalPaceInSeconds: number;
}) {
	const numberOfIntervals = 1000 / 400;
	const totalAdjustmentSeconds = numberOfIntervals * 6;

	return intervalPaceInSeconds - totalAdjustmentSeconds;
}
