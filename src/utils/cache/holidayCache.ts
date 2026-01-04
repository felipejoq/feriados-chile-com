interface CacheData {
  data: any;
  date: string;
}

let cachedHolidayData: CacheData | null = null;

export function isCacheValid(currentDate: string): boolean {
  return cachedHolidayData !== null && cachedHolidayData.date === currentDate;
}

export function getCachedData() {
  return cachedHolidayData?.data || null;
}

export function setCacheData(data: any, date: string) {
  cachedHolidayData = {
    data,
    date,
  };
}

export function clearHolidayCache() {
  cachedHolidayData = null;
}
