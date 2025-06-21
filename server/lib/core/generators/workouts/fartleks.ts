/* eslint-disable @typescript-eslint/no-unused-vars */
import { FARTLEK_PATTERNS } from "@/lib/config/workouts.contants";
import type {
  FartlekOptions,
  FartlekSegment,
  FartlekTemplate,
  GeneratedFartlek,
} from "@/lib/types";

import { calculatePace } from "../../calculations/time";

const EFFORT_VAM_MAPPING: Record<FartlekSegment["effort"], number> = {
  EASY: 0.65, // 65% VAM - Zona 1-2
  MODERATE: 0.78, // 78% VAM - Zona 3
  HARD: 0.88, // 88% VAM - Zona 4
  VERY_HARD: 0.95, // 95% VAM - Zona 5
};

function estimateSegmentDuration(segment: FartlekSegment, vam: number): number {
  if (segment.duration) {
    return segment.duration;
  }

  if (segment.distance) {
    const intensity = EFFORT_VAM_MAPPING[segment.effort];
    const pace = calculatePace(vam, intensity);
    return (segment.distance / 1000) * pace;
  }

  return 0;
}

// Função para calcular volume total de um template
function calculateTemplateVolume(template: FartlekTemplate): number {
  return template.segments.reduce((total, segment) => {
    if (template.unit === "MINUTES") {
      return total + (segment.duration || 0);
    } else {
      return total + (segment.distance || 0) / 1000; // converter para km
    }
  }, 0);
}

// Função para calcular volume intenso de um template
function calculateTemplateIntenseVolume(template: FartlekTemplate): number {
  return template.segments
    .filter(
      (segment) => segment.effort === "HARD" || segment.effort === "VERY_HARD",
    )
    .reduce((total, segment) => {
      if (template.unit === "MINUTES") {
        return total + (segment.duration || 0);
      } else {
        return total + (segment.distance || 0) / 1000;
      }
    }, 0);
}

