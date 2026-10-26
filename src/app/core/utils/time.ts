/** "HH:MM:SS" -> segundos (valores inválidos viram 0). */
export function parseTime(value: string | null | undefined): number {
  if (!value) return 0;
  const parts = value.split(':').map(Number);
  if (parts.length !== 3 || parts.some(Number.isNaN)) return 0;
  return parts[0] * 3600 + parts[1] * 60 + parts[2];
}

/** segundos -> "HH:MM:SS" (formato que a API valida). */
export function toTimeString(seconds: number): string {
  const s = Math.max(0, Math.floor(seconds));
  const h = Math.floor(s / 3600).toString().padStart(2, '0');
  const m = Math.floor((s % 3600) / 60).toString().padStart(2, '0');
  const sec = (s % 60).toString().padStart(2, '0');
  return `${h}:${m}:${sec}`;
}

/** 190 -> "03:10" (relógio do player). */
export function formatClock(seconds: number): string {
  const m = Math.floor(seconds / 60).toString().padStart(2, '0');
  const s = Math.floor(seconds % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
}
