import React from 'react'

export const FilterFallback = () => {
  return (
    <section className="flex flex-col gap-4 animate-pulse">
      <div className="flex relative items-center">
        <div className="absolute left-3 text-gray-300">
          <div className="w-5 h-5 bg-gray-300 rounded-full"></div>
        </div>
        <div className="w-full h-10 pl-10 bg-gray-200 rounded-xl"></div>
      </div>

      <div className="flex flex-wrap w-full gap-4">
        <div className="flex flex-1 items-center relative min-w-3xs">
          <div className="absolute left-3 text-gray-300">
            <div className="w-5 h-5 bg-gray-300 rounded-md"></div>
          </div>
          <div className="w-full h-10 pl-10 bg-gray-200 rounded-xl"></div>
        </div>

        <div className="flex flex-1 items-center relative min-w-3xs">
          <div className="absolute left-3 text-gray-300">
            <div className="w-5 h-5 bg-gray-300 rounded-md"></div>
          </div>
          <div className="w-full h-10 pl-10 bg-gray-200 rounded-xl"></div>
        </div>

        <div className="flex flex-1 items-center relative min-w-3xs">
          <div className="w-full h-10 bg-gray-200 rounded-xl"></div>
        </div>
      </div>
    </section>
  )
}
