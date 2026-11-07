export const ButtonResetFilters = () => {

  const handleClick = (): void => {
    document.dispatchEvent(new CustomEvent('holiday-filters-reset'));
  }

  return (
    <div className="flex min-w-0 items-center min-[360px]:col-span-2 sm:col-span-1">
      <button
        onClick={handleClick}
        className="w-full min-h-11 text-sm font-medium text-slate-600 p-2 rounded-lg cursor-pointer underline underline-offset-4 hover:bg-slate-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700">
        Limpiar filtros
      </button>
    </div>
  )
}
