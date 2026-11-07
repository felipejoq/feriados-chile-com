// Extend only after verifying legislation and dates, registering the collection,
// and adding independent expectations to scripts/validate-holidays.mjs.
export const REVIEWED_YEARS: readonly number[] = [2026, 2027];
export const REVIEWED_ON = '2026-11-06';
export const REVIEWED_LABEL = new Intl.DateTimeFormat('es-CL', {day:'numeric',month:'long',year:'numeric',timeZone:'UTC'}).format(new Date(`${REVIEWED_ON}T12:00:00Z`));
export const COVERAGE_LABEL = REVIEWED_YEARS.join(' y ');
export const DEFAULT_YEAR = REVIEWED_YEARS.at(-1)!;
export const FIRST_DATE = `${REVIEWED_YEARS[0]}-01-01`;
export const LAST_DATE = `${DEFAULT_YEAR}-12-31`;
export const MAX_CALENDAR_DAYS = Math.round((Date.parse(LAST_DATE)-Date.parse(FIRST_DATE))/86400000)+1;
export const plannerStart = (year: number) => year === Number(REVIEWED_ON.slice(0,4)) ? REVIEWED_ON : `${year}-01-01`;
