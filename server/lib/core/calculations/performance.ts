import type { TrainingLevel, TTestType } from "@/shared/types";

export function estimateVo2max(
	distanceMeters: number,
	timeSeconds: number,
): number {
	const speedMps = distanceMeters / timeSeconds;
	return +(15.3 * (speedMps / 0.44704)).toFixed(2); // Conversão para mph
}

export function estimateFCmax(age: number): number {
	return +(208.75 - 0.73 * age).toFixed(2);
}

export function calculateIMC(weightKg: number, heightCm: number): number {
	return +(weightKg / (heightCm / 100) ** 2).toFixed(2);
}

export function estimateVO2(vam: number): number {
	return +(vam * 3.5).toFixed(1);
}

export function estimateVO2ByTestType(
	testType: TTestType,
	timeMin: number,
	timeSec: number,
): number | undefined {
	const timeDecimal = timeMin + timeSec / 60;

	switch (testType) {
		case "1600m":
			return (1600 / timeDecimal) * 0.177 + 8.101;
		case "2400m":
			return 480 / timeDecimal + 3.5;
		case "3200m":
			return 118.4 - 4.774 * timeDecimal;
		case "3000m":
			return (3000 / (timeDecimal * 60)) * 12 + 3.5;
		case "5000m":
			return timeDecimal * 3.5 + 1.05;
		default:
			return undefined; // ou lançar erro
	}
}

export function getAthleteLevel(weeklyKm: number): TrainingLevel {
	if (weeklyKm < 25) return "beginner";
	if (weeklyKm < 50) return "intermediate";
	return "advanced";
}
