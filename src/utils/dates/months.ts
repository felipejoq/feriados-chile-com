export const Months = {
  january:   { label: 'Enero', number: 1 },
  february:  { label: 'Febrero', number: 2 },
  march:     { label: 'Marzo', number: 3 },
  april:     { label: 'Abril', number: 4 },
  may:       { label: 'Mayo', number: 5 },
  june:      { label: 'Junio', number: 6 },
  july:      { label: 'Julio', number: 7 },
  august:    { label: 'Agosto', number: 8 },
  september: { label: 'Septiembre', number: 9 },
  october:   { label: 'Octubre', number: 10 },
  november:  { label: 'Noviembre', number: 11 },
  december:  { label: 'Diciembre', number: 12 },
} as const;

export type MonthKey = keyof typeof Months;

export type MonthData = typeof Months[MonthKey];
