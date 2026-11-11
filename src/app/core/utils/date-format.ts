const capitalize = (text: string) => text.charAt(0).toUpperCase() + text.slice(1);

/** "YYYY-MM-DD" -> Date local (sem deslocamento de fuso). */
export function parseDate(value: string | null | undefined): Date | undefined {
  const match = value?.match(/^(\d{4})-(\d{2})-(\d{2})/);
  return match ? new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3])) : undefined;
}

const weekday = new Intl.DateTimeFormat('pt-BR', { weekday: 'long' });
const dayMonth = new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: '2-digit' });
const full = new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });

/** "Quinta-feira • 05/11" */
export function weekdayAndDate(date: Date): string {
  return `${capitalize(weekday.format(date))} • ${dayMonth.format(date)}`;
}

/** "05/11 – 30/11/2026" (ou só "05/11/2026" quando não há fim). */
export function dateRange(start?: Date, end?: Date): string {
  if (!start) return '';
  if (!end || end.getTime() === start.getTime()) return full.format(start);
  return `${dayMonth.format(start)} – ${full.format(end)}`;
}
