export const HOLIDAY_COLLECTION_BY_YEAR = {
  2024: 'holidays_2024',
  2025: 'holidays_2025',
  2026: 'holidays_2026',
  2027: 'holidays_2027',
} as const;

export type SupportedHolidayYear = keyof typeof HOLIDAY_COLLECTION_BY_YEAR;

export const getHolidayCollectionName = (year: string | number) => {
  const numericYear = Number(year);

  if (numericYear in HOLIDAY_COLLECTION_BY_YEAR) {
    return HOLIDAY_COLLECTION_BY_YEAR[numericYear as SupportedHolidayYear];
  }

  return numericYear < 2024
    ? HOLIDAY_COLLECTION_BY_YEAR[2024]
    : HOLIDAY_COLLECTION_BY_YEAR[2027];
};

export const getCurrentHolidayCollectionName = (date = new Date()) => {
  const yearInChile = new Intl.DateTimeFormat('en-US', {
    timeZone: 'America/Santiago',
    year: 'numeric',
  }).format(date);

  return getHolidayCollectionName(yearInChile);
};
