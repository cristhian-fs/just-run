import type { Block, TrainingLevel, Workout } from "@/shared/types";
import type { TrainingUnit } from "@/lib/types";

import { formatPace } from "../../calculations/time";
import { getPace } from "../../calculations/zones";

interface ProgressiveRunInput {
  date: Date;
  vam: number;
  level: TrainingLevel;
  unit: TrainingUnit;
  targetVolume: number;
}

export function generateProgressiveWorkout({
  level,
  vam,
  unit,
  date,
  targetVolume,
}: ProgressiveRunInput): Workout {
  /* Definições de zona (fração da VAM) */
  const ZONES = {
    Z1: 0.65,
    Z2: 0.75,
    Z3: 0.85,
    Z4: 0.92,
  } as const;

  /* Quantas fases */
  const phases: { zoneKey: keyof typeof ZONES }[] =
    level === "beginner"
      ? [{ zoneKey: "Z1" }, { zoneKey: "Z2" }, { zoneKey: "Z3" }]
      : [
          { zoneKey: "Z1" },
          { zoneKey: "Z2" },
          { zoneKey: "Z3" },
          { zoneKey: "Z4" },
        ];

  /* Converter volume total para base de cálculo */
  const total = unit === "KM" ? targetVolume * 1_000 : targetVolume * 60;

  /* divisão simples: fases iguais, mas a última recebe
     volume ligeiramente maior (20%) para mantert qualidade */
  const basePart = total / phases.length;
  const lastFactor = 0.8;
  const parts = phases.map((_, i) =>
    i === phases.length - 1 ? basePart * lastFactor : basePart,
  );

  /* reajusta soma (caso tenha sobrado) na penúltima parte */
  const diff = total - parts.reduce((a, b) => a + b, 0);
  if (diff !== 0) parts[parts.length - 2]! += diff;

  /* Montagem dos blocos */
  let order = 1;
  const blocks: Block[] = phases.map((ph, idx) => {
    const part = parts[idx];
    const v = vam * ZONES[ph.zoneKey];
    const paceS = Math.round(3600 / v);

    return {
      blockKind: "WORK",
      repeatCount: 1,
      orderIndex: order++,
      description:
        `${ph.zoneKey} (${Math.round(ZONES[ph.zoneKey] * 100)} % VAM) | ` +
        (unit === "KM"
          ? `${(part! / 1000).toFixed(1)} km`
          : `${Math.round(part! / 60)} min`) +
        ` | pace ${formatPace(getPace(v))}`,
      segments: [
        unit === "KM"
          ? {
              segmentKind: ph.zoneKey === "Z1" ? "WARMUP" : "WORK",
              orderInBlock: 1,
              plannedDistanceM: part,
              targetPaceSPerKm: paceS,
            }
          : {
              segmentKind: ph.zoneKey === "Z1" ? "WARMUP" : "WORK",
              orderInBlock: 1,
              plannedDurationS: part,
              targetPaceSPerKm: paceS,
            },
      ],
    };
  });

  /* Objeto workout */

  return {
    runType: "PROGRESSIVE_RUN",
    scheduledStart: date,
    title:
      `Corrida Progressiva (${phases.length} fases, ` +
      `${unit === "KM" ? `${targetVolume} km` : `${targetVolume} min`})`,
    blocks,
    ...(unit === "KM"
      ? { plannedDistanceM: targetVolume * 1_000 }
      : { plannedDurationS: targetVolume * 60 }),
    notes:
      `Progressivo de ${phases.length} fases ` +
      `(Z1→Z${phases[phases.length - 1]!.zoneKey.slice(1)}) ` +
      `partindo de ${Math.round(ZONES.Z1 * 100)} % até ` +
      `${Math.round(ZONES[phases.at(-1)!.zoneKey] * 100)} % da VAM.`,
  };
}
