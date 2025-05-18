import { Months } from "../../utils/dates/months.ts";
import { GoCalendar } from "react-icons/go";
import type { ChangeEvent } from "react";
import { holidaysMonth, querySearch, searchHolidays } from "../../store/holidaysStore.ts";
import { useStore } from "@nanostores/react";
import { SelectInput } from "../share/general/SelectInput.tsx";

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

  const monthOptions = Object.entries(Months).map(([_, { label, number }]) => ({
    value: number.toString(),
    label,
  }));

  return (
    <SelectInput
      id="month"
      name="month"
      label="Selecciona un mes"
      value={$month?.toString() ?? ""}
      options={monthOptions}
      onChange={handleChange}
      icon={<GoCalendar size={22} />}
      placeholder="Todos los meses"
    />
  );
};
