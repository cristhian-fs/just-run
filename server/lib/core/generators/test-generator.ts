/* eslint-disable @typescript-eslint/no-unused-vars */
import type { TestFormData } from "@/shared/schemas";
import { type TOnboarding } from "@/shared/types/index";

import {
  estimateFCmax,
  estimateVO2,
  estimateVO2ByTestType,
} from "../calculations/performance";
import {
  calculatePaceMinKm,
  calculateVamKmh,
  formatPace,
  timeStringToSeconds,
} from "../calculations/time";
import { calculateTrainingZones } from "../calculations/zones";

/**
 * Função para gerar um teste de treino
 * @param onboarding Dados de onboarding do usuário
 * @returns Um objeto com os dados do teste
 */
export function generateTest({
  userAge,
  testData,
}: {
  userAge: number;
  testData: TestFormData;
}) {
  const timeInSeconds = timeStringToSeconds(testData.time!);
  const vam = calculateVamKmh(testData.distanceM, timeInSeconds);
  const paceMinKm = calculatePaceMinKm(testData.distanceM, timeInSeconds);
  const formattedPace = formatPace(paceMinKm);

  const fcmax = estimateFCmax(userAge);
  const [_hours, min, seconds] = testData.time.split(":").map(Number);
  const vo2Max = estimateVO2ByTestType(
    testData.testType,
    min!,
    seconds!,
  ) as number;

  const trainingZones = calculateTrainingZones(fcmax, vo2Max!);

  return {
    distanceM: testData.distanceM,
    durationS: timeInSeconds,
    vam,
    paceMinKm: formattedPace,
    fcmax,
    vo2Max,
    vo2: estimateVO2(vam),
    testType: testData.testType,
    trainingZones,
  };
}
