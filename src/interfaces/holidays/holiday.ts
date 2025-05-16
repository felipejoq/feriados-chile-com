import type {HolidayTypes} from "./holiday-types.ts";

export type Holiday = {
  legalSupport: string;
  description?: string;
  type: HolidayTypes;
  irrenunciable: boolean;
  beneficiaries?: string;
  slug?: string;
  date: string | undefined;
}