/* eslint-disable @typescript-eslint/no-unused-vars */
import { type TOnboarding } from "@/shared/types/index";

import {
  estimateFCmax,
  estimateVO2,
  estimateVO2ByTestType,
} from "../calculations/performance";
import {
  calculatePaceMinKm,
  calculateVamKmh,
  timeStringToSeconds,
} from "../calculations/time";
import { calculateTrainingZones } from "../calculations/zones";

/**
 * Função para gerar um teste de treino
 * @param onboarding Dados de onboarding do usuário
 * @returns Um objeto com os dados do teste
 */
export function generateTest(onboarding: TOnboarding) {
  const timeInSeconds = timeStringToSeconds(onboarding.time!);
  const vam = calculateVamKmh(onboarding.distanceM!, timeInSeconds);
  const paceMinKm = calculatePaceMinKm(onboarding.distanceM!, timeInSeconds);

  const fcmax = estimateFCmax(onboarding.age!);
  const [_hours, min, seconds] = onboarding.time.split(":").map(Number);
  const vo2Max = estimateVO2ByTestType(onboarding.testType, min!, seconds!);

  const trainingZones = calculateTrainingZones(fcmax, vo2Max!);

  return {
    distanceM: onboarding.distanceM,
    durationS: +onboarding.time,
    vam,
    paceMinKm,
    fcmax,
    vo2Max,
    vo2: estimateVO2(vam),
    testType: onboarding.testType,
    testDate: new Date().toISOString(),
    trainingZones,
  };
}