export function generateFartlekWorkout(opts: FartlekOptions): GeneratedFartlek {
  // Filtra por nível e unidade
  const filtered = FARTLEK_PATTERNS.filter(
    (fartlek) => fartlek.level === opts.level && fartlek.unit === opts.unit,
  );

  if (filtered.length === 0) {
    throw new Error(
      `Nenhum template de Fartlek encontrado para nível ${opts.level} e unidade ${opts.unit}.`,
    );
  }

  // Escolher aleatoriamente
  const base = filtered[Math.floor(Math.random() * filtered.length)];

  if (!base) return;

  // Calcular volumes do template base
  const baseVolume = calculateTemplateVolume(base!);
  const baseIntenseVolume = calculateTemplateIntenseVolume(base!);

  // Calcular fatores de escala
  const volumeScaleFactor = opts.volume / baseVolume;
  const intenseScaleFactor = opts.intenseKms / baseIntenseVolume;

  // Usar o menor fator para manter proporções e não exceder limites
  const primaryScaleFactor = Math.min(
    volumeScaleFactor,
    intenseScaleFactor * 1.2,
  );

  // Gerar segmentos finais escalados
  const segmentsFinal: FartlekSegment[] = base?.segments.map((segment) => {
    const newSegment: FartlekSegment = { ...segment };

    if (opts.unit === "MINUTES" && segment.duration) {
      // Escalar duração
      newSegment.duration =
        Math.round(segment.duration * primaryScaleFactor * 10) / 10;

      // Ajustar segmentos intensos se necessário
      if (
        (segment.effort === "HARD" || segment.effort === "VERY_HARD") &&
        intenseScaleFactor > volumeScaleFactor
      ) {
        newSegment.duration =
          Math.round(segment.duration * intenseScaleFactor * 10) / 10;
      }
    } else if (opts.unit === "KM" && segment.distance) {
      // Escalar distância
      newSegment.distance = Math.round(segment.distance * primaryScaleFactor);

      // Ajustar segmentos intensos se necessário
      if (
        (segment.effort === "HARD" || segment.effort === "VERY_HARD") &&
        intenseScaleFactor < volumeScaleFactor
      ) {
        newSegment.distance = Math.round(segment.distance * intenseScaleFactor);
      }
    }

    return newSegment;
  });

  // Calcular volumes finais
  const finalVolume = calculateTemplateVolume(
    { ...base, segments: segmentsFinal },
    opts.vam,
  );

  const finalIntenseVolume = calculateTemplateIntenseVolume({
    ...base,
    segments: segmentsFinal,
  });

  // Ajuste fino para aproximar do volume alvo
  const volumeDifference = opts.volume - finalVolume;

  if (Math.abs(volumeDifference) > 0.5) {
    // Adicionar ou remover volume nos segmentos EASY
    const easySegments = segmentsFinal.filter((s) => s.effort === "EASY");

    if (easySegments.length > 0) {
      const adjustmentPerSegment = volumeDifference / easySegments.length;

      easySegments.forEach((segment) => {
        if (opts.unit === "MINUTES" && segment.duration) {
          segment.duration = Math.max(
            0.5,
            segment.duration + adjustmentPerSegment,
          );
          segment.duration = Math.round(segment.duration * 10) / 10;
        } else if (opts.unit === "KM" && segment.distance) {
          segment.distance = Math.max(
            100,
            segment.distance + adjustmentPerSegment * 1000,
          );
          segment.distance = Math.round(segment.distance / 50) * 50; // Arredondar para 50m
        }
      });
    }

    const hardSegments = segmentsFinal.filter(
      (s) => s.effort === "HARD" || s.effort === "VERY_HARD",
    );

    if (hardSegments.length > 0) {
      const adjustmentPerSegment = volumeDifference / hardSegments.length;

      hardSegments.forEach((segment) => {
        if (opts.unit === "MINUTES" && segment.duration) {
          segment.duration = Math.max(
            0.5,
            segment.duration - adjustmentPerSegment,
          );
          segment.duration = Math.round(segment.duration * 10) / 10;
        } else if (opts.unit === "KM" && segment.distance) {
          segment.distance = Math.max(
            100,
            segment.distance - adjustmentPerSegment * 1000,
          );
          segment.distance = Math.round(segment.distance / 50) * 50; // Arredondar para 50m
        }
      });
    }

    const moderateSegments = segmentsFinal.filter(
      (s) => s.effort === "MODERATE",
    );

    if (moderateSegments.length > 0) {
      const adjustmentPerSegment = volumeDifference / moderateSegments.length;

      moderateSegments.forEach((segment) => {
        if (opts.unit === "MINUTES" && segment.duration) {
          segment.duration = Math.max(
            0.5,
            segment.duration - adjustmentPerSegment,
          );
          segment.duration = Math.round(segment.duration * 10) / 10;
        } else if (opts.unit === "KM" && segment.distance) {
          segment.distance = Math.max(
            100,
            segment.distance - adjustmentPerSegment * 1000,
          );
          segment.distance = Math.round(segment.distance / 50) * 50; // Arredondar para 50m
        }
      });
    }
  }

  // Recalcular volumes finais após ajuste
  const adjustedFinalVolume = calculateTemplateVolume({
    ...base,
    segments: segmentsFinal,
  });

  const adjustedFinalIntenseVolume = calculateTemplateIntenseVolume({
    ...base,
    segments: segmentsFinal,
  });

  return {
    name: `${base.name} (Personalizado)`,
    level: opts.level,
    unit: opts.unit,
    segments: segmentsFinal,
    totalVolume: Math.round(adjustedFinalVolume * 10) / 10,
    intenseVolume: Math.round(adjustedFinalIntenseVolume * 10) / 10,
    basedOn: base.name,
  };
}
// Função auxiliar para validar se o fartlek gerado atende aos critérios
export function validateFartlekOutput(
  generated: GeneratedFartlek,
  target: FartlekOptions,
  tolerance: { volume: number; intense: number } = {
    volume: 0.8,
    intense: 0.3,
  },
): { valid: boolean; issues: string[] } {
  const issues: string[] = [];

  const volumeDiff = Math.abs(generated.totalVolume - target.volume);
  const intenseDiff = Math.abs(generated.intenseVolume - target.intenseKms);

  if (volumeDiff > tolerance.volume) {
    issues.push(
      `Volume total fora da tolerância: ${generated.totalVolume} vs ${target.volume}`,
    );
  }

  if (intenseDiff > tolerance.intense) {
    issues.push(
      `Volume intenso fora da tolerância: ${generated.intenseVolume} vs ${target.intenseKms}`,
    );
  }

  // Verificar metodologia 80/20
  const intensePercentage =
    (generated.intenseVolume / generated.totalVolume) * 100;
  if (intensePercentage > 25) {
    issues.push(
      `Porcentagem de treino intenso muito alta: ${intensePercentage.toFixed(1)}%`,
    );
  }

  return {
    valid: issues.length === 0,
    issues,
  };
}
