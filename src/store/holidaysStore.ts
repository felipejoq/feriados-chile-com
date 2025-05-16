import {atom} from 'nanostores';
import type {Holiday} from "../interfaces/holidays/holiday.ts";
import {normalize} from "../utils/formatters/strings.ts";
import {longDate, sortHolidays} from "../utils/dates/date.ts";
import {HolidayTypes} from "../interfaces/holidays/holiday-types.ts";

export type HolidayWithId = Holiday & { id: string };

export const holidaysType = atom<HolidayTypes | null>(null);
export const holidaysMonth = atom<number | null>(null);
export const querySearch = atom<string>("");
export const holidays = atom<HolidayWithId[]>([]);
export const results = atom<HolidayWithId[]>([]);

export const searchHolidays = (query?: string) => {
  const normalizedQuery = normalize(query || querySearch.get());

  const typeFilter = holidaysType.get();
  const monthFilter = holidaysMonth.get();

  // Salida temprana si no hay feriados en el mes
  if (monthFilter !== null) {
    const hasMonthMatch = holidays.get().some((holiday) => {
      if (!holiday.date) return false;
      const month = parseInt(holiday.date.slice(5, 7), 10);
      return month === monthFilter;
    });

    if (!hasMonthMatch) {
      results.set([]);
    }
  }

  const result = holidays.get().filter((holiday) => {
    const matchesQuery =
      normalize(holiday.description).includes(normalizedQuery) ||
      normalize(holiday.legalSupport).includes(normalizedQuery) ||
      normalize(holiday.type).includes(normalizedQuery) ||
      normalize(holiday.date).includes(normalizedQuery) ||
      normalize(holiday.beneficiaries).includes(normalizedQuery) ||
      normalize(longDate(holiday.date)).includes(normalizedQuery) ||
      normalize(holiday.id).replace("-", " ").includes(normalizedQuery);

    const matchesType =
      typeFilter !== null
        ? holiday.type === typeFilter
        : true;

    const matchesMonth =
      monthFilter !== null
        ? (() => {
          if (!holiday.date) return false;
          const month = parseInt(holiday.date.slice(5, 7), 10);
          return month === monthFilter;
        })()
        : true;

    return matchesQuery && matchesType && matchesMonth;
  }).sort(sortHolidays);

  results.set(result);
};

export const resetFilters = () => {
  holidaysType.set(null);
  holidaysMonth.set(null);
  querySearch.set("");
  searchHolidays()
}
