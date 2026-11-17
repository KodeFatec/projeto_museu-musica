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

const monthShort = new Intl.DateTimeFormat('pt-BR', { month: 'short' });

/** "13 Abr 2020" */
export function shortDate(date: Date): string {
  const month = capitalize(monthShort.format(date).replace('.', ''));
  return `${String(date.getDate()).padStart(2, '0')} ${month} ${date.getFullYear()}`;
}

const startOfDay = (date: Date) => new Date(date.getFullYear(), date.getMonth(), date.getDate());

/** Anos completos entre duas datas (idade). */
export function ageBetween(birth: Date, end: Date = new Date()): number {
  let years = end.getFullYear() - birth.getFullYear();
  if (end < new Date(end.getFullYear(), birth.getMonth(), birth.getDate())) years--;
  return years;
}

/** Tempo decorrido em duas partes para o selo da linha do tempo: { amount: '4', unit: 'anos' }. */
export function elapsed(date: Date, now: Date = new Date()): { amount: string; unit: string } {
  const today = startOfDay(now);
  const day = startOfDay(date);
  if (day > today) return { amount: 'Em', unit: 'breve' };

  const years = ageBetween(day, today);
  if (years >= 1) return { amount: String(years), unit: years === 1 ? 'ano' : 'anos' };

  const months =
    (today.getFullYear() - day.getFullYear()) * 12 + today.getMonth() - day.getMonth() - (today.getDate() < day.getDate() ? 1 : 0);
  if (months >= 1) return { amount: String(months), unit: months === 1 ? 'mês' : 'meses' };

  const days = Math.round((today.getTime() - day.getTime()) / 86_400_000);
  return days === 0 ? { amount: 'Hoje', unit: '' } : { amount: String(days), unit: days === 1 ? 'dia' : 'dias' };
}
