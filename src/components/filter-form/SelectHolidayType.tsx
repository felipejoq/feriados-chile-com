import { useStore } from "@nanostores/react";
import { HolidayTypes } from "../../interfaces/holidays/holiday-types.ts";
import { GoTasklist } from "react-icons/go";
import type { ChangeEvent } from "react";
import { holidaysType, searchHolidays } from "../../store/holidaysStore.ts";
import { SelectInput } from "../share/general/SelectInput.tsx";

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
  const $type = useStore(holidaysType);

  const handleChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;

    if (value === "") {
      holidaysType.set(null);
    } else {
      holidaysType.set(value as HolidayTypes);
    }

    searchHolidays();
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
      value={$type ?? ""}
      onChange={handleChange}
      icon={<GoTasklist size={22} />}
      placeholder="Todos los tipos"
      options={holidayTypeOptions}
    />
  );
};
