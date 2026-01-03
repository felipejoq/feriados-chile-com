import { Months } from "../../utils/dates/months.ts";
import { GoCalendar } from "react-icons/go";
import type { ChangeEvent } from "react";
import { SelectInput } from "../share/general/SelectInput.tsx";
import { useState, useEffect } from "react";

export const SelectHolidayMonth = () => {
  const [month, setMonth] = useState<string>("");

  useEffect(() => {
    const handleReset = () => {
      setMonth("");
    };
    document.addEventListener('holiday-filters-reset', handleReset);
    return () => document.removeEventListener('holiday-filters-reset', handleReset);
  }, []);

  const handleChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value.trim();
    setMonth(value);

    if (value === "") {
      document.dispatchEvent(new CustomEvent('holiday-month-change', { detail: { month: null } }));
    } else {
      document.dispatchEvent(new CustomEvent('holiday-month-change', { detail: { month: parseInt(value, 10) } }));
    }
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
      value={month}
      options={monthOptions}
      onChange={handleChange}
      icon={<GoCalendar size={22} />}
      placeholder="Todos los meses"
    />
  );
};
