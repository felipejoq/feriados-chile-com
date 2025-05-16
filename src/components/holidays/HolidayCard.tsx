import type {Holiday} from "../../interfaces/holidays/holiday.ts";
import {getNextSunday, longDate} from "../../utils/dates/date.ts";
import {Badge} from "../share/general/Badge.tsx";
import {GoBook, GoInfo, GoLocation} from "react-icons/go";
import {HolidayTypes} from "../../interfaces/holidays/holiday-types.ts";

interface Props {
  holiday: Holiday
}

const getCardBorderClass = (type: HolidayTypes): string => {
  switch (type) {
    case HolidayTypes.Civil:
      return 'border-t-blue-500';
    case HolidayTypes.Religious:
      return 'border-t-purple-500';
    case HolidayTypes.Local:
      return 'border-t-green-500';
    case HolidayTypes.Special:
      return 'border-t-yellow-500';
    default:
      return 'border-t-gray-300';
  }
};

export const HolidayCard = ({holiday}: Props) => {
  const classType = getCardBorderClass(holiday.type);
  return (
    <article
      className={`border border-t-4 border-gray-300 p-6 rounded-xl bg-gray-100 flex flex-col gap-4 sm:flex-row justify-between ${classType}`}>
      <div className="flex flex-col gap-4">
        <div>
          <h2 className="text-xl font-bold">
            {
              holiday.slug
                ? (<a className="cursor-pointer" href={holiday.slug} target="_self">{holiday.description}</a>)
                : holiday.description
            }
          </h2>
          <h3 className="text-gray-800">
            {
              holiday.date
                ? longDate(holiday.date)
                : longDate(getNextSunday())
            }
          </h3>
          <div className="flex flex-wrap gap-2 mt-2 sm:mt-4">
            <Badge label={holiday.type} icon={<GoInfo/>} className="bg-gray-700 text-white"/>
            {
              (holiday.type === HolidayTypes.Local && holiday.beneficiaries !== undefined)
                ? <Badge label={holiday.beneficiaries} icon={<GoLocation/>} className="bg-gray-700 text-white"/>
                : null
            }
            {
              holiday.irrenunciable
                ? <Badge label="Irrenunciable" className="bg-gray-700 text-white"/>
                : <Badge label="Renunciable" className="bg-gray-700 text-white"/>
            }
          </div>
        </div>

        <div className="text-xs text-gray-500 sm:mt-6">
          <p className="flex items-center gap-2">
            <GoBook/>
            Respaldo legal: {holiday.legalSupport}
          </p>
        </div>
      </div>
      <div className="mt-6 self-end">
        {
          holiday.slug
            ? (<a className="px-4 py-1 bg-gray-800 text-white rounded-full flex items-center gap-2" href={holiday.slug}
                  target="_self">
              Ver más
            </a>)
            : null
        }
      </div>
    </article>
  )
}

