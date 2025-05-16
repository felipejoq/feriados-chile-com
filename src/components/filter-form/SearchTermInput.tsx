import {type ChangeEvent, useEffect, useRef, useState} from 'react'
import {GoSearch} from "react-icons/go";
import {holidays, querySearch, searchHolidays} from "../../store/holidaysStore.ts";
import type {Holiday} from "../../interfaces/holidays/holiday.ts";
import {sortHolidays} from "../../utils/dates/date.ts";
import {useStore} from "@nanostores/react";

interface Props {
  holidaysArr: Array<Holiday & { id: string }>;
}

export const SearchTermInput = ({ holidaysArr }: Props) => {
  const $query = useStore(querySearch);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    holidays.set(holidaysArr.sort(sortHolidays));
    inputRef.current?.focus();
  }, [holidaysArr]);

  const handleSearchTermChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.trim();
    querySearch.set(value);
    searchHolidays(value);
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
        value={$query}
        type="text"
        placeholder="Buscar feriado..."
      />
    </div>
  );
};

