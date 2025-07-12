import { TSegmentKind } from "@/shared/types";

// Exibir pace como string
export function secondsToPace(totalSeconds: number): string {
  if (!isFinite(totalSeconds) || totalSeconds <= 0) return "00:00";
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
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
