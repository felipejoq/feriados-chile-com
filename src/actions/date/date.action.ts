import {defineAction} from "astro:actions";
import {longDate} from "../../utils/dates/date.ts";

export const GetLongDate = defineAction({
  accept: 'json',
  handler: async () => {
    return {
      longDate: longDate()
    };
  }
});