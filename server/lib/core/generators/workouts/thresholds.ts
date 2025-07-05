import type { Block, TrainingLevel, Workout } from "@/shared/types";
import type { TrainingUnit } from "@/lib/types";

import { formatPace } from "../../calculations/time";
import { getPace } from "../../calculations/zones";

interface ThresholdRunInput {
  date: Date;
  level?: TrainingLevel; // default: intermediate
  vam?: number; // km/h – default: 14
  targetVolume: number; // valor numérico na unidade escolhida
  unit: TrainingUnit; // "KM" → distância, "MINUTES" → tempo
}

export function generateThresholdRun({
  date,
  level = "intermediate",
  vam = 14,
  targetVolume,
  unit,
}: ThresholdRunInput): Workout {
  /* ---------- 1. FRAÇÕES FIXAS ---------- */
  const FRACTION_WU = 0.2; // 20 %
  const FRACTION_CD = 0.15; // 15 %
  const LT_FRAC: Record<TrainingLevel, number> = {
    beginner: 0.88,
    intermediate: 0.92,
    advanced: 0.94,
  };

  /* ---------- 2. CONVERSÃO UNIDADE → METROS/SEGUNDOS ---------- */
  let totalDistanceM = 0;
  let totalDurationS = 0;

  if (unit === "KM") {
    totalDistanceM = Math.round(targetVolume * 1_000);
  } else {
    totalDurationS = Math.round(targetVolume * 60);
  }

  /* ---------- 3. DIMENSIONAMENTO ---------- */
  const warmupPart =
    unit === "KM"
      ? Math.round(totalDistanceM * FRACTION_WU)
      : Math.round(totalDurationS * FRACTION_WU);

  const cooldownPart =
    unit === "KM"
      ? Math.round(totalDistanceM * FRACTION_CD)
      : Math.round(totalDurationS * FRACTION_CD);

  const thresholdPart =
    unit === "KM"
      ? Math.round(totalDistanceM - warmupPart - cooldownPart)
      : Math.round(totalDurationS - warmupPart - cooldownPart);

  /* ---------- 4. VELOCIDADES & PACES ---------- */
  const vWarm = vam * 0.65;
  const vLact = vam * LT_FRAC[level];
  const paceWarmS = Math.round(3600 / vWarm);
  const paceLactS = Math.round(3600 / vLact);

  /* ---------- 5. BLOCOS ---------- */
  const blocks: Block[] = [];

  // warm‑up
  blocks.push({
    blockKind: "WARMUP",
    repeatCount: 1,
    orderIndex: 1,
    description: `Aquecimento | Pace ${formatPace(getPace(vWarm))}`,
    segments: [
      unit === "KM"
        ? {
            segmentKind: "WARMUP",
            orderInBlock: 1,
            plannedDistanceM: Math.round(warmupPart),
            targetPaceSPerKm: Math.round(paceWarmS),
          }
        : {
            segmentKind: "WARMUP",
            orderInBlock: 1,
            plannedDurationS: Math.round(warmupPart),
            targetPaceSPerKm: Math.round(paceWarmS),
          },
    ],
  });

  // work (threshold)
  blocks.push({
    blockKind: "WORK",
    repeatCount: 1,
    orderIndex: 2,
    description: `Limiar contínuo | Pace ${formatPace(getPace(vLact))}`,
    segments: [
      unit === "KM"
        ? {
            segmentKind: "WORK",
            orderInBlock: 1,
            plannedDistanceM: thresholdPart,
            targetPaceSPerKm: paceLactS,
          }
        : {
            segmentKind: "WORK",
            orderInBlock: 1,
            plannedDurationS: thresholdPart,
            targetPaceSPerKm: paceLactS,
          },
    ],
  });

  // cool‑down
  blocks.push({
    blockKind: "COOLDOWN",
    repeatCount: 1,
    orderIndex: 3,
    description: `Desaquecimento | Pace ${formatPace(getPace(vWarm))}`,
    segments: [
      unit === "KM"
        ? {
            segmentKind: "COOLDOWN",
            orderInBlock: 1,
            plannedDistanceM: cooldownPart,
            targetPaceSPerKm: paceWarmS,
          }
        : {
            segmentKind: "COOLDOWN",
            orderInBlock: 1,
            plannedDurationS: cooldownPart,
            targetPaceSPerKm: paceWarmS,
          },
    ],
  });

  /* ---------- 6. OBJETO WORKOUT ---------- */
  return {
    runType: "THRESHOLD_RUN",
    scheduledStart: date,
    title: "Treino de limiar/ritmado",
    blocks,
    ...(unit === "KM"
      ? { plannedDistanceM: totalDistanceM }
      : { plannedDurationS: totalDurationS }),
    notes: `Treino de limiar (${unit === "KM" ? `${targetVolume} km` : `${targetVolume} min`}) em ${formatPace(getPace(paceLactS))}.`,
  };
}
