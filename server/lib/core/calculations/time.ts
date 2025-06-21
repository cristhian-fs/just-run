export function timeStringToSeconds(time: string): number {
  const [h = "0", m = "0", s = "0"] = time.split(":");
  return Number(h) * 3600 + Number(m) * 60 + Number(s);
}

export function secondsToTimeString(totalSeconds: number): string {
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = totalSeconds % 60;
  return [h, m, s].map((v) => String(v).padStart(2, "0")).join(":");
}

export function calculateVamKmh(
  distanceMeters: number,
  timeSeconds: number,
): number {
  const distanceKm = distanceMeters / 1000;
  const timeHours = timeSeconds / 3600;
  return Number((distanceKm / timeHours).toFixed(2)); // km/h
}

// De pace para km/h
export function paceToKmh(minPerKm: number): number {
  return +(60 / minPerKm).toFixed(2);
}

// De km/h para pace (em minutos por km)
export function kmhToPace(kmh: number): number {
  return +(60 / kmh).toFixed(2); // minutos/km
}

// Exibir pace como string
export function formatPace(paceDecimal: number): string {
  if (!isFinite(paceDecimal) || paceDecimal <= 0) return "00:00";
  const totalSeconds = Math.round(paceDecimal * 60);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

// Calcula o pace em minutos por km
export function calculatePaceMinKm(distanceM: number, timeS: number): number {
  const pace = timeS / 60 / (distanceM / 1000);
  return +pace.toFixed(2);
}

export function calculatePace(vam: number, intensity: number): number {
  const speedKmh = vam * intensity;
  return 60 / speedKmh; // minutos por km
}
