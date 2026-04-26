import {defineAction} from "astro:actions";
import {z} from "astro:schema";
import {getCollection} from "astro:content";
import {getDate, isAfter, isSameDay, isSundayInTimeZone, longDate, sortHolidays} from "../../utils/dates/date.ts";
import type {Holiday} from "../../interfaces/holidays/holiday.ts";

export const TodayIsHoliday = defineAction({
  accept: 'json',
  input: z.string(),
  handler: async (today) => {
    const holidaysCollection = await getCollection('holidays_2026') as {data: Holiday}[];

    const holidaysFound = holidaysCollection.filter(({data}) => {
      return data.date !== null && data.date !== undefined
        && isSameDay(data.date, today)
        && data.description !== "Todos los días Domingos";
    }).map(({data}) => data) as Holiday[];

    const result = [];

    // Check if today is Sunday in Chile Continental
    if (isSundayInTimeZone()) {
      const sundayHoliday = holidaysCollection.find(({data}) => {
        return data.description === "Todos los días Domingos";
      });
      if(sundayHoliday) {
        result.push(sundayHoliday.data as Holiday);
      }
    }

    const holidays = [
      ...holidaysFound,
      ...result,
    ] as Holiday[];

    const message = holidays.length > 0
      ? `🎉 ¡Hoy es feriado!`
      : `😟 Hoy no es feriado`;

    return {
      isHoliday: holidays.length > 0,
      message,
      holidays,
    };
  }
});

export const NextHoliday = defineAction({
  accept: 'json',
  input: z.string(), // Fecha actual en formato 'YYYY-MM-DD'
  handler: async (today) => {
    const holidaysCollection = await getCollection("holidays_2026") as { data: Holiday }[];

    const futureHolidays = holidaysCollection
      .filter(({ data }) =>
        data.date &&
        data.description !== "Todos los días Domingos" &&
        isAfter(data.date, today)
      )
      .map(({ data }) => data)
      .sort(sortHolidays);

    const nextHoliday = futureHolidays.length > 0 ? futureHolidays[0] : null;

    return {
      hasNextHoliday: !!nextHoliday,
      nextHoliday,
      message: nextHoliday
        ? `🎉 El próximo feriado es el ${longDate(nextHoliday.date)}`
        : "😟 No hay más feriados programados.",
    };
  }
});
