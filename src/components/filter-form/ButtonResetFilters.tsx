import {type MouseEvent} from "react";
import {resetFilters} from "../../store/holidaysStore.ts";

export const ButtonResetFilters = () => {

  const handleClick = (): void => {
    resetFilters();
  }

  return (
    <div className="flex flex-1 items-center relative min-w-3xs">
      <button
        onClick={handleClick}
        className="w-full bg-gray-200 text-gray-700 p-2 rounded-xl cursor-pointer hover:bg-gray-600 hover:text-white">
        Limpiar filtros
      </button>
    </div>
  )
}
