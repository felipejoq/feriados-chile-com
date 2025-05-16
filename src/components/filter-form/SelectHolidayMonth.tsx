import { Months } from "../../utils/dates/months.ts";
import { GoCalendar } from "react-icons/go";
import type { ChangeEvent } from "react";
import { holidaysMonth, querySearch, searchHolidays } from "../../store/holidaysStore.ts";
import { useStore } from "@nanostores/react";

export const SelectHolidayMonth = () => {
  const $query = useStore(querySearch);
  const $month = useStore(holidaysMonth);

  const handleChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value.trim();

    if (value === "") {
      holidaysMonth.set(null);
    } else {
      holidaysMonth.set(parseInt(value, 10));
    }

    searchHolidays($query);
  };

  return (
    <div className="flex flex-1 items-center relative min-w-3xs">
      <label htmlFor="month" className="absolute left-3 text-gray-400 text-xl">
        <GoCalendar size={22} />
      </label>
      <select
        onChange={handleChange}
        value={$month?.toString() ?? ""} // mantener sincronía visual
        id="month"
        name="month"
        className="w-full p-2 pl-10 border border-gray-300 rounded-xl bg-white"
      >
        <option value="">Todos los meses</option>
        {
          Object.entries(Months).map(([key, { label, number }]) => (
            <option key={key} value={number}>{label}</option>
          ))
        }
      </select>
    </div>
  );
};
