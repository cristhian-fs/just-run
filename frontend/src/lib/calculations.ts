// Exibir pace como string
export function secondsToPace(totalSeconds: number): string {
  if (!isFinite(totalSeconds) || totalSeconds <= 0) return "00:00";
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}
