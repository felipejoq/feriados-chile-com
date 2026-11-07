import {type ChangeEvent, useEffect, useState} from 'react'
import {GoSearch} from "react-icons/go";
import {holidays} from "../../store/holidaysStore.ts";
import type {Holiday} from "../../interfaces/holidays/holiday.ts";
import {sortHolidays} from "../../utils/dates/date.ts";

interface Props {
  holidaysArr: Array<Holiday & { id: string }>;
}

export const SearchTermInput = ({ holidaysArr }: Props) => {
  const [query, setQuery] = useState("");

  useEffect(() => {
    holidays.set(holidaysArr.sort(sortHolidays));

    // Listener para reset
    const handleReset = () => {
      setQuery("");
    };
    document.addEventListener('holiday-filters-reset', handleReset);
    return () => document.removeEventListener('holiday-filters-reset', handleReset);
  }, [holidaysArr]);

  const handleSearchTermChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    document.dispatchEvent(new CustomEvent('holiday-search-change', { detail: { query: value } }));
  };

  return (
    <div className="flex relative items-center">
      <label htmlFor="search-term" className="absolute left-3 text-gray-400 text-xl">
        <span className="sr-only">Buscar feriado</span>
        <GoSearch size={22} aria-hidden="true" />
      </label>
      <input
        className="w-full min-h-11 p-2 pl-10 border border-gray-300 rounded-xl bg-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700"
        id="search-term"
        name="search-term"
        onChange={handleSearchTermChange}
        value={query}
        type="text"
        placeholder="Buscar feriado..."
      />
    </div>
  );
};

