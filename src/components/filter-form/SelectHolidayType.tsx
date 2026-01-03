import { HolidayTypes } from "../../interfaces/holidays/holiday-types.ts";
import { GoTasklist } from "react-icons/go";
import type { ChangeEvent } from "react";
import { SelectInput } from "../share/general/SelectInput.tsx";
import { useState, useEffect } from "react";

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
  const [type, setType] = useState<string>("");

  useEffect(() => {
    const handleReset = () => {
      setType("");
    };
    document.addEventListener('holiday-filters-reset', handleReset);
    return () => document.removeEventListener('holiday-filters-reset', handleReset);
  }, []);

  const handleChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;
    setType(value);

    if (value === "") {
      document.dispatchEvent(new CustomEvent('holiday-type-change', { detail: { type: null } }));
    } else {
      document.dispatchEvent(new CustomEvent('holiday-type-change', { detail: { type: value as HolidayTypes } }));
    }
  };

  const holidayTypeOptions = Object.entries(HolidayTypes).map(([_, value]) => ({
    value,
    label: `${typeColorSquare(value)} ${value}`
  }));

  return (
    <SelectInput
      id="type"
      label="Selecciona un tipo de feriado"
      name="type"
      value={type}
      onChange={handleChange}
      icon={<GoTasklist size={22} />}
      placeholder="Todos los tipos"
      options={holidayTypeOptions}
    />
  );
};
