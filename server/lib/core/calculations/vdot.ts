/**
 * Calcula a % de VDOT com base no tempo em segundos
 * @param timeInSeconds Tempo em segundos
 * @returns retorna um valor de 0 a 1
 */
export function calculateVDOTPercentage({
	timeInSeconds,
}: {
	timeInSeconds: number;
}): number {
	const timeInDays = timeInSeconds / 86400;

	const percentageVDOT =
		0.8 +
		0.1894393 * Math.exp(-0.012778 * timeInDays * 1440) +
		0.2989558 * Math.exp(-0.1932605 * timeInDays * 1440);
	return percentageVDOT;
}

/**
 * Calcula o VDOT com base na distância em metros, tempo em segundos e a % de VDOT
 * @param distanceM Distância em metros
 * @param durationS Tempo em segundos
 * @param VDOTPercentage Porcentagem de VDOT (0 a 1)
 * @returns Retorna o VDOT calculado
 */
export function calculateVDOT({
	distanceM,
	durationS,
	VDOTPercentage,
}: {
	distanceM: number;
	durationS: number;
	VDOTPercentage: number;
}): number {
	// Transforma o valor de tempo em segundos para dias pois a planilha
	// original do excel faz os calculos baseados no tempo em dias
	const timeInDays = durationS / 86400;
	const velocityKmPerDay = distanceM / timeInDays / 1440; // km/dia

	const VO2Numerator =
		-4.6 + 0.182258 * velocityKmPerDay + 0.000104 * velocityKmPerDay ** 2;

	const VDOT = VO2Numerator / VDOTPercentage;

	return parseFloat(VDOT.toFixed(2));
}
