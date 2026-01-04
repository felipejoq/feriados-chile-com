import { now, fromISO, fromJSDate } from "./dayjs-wrapper.ts";
import type { Holiday } from "../../interfaces/holidays/holiday.ts";
import type { Dayjs } from "dayjs";

// Obtener la fecha local en formato corto (sin hora) como string
export const getDate = (date = new Date()): string => {
  return fromJSDate(date).format('L');
};

// Obtener la fecha actual en Chile en formato ISO (YYYY-MM-DD)
export const getTodayDateChile = (): string => {
  return now().format('YYYY-MM-DD');
};

// Formato largo de fecha (ej.: "Domingo, 11 de mayo 2025")
export const longDate = (isoDate?: string): string => {
  const dateStr = isoDate ?? getTodayDateChile();
  const date = fromISO(dateStr);

  const dayName = date.format('dddd');
  const day = date.format('DD');
  const month = date.format('MMMM');
  const year = date.format('YYYY');

  const capitalizedDayName = dayName.charAt(0).toUpperCase() + dayName.slice(1);

  return `${capitalizedDayName}, ${day} de ${month} ${year}`;
};

// Reloj actual en hora chilena
export const clock = () => {
  return now().format('HH:mm:ss');
};

// Comparar si dos fechas (string) corresponden al mismo día en Chile
export const isSameDay = (date1: string, date2: string): boolean => {
  const d1 = fromISO(date1).format('YYYY-MM-DD');
  const d2 = fromISO(date2).format('YYYY-MM-DD');
  return d1 === d2;
};

// Verifica si hoy es domingo en horario chileno
export const isSundayInTimeZone = (): boolean => {
  return now().day() === 0; // 0 = Domingo en Day.js
};

// Ordenar dos feriados por fecha
export const sortHolidays = (a: any, b: any) => {
  if (!a.date || !b.date) return 0;

  const dateA = fromISO(a.date);
  const dateB = fromISO(b.date);

  if (dateA.isBefore(dateB)) return -1;
  if (dateA.isAfter(dateB)) return 1;
  return 0;
};

// Determina si una fecha ocurre después de otra (ambas string ISO)
export const isAfter = (dateISOString1: string, dateISOString2: string): boolean => {
  const d1 = fromISO(dateISOString1);
  const d2 = fromISO(dateISOString2);
  return d1.isAfter(d2);
};

// Obtener el próximo domingo desde una fecha (por defecto hoy)
export const getNextSunday = (fromDate?: Dayjs): string => {
  const baseDate = fromDate ?? now();
  const currentDay = baseDate.day(); // 0 = Domingo, 1 = Lunes, ..., 6 = Sábado
  const daysUntilSunday = currentDay === 0 ? 7 : 7 - currentDay;
  const nextSunday = baseDate.add(daysUntilSunday, 'day');
  return nextSunday.format('YYYY-MM-DD');
};

// Obtener la cantidad de días hasta un feriado
export const getDaysUntilHoliday = (holidayDate: string): number => {
  const today = now();
  const holiday = fromISO(holidayDate);
  
  // Calcular diferencia de días usando dayjs (respeta timezone)
  const todayFormatted = today.format('YYYY-MM-DD');
  const holidayFormatted = holiday.format('YYYY-MM-DD');
  
  // Convetir a milisegundos usando la misma zona horaria
  const todayTime = new Date(todayFormatted + 'T00:00:00').getTime();
  const holidayTime = new Date(holidayFormatted + 'T00:00:00').getTime();
  
  const daysRemaining = Math.ceil((holidayTime - todayTime) / (1000 * 60 * 60 * 24));
  
  return Math.max(0, daysRemaining);
};

// Calcular el porcentaje de progreso hasta un feriado
// Usa el último feriado como punto de partida (0%) y el próximo como meta (100%)
// Ejemplo: Último feriado = 1 enero, Próximo = 3 abril (92 días)
// - Día 1 enero = 0%, Día 15 febrero = 50%, Día 3 abril = 100%
export const getProgressPercentage = (holidayDate: string, lastHolidayDate?: string): number => {
  const today = now();
  const holiday = fromISO(holidayDate);
  
  const todayFormatted = today.format('YYYY-MM-DD');
  const holidayFormatted = holiday.format('YYYY-MM-DD');
  
  const todayTime = new Date(todayFormatted + 'T00:00:00').getTime();
  const holidayTime = new Date(holidayFormatted + 'T00:00:00').getTime();
  
  // Si el feriado ya pasó o es hoy, retornar 100
  const daysRemaining = Math.ceil((holidayTime - todayTime) / (1000 * 60 * 60 * 24));
  if (daysRemaining <= 0) {
    return 100;
  }
  
  // Si tenemos fecha del último feriado, usarla como punto inicial
  // Si no, usar como referencia los últimos 90 días antes del próximo feriado
  let startTime: number;
  if (lastHolidayDate) {
    const lastHoliday = fromISO(lastHolidayDate);
    startTime = new Date(lastHoliday.format('YYYY-MM-DD') + 'T00:00:00').getTime();
  } else {
    // Por defecto, asumimos un período máximo de 90 días
    startTime = holidayTime - (90 * 24 * 60 * 60 * 1000);
  }
  
  // Calcular el progreso: días transcurridos / días totales del período
  const totalDays = Math.ceil((holidayTime - startTime) / (1000 * 60 * 60 * 24));
  const daysPassed = Math.ceil((todayTime - startTime) / (1000 * 60 * 60 * 24));
  
  const percentage = Math.round((daysPassed / totalDays) * 100);
  
  // Asegurar que esté entre 0 y 100
  return Math.min(Math.max(percentage, 0), 100);
};
