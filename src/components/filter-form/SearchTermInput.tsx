import {type ChangeEvent, useEffect, useRef, useState} from 'react'
import {GoSearch} from "react-icons/go";
import {holidays} from "../../store/holidaysStore.ts";
import type {Holiday} from "../../interfaces/holidays/holiday.ts";
import {sortHolidays} from "../../utils/dates/date.ts";

interface Props {
  holidaysArr: Array<Holiday & { id: string }>;
}

export const SearchTermInput = ({ holidaysArr }: Props) => {
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    holidays.set(holidaysArr.sort(sortHolidays));
    inputRef.current?.focus();

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
        <GoSearch size={22} />
      </label>
      <input
        ref={inputRef}
        className="w-full p-2 pl-10 border-1 border-gray-300 rounded-xl bg-white"
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

