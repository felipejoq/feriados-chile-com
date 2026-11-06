import { appliesToArea, type Area, type PlannerHoliday } from './planner.ts';

export const MIN_DATE = '2026-01-01';
export const MAX_DATE = '2027-12-31';
export const AREA_LABELS: Record<Area, string> = {
 national: 'Solo feriados nacionales',
 arica: 'Arica y Parinacota',
 chillan: 'Chillán y Chillán Viejo',
};
export interface CalculationOptions {
 mode: 'range' | 'add';
 start: string;
 end: string;
 amount: number;
 area: Area;
 includeStart: boolean;
}
export interface CalculationDay {
 date: string;
 kind: 'business' | 'weekend' | 'holiday' | 'excluded';
 names: string[];
 ordinal?: number;
}
export interface BusinessResult {
 end: string;
 business: number;
 weekends: number;
 holidays: number;
 total: number;
 days: CalculationDay[];
}
export const INITIAL_CALCULATION: CalculationOptions = {
 mode: 'range', start: '2027-01-01', end: '2027-01-31', amount: 10,
 area: 'national', includeStart: true,
};
const DAY = 86_400_000;
const iso = (time: number) => new Date(time).toISOString().slice(0, 10);
export const fullDate = (date: string) => new Intl.DateTimeFormat('es-CL', {
 day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC',
}).format(new Date(`${date}T12:00:00Z`));

function parseDate(date: string): number {
 if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) throw new Error('Ingresa una fecha completa y válida.');
 const time = Date.parse(`${date}T00:00:00Z`);
 if (!Number.isFinite(time) || iso(time) !== date) throw new Error('Esa fecha no existe en el calendario.');
 if (date < MIN_DATE || date > MAX_DATE) throw new Error('Elige fechas entre el 1 de enero de 2026 y el 31 de diciembre de 2027.');
 return time;
}
function validateOptions(options: CalculationOptions) {
 if (!['range', 'add'].includes(options.mode) || !Object.hasOwn(AREA_LABELS, options.area) || typeof options.includeStart !== 'boolean') {
  throw new Error('Revisa el modo de cálculo, la zona y si se incluye el inicio.');
 }
 parseDate(options.start);
 if (options.mode === 'range') {
  parseDate(options.end);
  if (options.start > options.end) throw new Error('La fecha final debe ser igual o posterior a la inicial.');
 } else if (!Number.isInteger(options.amount) || options.amount < 1 || options.amount > 520) {
  throw new Error('Ingresa una cantidad entera entre 1 y 520 días hábiles.');
 }
}

/** Date-only arithmetic in UTC avoids DST and local timezone shifts. */
export function calculateBusinessDays(holidays: PlannerHoliday[], options: CalculationOptions): BusinessResult {
 validateOptions(options);
 const byDate = new Map<string, string[]>();
 for (const holiday of holidays) {
  if (!holiday.date || !appliesToArea(holiday, options.area)) continue;
  const names = byDate.get(holiday.date) || [];
  if (!names.includes(holiday.description || 'Feriado')) names.push(holiday.description || 'Feriado');
  byDate.set(holiday.date, names);
 }
 const result: BusinessResult = {end: options.start, business: 0, weekends: 0, holidays: 0, total: 0, days: []};
 const start = parseDate(options.start);
 const limit = parseDate(options.mode === 'range' ? options.end : MAX_DATE);
 for (let time = start; time <= limit; time += DAY) {
  const date = iso(time), weekday = new Date(time).getUTCDay();
  const names = byDate.get(date) || [];
  // Categories are disjoint; retain holiday names even on weekend/excluded days.
  const kind: CalculationDay['kind'] = time === start && !options.includeStart ? 'excluded'
   : weekday === 0 || weekday === 6 ? 'weekend' : names.length ? 'holiday' : 'business';
  if (kind !== 'excluded') result.total++;
  if (kind === 'business') result.business++;
  if (kind === 'weekend') result.weekends++;
  if (kind === 'holiday') result.holidays++;
  result.days.push({date, kind, names, ...(kind === 'business' ? {ordinal: result.business} : {})});
  result.end = date;
  if (options.mode === 'add' && result.business === options.amount) return result;
 }
 if (options.mode === 'add') throw new Error('El resultado supera el 31 de diciembre de 2027. Reduce los días o elige una fecha anterior; aún no calculamos con feriados de 2028.');
 return result;
}

export function encodeCalculation(options: CalculationOptions): string {
 validateOptions(options);
 return '#calculo?' + new URLSearchParams({
  modo: options.mode, desde: options.start, hasta: options.end, dias: String(options.amount),
  zona: options.area, inicio: options.includeStart ? '1' : '0',
 }).toString();
}
export function decodeCalculation(hash: string): CalculationOptions | null {
 if (!hash.startsWith('#calculo?')) return null;
 const p = new URLSearchParams(hash.slice('#calculo?'.length));
 if (!['modo','desde','hasta','dias','zona','inicio'].every(key => p.has(key)) || !['0','1'].includes(p.get('inicio')!)) {
  throw new Error('El enlace de cálculo está incompleto o no es válido. Ingresa tus fechas para hacer un nuevo cálculo.');
 }
 const options: CalculationOptions = {
  mode: p.get('modo') as CalculationOptions['mode'], start: p.get('desde')!, end: p.get('hasta')!,
  amount: Number(p.get('dias')), area: p.get('zona') as Area, includeStart: p.get('inicio') === '1',
 };
 validateOptions(options);
 return options;
}
