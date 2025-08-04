/**
 * Calcula a diferença percentual entre o pace da maratona
 * e o pace estimado para uma zona alvo com base no VDOT.
 *
 * @param marathonPaceMinPerMile Pace da maratona (min/milha)
 * @param vdot VDOT do atleta
 * @param zoneCorrection Fator de correção para a zona-alvo (ex: 0.92 para zona 5k, etc)
 * @returns Diferença percentual (ex: 0.063 = 6.3%)
 */
export function calculateAerobicZonePaceDifference({
  marathonPaceMinPerMile,
  vdot,
  zoneCorrection,
}: {
  marathonPaceMinPerMile: number;
  vdot: number;
  zoneCorrection: number;
}): number {
  const adjustedVDOT = vdot * zoneCorrection;

  // Velocidade estimada (m/s)
  const estimatedSpeed =
    29.54 + 5.000663 * adjustedVDOT - 0.007546 * Math.pow(adjustedVDOT, 2);

  // Pace para 1 milha em dias
  const paceForZoneKm = 1000 / estimatedSpeed / 1440;

  // Diferença percentual entre o pace da maratona e o da zona
  const paceDifference =
    (marathonPaceMinPerMile - paceForZoneKm) / paceForZoneKm;

  return paceDifference;
}
