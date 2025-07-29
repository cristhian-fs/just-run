import { TSegmentKind } from "@/shared/types";

// Exibir pace como string
export function secondsToPace(totalSeconds: number): string {
  if (!isFinite(totalSeconds) || totalSeconds <= 0) return "00:00";
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = Math.floor(totalSeconds % 60);
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

export const formatDistance = (meters: number | null) => {
  if (!meters) return "N/A";
  return (meters / 1000).toFixed(2) + " km";
};

export const formatDuration = (seconds: number | null) => {
  if (!seconds) return "N/A";
  return Math.round(seconds / 60) + " min";
};

export const getSegmentKindLabel = (kind: TSegmentKind) => {
  const kinds: Record<TSegmentKind, string> = {
    WARMUP: "Aquecimento",
    WORK: "Trabalho",
    REST: "Descanso",
    COOLDOWN: "Desaquecimento",
    FLOAT: "Trote leve",
    PROGRESSIVE: "Progressivo",
    THRESHOLD: "Em ritmo de limiar",
  };
  return kinds[kind] || kind;
};

export const getSegmentKindColor = (kind: string) => {
  const colors: Record<string, string> = {
    WARMUP: "bg-blue-100 text-blue-800",
    WORK: "bg-red-100 text-red-800",
    REST: "bg-green-100 text-green-800",
    COOLDOWN: "bg-purple-100 text-purple-800",
  };
  return colors[kind] || "bg-gray-100 text-gray-800";
};

export const inputToSeconds = (input: string) => {
  const [hours, minutes, seconds] = input.split(":").map(Number);
  return hours * 3600 + minutes * 60 + seconds;
};

export const secondsToInputTimeValue = (seconds: number) => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secondsLeft = seconds % 60;
  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(
    secondsLeft,
  ).padStart(2, "0")}`;
};

const VDOT_COEFFICIENTS = {
  intercept: -4.6,
  speed_linear: 0.182258,
  speed_quadratic: 0.000104,
};

const VDOT_CORRECTION_COEFFICIENTS = {
  a: 0.8,
  b: 0.1894393,
  b_exp: -0.012778,
  c: 0.2989558,
  c_exp: -0.1932605,
};

export const calculateVDOT = ({
  distanceM,
  durationS,
}: {
  durationS: number;
  distanceM: number;
}) => {
  if (distanceM <= 0 || durationS <= 0) return 0;
  const speedPerMin = (distanceM / durationS) * 60;

  const vo2 =
    VDOT_COEFFICIENTS.intercept +
    VDOT_COEFFICIENTS.speed_linear * speedPerMin +
    VDOT_COEFFICIENTS.speed_quadratic * Math.pow(speedPerMin, 2);

  const timeMinutes = durationS / 60;

  const denominator =
    VDOT_CORRECTION_COEFFICIENTS.a +
    VDOT_CORRECTION_COEFFICIENTS.b *
      Math.exp(VDOT_CORRECTION_COEFFICIENTS.b_exp * timeMinutes) +
    VDOT_CORRECTION_COEFFICIENTS.c *
      Math.exp(VDOT_CORRECTION_COEFFICIENTS.c_exp * timeMinutes);

  const vdot = vo2 / denominator;

  return parseFloat(vdot.toFixed(2));
};

export const zones: {
  name: string;
  vo2Percentage: number[];
  paceInterval: string;
}[] = [
  {
    name: "Ritmo de recuperação",
    vo2Percentage: [0.6, 0.65],
    paceInterval: "",
  },
  {
    name: "Ritmo fácil",
    vo2Percentage: [0.65, 0.75],
    paceInterval: "",
  },
  {
    name: "Ritmo de maratona",
    vo2Percentage: [0.75, 0.85],
    paceInterval: "",
  },
  {
    name: "Ritmo de limiar",
    vo2Percentage: [0.88, 0.92],
    paceInterval: "",
  },
  {
    name: "Ritmo de intervalo",
    vo2Percentage: [0.95, 1],
    paceInterval: "",
  },
  {
    name: "Ritmo de repetição",
    vo2Percentage: [1, 1.05],
    paceInterval: "",
  },
];

export const getPacesPerSegment = (vdot: number) => {
  return zones.map((zone) => {
    const [minPct, maxPct] = zone.vo2Percentage;

    const paces = [minPct, maxPct].map((pct) => {
      const vo2Target = vdot * pct;

      // inverter fórmula de VO₂ para achar velocidade V
      const a = 0.000104;
      const b = 0.182258;
      const c = -4.6 - vo2Target;
      const delta = b * b - 4 * a * c;

      const V = (-b + Math.sqrt(delta)) / (2 * a); // m/min
      const paceSec = 1000 / (V / 60); // segundos por km

      return secondsToPace(paceSec);
    });

    return {
      name: zone.name,
      paceInterval: `${paces[0]} - ${paces[1]}`,
    };
  });
};

function calculatePaceForDistance(
  distanceM: number,
  vdot: number,
  effortFraction: number,
) {
  let estimatedTimeMin = distanceM / 250; // chute inicial
  let lastPace = "";

  for (let i = 0; i < 5; i++) {
    const factor =
      VDOT_CORRECTION_COEFFICIENTS.a +
      VDOT_CORRECTION_COEFFICIENTS.b *
        Math.exp(VDOT_CORRECTION_COEFFICIENTS.b_exp * estimatedTimeMin) +
      VDOT_CORRECTION_COEFFICIENTS.c *
        Math.exp(VDOT_CORRECTION_COEFFICIENTS.c_exp * estimatedTimeMin);

    const vo2 = vdot * effortFraction * factor;

    // Resolver VO2 = -4.6 + 0.182258v + 0.000104v²
    const a = VDOT_COEFFICIENTS.speed_quadratic;
    const b = VDOT_COEFFICIENTS.speed_linear;
    const c = VDOT_COEFFICIENTS.intercept - vo2;

    const delta = b ** 2 - 4 * a * c;
    if (delta < 0) return "";

    const v = (-b + Math.sqrt(delta)) / (2 * a); // m/min
    const totalTimeSec = distanceM / (v / 60);

    estimatedTimeMin = totalTimeSec / 60;
    lastPace = secondsToPace(totalTimeSec / (distanceM / 1000));
  }

  return lastPace;
}

export function calculateRacePaces(vdot: number) {
  return [
    { name: "Prova de 5km", pace: calculatePaceForDistance(5000, vdot, 1.0) },
    {
      name: "Prova de 10km",
      pace: calculatePaceForDistance(10000, vdot, 0.95),
    },
    {
      name: "Meia maratona",
      pace: calculatePaceForDistance(21097, vdot, 0.88),
    },
    { name: "Maratona", pace: calculatePaceForDistance(42195, vdot, 0.85) },
  ];
}
