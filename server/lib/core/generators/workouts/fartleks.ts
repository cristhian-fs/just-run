import type { TrainingLevel, Workout } from "@/shared/types";
import type { FartlekOptions } from "@/lib/types";

import { estimateVelocitiesFromTest, getPace } from "../../calculations/zones";

const REST_MULTIPLIER_BY_LEVEL: Record<TrainingLevel, number> = {
  beginner: 2,
  intermediate: 1.5,
  advanced: 1,
};

export function generateFartlekWorkout(opts: FartlekOptions): Workout {
  const velocities = estimateVelocitiesFromTest({
    distanceM: opts.lastUserTestData.distanceM,
    durationS: opts.lastUserTestData.durationS,
    decayK: 1.06,
    vam: opts.vam,
  });

  const templates: Workout[] = [
    {
      scheduledStart: new Date(),
      runType: "FARTLEK",
      title: "Intervalado de cruzeiro",
      blocks: [
        {
          blockKind: "WARMUP",
          repeatCount: 1,
          orderIndex: 1,
          description: "10:00 Aquecimento",
          segments: [
            {
              segmentKind: "WARMUP",
              orderInBlock: 1,
              plannedDurationS: 60 * 10,
            },
          ],
        },
        {
          blockKind: "WORK",
          repeatCount: 10,
          orderIndex: 2,
          description: "10 repetições de 2 minutos",
          segments: [
            {
              segmentKind: "WORK",
              orderInBlock: 1,
              plannedDurationS: 120,
              targetPaceSPerKm: Math.round(3600 / getPace(velocities.v21k) - 5),
            },
            {
              segmentKind: "FLOAT",
              orderInBlock: 2,
              plannedDurationS: 60,
              restDurationS: 60,
              targetPaceSPerKm: Math.round(3600 / (opts.vam * 0.6)),
            },
          ],
        },
        {
          blockKind: "COOLDOWN",
          repeatCount: 1,
          orderIndex: 3,
          description: "10:00 Desaquecimento",
          segments: [
            {
              segmentKind: "COOLDOWN",
              orderInBlock: 1,
              plannedDurationS: 60 * 10,
            },
          ],
        },
      ],
    },
    {
      scheduledStart: new Date(),
      runType: "FARTLEK",
      title: "Estimular velocidade - Sensação progressiva",
      notes:
        "Sentir o feeling do fartlek, entender como o corpo reage a cada velocidade",
      blocks: [
        {
          blockKind: "WARMUP",
          repeatCount: 1,
          orderIndex: 1,
          description: "10:00 Aquecimento",
          segments: [
            {
              segmentKind: "WARMUP",
              orderInBlock: 1,
              plannedDurationS: 60 * 10,
            },
          ],
        },
        {
          blockKind: "WORK",
          repeatCount: 1,
          orderIndex: 2,
          description: "6 minutos - v10000",
          segments: [
            {
              segmentKind: "WORK",
              orderInBlock: 1,
              plannedDurationS: 6 * 60,
              targetPaceSPerKm: Math.round(3600 / getPace(velocities.v10k)),
            },
            {
              segmentKind: "FLOAT",
              orderInBlock: 2,
              plannedDurationS: Math.round(
                60 * REST_MULTIPLIER_BY_LEVEL[opts.level],
              ),
              targetPaceSPerKm: Math.round(3600 / (opts.vam * 0.6)),
            },
          ],
        },
        {
          blockKind: "WORK",
          repeatCount: 1,
          orderIndex: 3,
          description: "5 minutos - -5s da velocidade - v10000",
          segments: [
            {
              segmentKind: "WORK",
              orderInBlock: 1,
              plannedDurationS: 5 * 60,
              targetPaceSPerKm: Math.round(3600 / getPace(velocities.v10k) - 5),
            },
            {
              segmentKind: "FLOAT",
              orderInBlock: 2,
              plannedDurationS: Math.round(
                60 * REST_MULTIPLIER_BY_LEVEL[opts.level],
              ),
              targetPaceSPerKm: Math.round(3600 / (opts.vam * 0.6)),
            },
          ],
        },
        {
          blockKind: "WORK",
          repeatCount: 1,
          orderIndex: 4,
          description: "4 minutos - v5000",
          segments: [
            {
              segmentKind: "WORK",
              orderInBlock: 1,
              plannedDurationS: 4 * 60,
              targetPaceSPerKm: Math.round(3600 / getPace(velocities.v5000)),
            },
            {
              segmentKind: "FLOAT",
              orderInBlock: 2,
              plannedDurationS: Math.round(
                60 * REST_MULTIPLIER_BY_LEVEL[opts.level],
              ),
              targetPaceSPerKm: Math.round(3600 / (opts.vam * 0.6)),
            },
          ],
        },
        {
          blockKind: "WORK",
          repeatCount: 1,
          orderIndex: 5,
          description: "3 minutos - v5000",
          segments: [
            {
              segmentKind: "WORK",
              orderInBlock: 1,
              plannedDurationS: 3 * 60,
              targetPaceSPerKm: Math.round(3600 / getPace(velocities.v5000)),
            },
            {
              segmentKind: "FLOAT",
              orderInBlock: 2,
              plannedDurationS: Math.round(
                60 * REST_MULTIPLIER_BY_LEVEL[opts.level],
              ),
              targetPaceSPerKm: Math.round(3600 / (opts.vam * 0.6)),
            },
          ],
        },
        {
          blockKind: "WORK",
          repeatCount: 1,
          orderIndex: 6,
          description: "2 minutos - v3000",
          segments: [
            {
              segmentKind: "WORK",
              orderInBlock: 1,
              plannedDurationS: 2 * 60,
              targetPaceSPerKm: Math.round(3600 / getPace(velocities.v3000)),
            },
            {
              segmentKind: "FLOAT",
              orderInBlock: 2,
              plannedDurationS: Math.round(
                60 * REST_MULTIPLIER_BY_LEVEL[opts.level],
              ),
              targetPaceSPerKm: Math.round(3600 / (opts.vam * 0.6)),
            },
          ],
        },
        {
          blockKind: "WORK",
          repeatCount: 10,
          orderIndex: 7,
          description: "1 minuto - v1500",
          segments: [
            {
              segmentKind: "WORK",
              orderInBlock: 1,
              plannedDurationS: 1 * 60,
              targetPaceSPerKm: Math.round(3600 / getPace(velocities.v1500)),
            },
            {
              segmentKind: "FLOAT",
              orderInBlock: 2,
              plannedDurationS: Math.round(
                60 * REST_MULTIPLIER_BY_LEVEL[opts.level],
              ),
              targetPaceSPerKm: Math.round(3600 / (opts.vam * 0.6)),
            },
          ],
        },
        {
          blockKind: "COOLDOWN",
          repeatCount: 1,
          orderIndex: 3,
          description: "10:00 Desaquecimento",
          segments: [
            {
              segmentKind: "COOLDOWN",
              orderInBlock: 1,
              plannedDurationS: 60 * 10,
            },
          ],
        },
      ],
    },
    {
      scheduledStart: new Date(),
      runType: "FARTLEK",
      title: "Intervalado de cruzeiro",
      blocks: [
        {
          blockKind: "WARMUP",
          repeatCount: 1,
          orderIndex: 1,
          description: "10:00 Aquecimento",
          segments: [
            {
              segmentKind: "WARMUP",
              orderInBlock: 1,
              plannedDurationS: 60 * 10,
            },
          ],
        },
        {
          blockKind: "WORK",
          repeatCount: 4,
          orderIndex: 2,
          description: "4 repetições do bloco",
          segments: [
            {
              segmentKind: "WORK",
              orderInBlock: 1,
              plannedDurationS: 120,
              notes: ["2 minutos correndo na velocidade v10000"],
              targetPaceSPerKm: Math.round(3600 / getPace(velocities.v10k)),
            },
            {
              segmentKind: "FLOAT",
              orderInBlock: 2,
              plannedDurationS: Math.round(
                60 * REST_MULTIPLIER_BY_LEVEL[opts.level],
              ),
              notes: ["Descanso trotando leve"],
              targetPaceSPerKm: Math.round(3600 / (opts.vam * 0.6)),
            },
            {
              segmentKind: "WORK",
              orderInBlock: 3,
              plannedDurationS: 60,
              notes: ["1min correndo na velocidade v5000"],
              targetPaceSPerKm: Math.round(3600 / getPace(velocities.v5000)),
            },
            {
              segmentKind: "FLOAT",
              orderInBlock: 4,
              plannedDurationS: Math.round(
                60 * REST_MULTIPLIER_BY_LEVEL[opts.level],
              ),
              notes: ["Descanso trotando leve"],
              targetPaceSPerKm: Math.round(3600 / (opts.vam * 0.6)),
            },
            {
              segmentKind: "WORK",
              orderInBlock: 5,
              plannedDurationS: 30,
              notes: ["30s correndo na velocidade v3000"],
              targetPaceSPerKm: Math.round(3600 / getPace(velocities.v3000)),
            },
            {
              segmentKind: "FLOAT",
              orderInBlock: 6,
              plannedDurationS: Math.round(
                60 * REST_MULTIPLIER_BY_LEVEL[opts.level],
              ),
              notes: ["Descanso trotando leve"],
              targetPaceSPerKm: Math.round(3600 / (opts.vam * 0.6)),
            },
          ],
        },
        {
          blockKind: "COOLDOWN",
          repeatCount: 1,
          orderIndex: 3,
          description: "10:00 Desaquecimento",
          segments: [
            {
              segmentKind: "COOLDOWN",
              orderInBlock: 1,
              plannedDurationS: 60 * 10,
            },
          ],
        },
      ],
    },
  ];

  const randomIndex = Math.floor(Math.random() * templates.length);

  return templates[randomIndex] as Workout;
}
