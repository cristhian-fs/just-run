export function getAerobicHeartRace({
	marathonHr,
	easyMaxHr,
	type,
}: {
	marathonHr: number;
	easyMaxHr: number;
	type: "moderate" | "high";
}): number {
	const coefficient = type === "moderate" ? 0.3333 : 0.6667;

	const hr = easyMaxHr + (marathonHr - easyMaxHr) * coefficient;

	return parseFloat(hr.toFixed(2));
}

export function getHeartRateBPM({
	hrMaxPercentage,
	maxHr,
}: {
	hrMaxPercentage: number;
	maxHr: number;
}): number {
	return hrMaxPercentage * maxHr;
}

export function getHeartRateReserve({
	hrBPM,
	hrMax,
	restHRBPM,
}: {
	hrBPM: number;
	restHRBPM: number;
	hrMax: number;
}): number {
	const hrReserve = (hrBPM - restHRBPM) / (hrMax - restHRBPM);
	return parseFloat(hrReserve.toFixed(2));
}

export function getHrMaxPercentage({
	hrZonePercentage,
	hrZoneProfile,
	hrZoneTweak = 0,
}: {
	hrZoneProfile: 1 | 2 | 3 | 4;
	hrZoneTweak: number;
	hrZonePercentage: number;
}): number {
	switch (hrZoneProfile) {
		case 1:
			return Math.min(
				1,
				(0.855 * hrZonePercentage + 0.1578) * (1 + hrZoneTweak),
			);
		case 2:
			return Math.min(1, (hrZonePercentage + 0.293 / 1.3) * (1 + hrZoneTweak));
		case 3:
			return Math.min(
				1,
				(hrZonePercentage + 0.345 / 1.303) * (1 + hrZoneTweak),
			);
		case 4:
			return Math.min(
				1,
				(0.6463 * hrZonePercentage + 0.37182) * (1 + hrZoneTweak),
			);
	}
}
