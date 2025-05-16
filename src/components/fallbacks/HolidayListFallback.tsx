export const HolidayListFallback = () => {
  return (
    <div className="flex flex-col w-full my-6 gap-4 animate-pulse">
      {[1, 2, 3].map((i) => (
        <article
          key={i}
          className="border border-t-4 border-gray-300 p-6 rounded-xl bg-gray-100 flex flex-col gap-4 sm:flex-row justify-between border-t-gray-300"
        >
          <div className="flex flex-col gap-4 flex-1">
            <div>
              <div className="h-6 w-2/3 bg-gray-300 rounded mb-2" />
              <div className="h-5 w-1/2 bg-gray-200 rounded mb-2" />
              <div className="flex flex-wrap gap-2 mt-2 sm:mt-4">
                <div className="h-6 w-24 bg-gray-300 rounded-full" />
                <div className="h-6 w-28 bg-gray-300 rounded-full" />
                <div className="h-6 w-20 bg-gray-300 rounded-full" />
              </div>
            </div>

            <div className="text-xs text-gray-500 sm:mt-6">
              <div className="h-4 w-40 bg-gray-200 rounded" />
            </div>
          </div>

          <div className="mt-6 self-end">
            <div className="h-8 w-24 bg-gray-400 rounded-full" />
          </div>
        </article>
      ))}
    </div>
  )
}
