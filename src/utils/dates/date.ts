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
// Retorna un número entre 0 y 100 representando qué tan cerca está el feriado
export const getProgressPercentage = (holidayDate: string): number => {
  const daysRemaining = getDaysUntilHoliday(holidayDate);
  
  // Si el feriado ya pasó o es hoy, retornar 100
  if (daysRemaining <= 0) {
    return 100;
  }
  
  // Usar una ventana de 30 días como referencia máxima
  // Si faltan más de 30 días, usar 30 como denominador
  const referenceWindow = 30;
  const daysPassed = Math.max(0, referenceWindow - daysRemaining);
  const percentage = Math.round((daysPassed / referenceWindow) * 100);
  
  return Math.min(Math.max(percentage, 0), 100);
};
