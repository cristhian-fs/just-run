import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function timeStringToMinutes(time: string): number {
  const [min, sec] = time.split(":").map(Number);
  if (isNaN(min) || isNaN(sec)) return 0;
  return parseFloat((min + sec / 60).toFixed(2));
}

export function minutesToTimeString(minutes: number): string {
  const min = Math.floor(minutes);
  const sec = Math.round((minutes - min) * 60);
  return `${min}:${sec.toString().padStart(2, "0")}`;
}

export function formatToHHMMSS(input: string): string {
  // return input
  //   .toString()
  //   .replace(/\D/g, "")
  //   .replace(/(\d{2})(\d{2})(\d{2})\d+?$/, "$1:$2:$3");
  return input
    .toString()
    .replace(/\D/g, "") // Remove tudo que não for dígito
    .replace(/(\d{2})(\d)/, "$1:$2") // Insere o primeiro ":"
    .replace(/(\d{2}:\d{2})(\d)/, "$1:$2") // Insere o segundo ":"
    .replace(/(:\d{2})\d+?$/, "$1"); // Limita ao formato hh:mm:ss
}

export function timeStringToSeconds(time: string): number {
  const [hh, mm, ss] = time.split(":").map(Number);
  if ([hh, mm, ss].some(isNaN)) return 0;
  return hh * 3600 + mm * 60 + ss;
}

export const percent = new Intl.NumberFormat("en-US", {
  style: "percent",
  maximumFractionDigits: 2,
});
