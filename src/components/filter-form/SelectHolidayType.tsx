import { useStore } from "@nanostores/react";
import { HolidayTypes } from "../../interfaces/holidays/holiday-types.ts";
import { GoTasklist } from "react-icons/go";
import type { ChangeEvent } from "react";
import { holidaysType, searchHolidays } from "../../store/holidaysStore.ts";

const typeColorSquare = (type: HolidayTypes): string => {
  switch (type) {
    case HolidayTypes.Civil:
      return "🟦";
    case HolidayTypes.Religious:
      return "🟪";
    case HolidayTypes.Local:
      return "🟩";
    case HolidayTypes.Special:
      return "🟨";
    default:
      return "⬜️";
  }
};

export const SelectHolidayType = () => {
  const $type = useStore(holidaysType); // sincroniza el valor actual

  const handleChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;

    if (value === "") {
      holidaysType.set(null); // sin filtro
    } else {
      holidaysType.set(value as HolidayTypes);
    }

    searchHolidays();
  };

  return (
    <div className="flex flex-1 items-center relative min-w-3xs">
      <label htmlFor="type" className="absolute left-3 text-gray-400 text-xl">
        <GoTasklist size={22} />
      </label>
      <select
        onChange={handleChange}
        value={$type ?? ""}
        id="type"
        name="type"
        className="w-full p-2 pl-10 border border-gray-300 rounded-xl bg-white"
      >
        <option value="">Todos los tipos</option>
        {
          Object.entries(HolidayTypes).map(([key, value]) => (
            <option key={key} value={value}>{typeColorSquare(value)} {value}</option>
          ))
        }
      </select>
    </div>
  );
};
