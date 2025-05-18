import { DateTime } from "luxon";
import type { Holiday } from "../../interfaces/holidays/holiday.ts";

// Obtener la fecha local en formato corto (sin hora) como string
export const getDate = (date = new Date()): string => {
  return DateTime.fromJSDate(date, { zone: "America/Santiago" }).toLocaleString();
};

// Obtener la fecha actual en Chile en formato ISO (YYYY-MM-DD)
export const getTodayDateChile = (): string => {
  return DateTime.now().setZone("America/Santiago").toISODate()!;
};

// Formato largo de fecha (ej.: "Domingo, 11 de mayo 2025")
export const longDate = (isoDate?: string ): string => {  
  const dateStr = isoDate ?? getTodayDateChile();
  const date = DateTime.fromISO(dateStr, { zone: "America/Santiago" }).setLocale("es");

  const dayName = date.toFormat("cccc");
  const day = date.toFormat("dd");
  const month = date.toFormat("LLLL");
  const year = date.toFormat("yyyy");

  const capitalizedDayName = dayName.charAt(0).toUpperCase() + dayName.slice(1);

  return `${capitalizedDayName}, ${day} de ${month} ${year}`;
};


// Reloj actual en hora chilena
export const clock = () => {
  return DateTime.local().setZone("America/Santiago").setLocale("es").toFormat("HH:mm:ss");
};

// Comparar si dos fechas (string) corresponden al mismo día en Chile
export const isSameDay = (date1: string, date2: string): boolean => {
  const d1 = DateTime.fromISO(date1, { zone: "America/Santiago" }).toISODate();
  const d2 = DateTime.fromISO(date2, { zone: "America/Santiago" }).toISODate();
  return d1 === d2;
};

// Verifica si hoy es domingo en horario chileno
export const isSundayInTimeZone = (): boolean => {
  const now = DateTime.now().setZone("America/Santiago");
  return now.weekday === 7; // 7 = Domingo
};

// Ordenar dos feriados por fecha
export const sortHolidays = (a: Holiday, b: Holiday) => {
  if (!a.date || !b.date) return 0;

  const dateA = DateTime.fromISO(a.date, { zone: "America/Santiago" });
  const dateB = DateTime.fromISO(b.date, { zone: "America/Santiago" });

  if (dateA < dateB) return -1;
  if (dateA > dateB) return 1;
  return 0;
};

// Determina si una fecha ocurre después de otra (ambas string ISO)
export const isAfter = (dateISOString1: string, dateISOString2: string): boolean => {
  const d1 = DateTime.fromISO(dateISOString1, { zone: "America/Santiago" });
  const d2 = DateTime.fromISO(dateISOString2, { zone: "America/Santiago" });
  return d1 > d2;
};

// Obtener el próximo domingo desde una fecha (por defecto hoy)
export const getNextSunday = (fromDate = DateTime.now().setZone("America/Santiago")): string => {
  const daysUntilSunday = (7 - fromDate.weekday) % 7 || 7; // si hoy es domingo, devuelve el siguiente
  const nextSunday = fromDate.plus({ days: daysUntilSunday });
  return nextSunday.toISODate()!;
};
