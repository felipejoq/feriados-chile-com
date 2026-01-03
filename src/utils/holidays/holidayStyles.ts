import { HolidayTypes } from "../../interfaces/holidays/holiday-types.ts";

export const getCardBorderClass = (type: HolidayTypes): string => {
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
