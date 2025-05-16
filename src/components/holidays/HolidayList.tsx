import {useStore} from "@nanostores/react";
import {holidays, holidaysMonth, results} from "../../store/holidaysStore.ts";
import {HolidayCard} from "./HolidayCard"
import {HolidayListFallback} from "../fallbacks/HolidayListFallback.tsx";

export const HolidayList = () => {
  const $holidays = useStore(holidays);
  const $results = useStore(results);
  const $holidayFilter = useStore(holidaysMonth);

  const dataToShow = $results.length > 0 || $holidayFilter !== null ? $results : $holidays;

  const isLoading = $holidays.length === 0 && $results.length === 0;

  if (isLoading) {
    return <HolidayListFallback />;
  }

  return (
    <div className="flex flex-col w-full my-6 gap-4">
      {
        dataToShow.length > 0
          ? dataToShow.map((holiday) => (
            <HolidayCard key={holiday.id} holiday={holiday} />
          ))
          : <p className="text-center text-gray-500">No hay feriados para mostrar.</p>
      }
    </div>
  );
};
