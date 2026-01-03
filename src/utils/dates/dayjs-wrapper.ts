import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import weekday from 'dayjs/plugin/weekday';
import 'dayjs/locale/es';

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(customParseFormat);
dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);
dayjs.extend(weekday);

const CHILE_TIMEZONE = 'America/Santiago';
const LOCALE = 'es';

dayjs.locale(LOCALE);

export const dayjsChile = (date?: string | Date | dayjs.Dayjs | null) => {
  if (date === null || date === undefined) {
    return dayjs().tz(CHILE_TIMEZONE);
  }
  return dayjs(date).tz(CHILE_TIMEZONE);
};

export const now = () => dayjs().tz(CHILE_TIMEZONE);

export const fromISO = (isoString: string) => {
  return dayjs.tz(isoString, 'YYYY-MM-DD', CHILE_TIMEZONE);
};

export const fromJSDate = (date: Date) => {
  return dayjs(date).tz(CHILE_TIMEZONE);
};

export const TIMEZONE = CHILE_TIMEZONE;
export const DEFAULT_LOCALE = LOCALE;

export default dayjsChile;
