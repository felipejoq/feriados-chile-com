import { appliesToArea, type Area, type PlannerHoliday } from './planner.ts';
import { REVIEWED_YEARS, REVIEWED_LABEL } from './coverage.ts';
import { AREA_LABELS } from './business-days.ts';
export interface CalendarHoliday extends PlannerHoliday {
 legalSupport: string;
 irrenunciable: boolean;
 articleUrl?: string;
}
export type DatedHoliday = CalendarHoliday & {date: string};
export interface CalendarOptions {year: number; area: Area; month: number; onlyMandatory: boolean}
export const CALENDAR_PAGE = 'https://feriados-chile.com/calendario-feriados-chile-descargar';
export const COMMERCE_SOURCE = 'https://dt.gob.cl/portal/1628/w3-article-95017.html';
export const MONTHS = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];
const BASE_LAW = 'https://www.bcn.cl/leychile/Navegar?idNorma=23639';
const SOURCES: Record<string,string> = {
 'asalto-toma-morro-de-arica':'https://www.bcn.cl/leychile/navegar?idLey=20663',
 'dia-de-las-iglesias-evangelicas-y-protestantes':'https://www.bcn.cl/leychile/navegar?idLey=20299',
 'dia-del-trabajador':'https://www.bcn.cl/leychile/navegar?idNorma=207436',
 'dia-nacional-pueblos-indigenas':'https://www.bcn.cl/leychile/navegar?i=1161743',
 'encuentro-de-los-dos-mundos':'https://www.bcn.cl/leychile/navegar?i=160270',
 'feriado-adicional-fiestas-patrias':'https://www.bcn.cl/leychile/navegar?i=1098384',
 'nacimiento-procer-de-la-patria':'https://www.bcn.cl/leychile/navegar?idNorma=1065534',
 'san-pedro-san-pablo':'https://www.bcn.cl/leychile/navegar?i=160270',
 'virgen-del-carmen':'https://www.bcn.cl/leychile/navegar?idNorma=257080',
};
const BASE_IDS = new Set(['ano-nuevo','asuncion-de-la-virgen','dia-de-las-glorias-navales','dia-de-todos-los-santos','fiestas-patrias-18-de-septiembre','glorias-del-ejercito','inmaculada-concepcion','navidad','sabado-santo','viernes-santo']);
const SOURCE_IDS_BY_DESCRIPTION: Record<string,string> = {
 "Año Nuevo": "ano-nuevo",
 "Asalto y Toma del Morro de Arica": "asalto-toma-morro-de-arica",
 "Asunción de la Virgen": "asuncion-de-la-virgen",
 "Día de las Glorias Navales": "dia-de-las-glorias-navales",
 "Día de las Iglesias Evangélicas y Protestantes": "dia-de-las-iglesias-evangelicas-y-protestantes",
 "Día de Todos los Santos": "dia-de-todos-los-santos",
 "Día Nacional del Trabajo": "dia-del-trabajador",
 "Día Nacional de los Pueblos Indígenas": "dia-nacional-pueblos-indigenas",
 "Encuentro de Dos Mundos": "encuentro-de-los-dos-mundos",
 "Feriado adicional de Fiestas Patrias": "feriado-adicional-fiestas-patrias",
 "Independencia Nacional": "fiestas-patrias-18-de-septiembre",
 "Día de las Glorias del Ejército": "glorias-del-ejercito",
 "Inmaculada Concepción": "inmaculada-concepcion",
 "Nacimiento del Prócer de la Independencia": "nacimiento-procer-de-la-patria",
 "Navidad": "navidad",
 "Sábado Santo - Semana Santa": "sabado-santo",
 "San Pedro y San Pablo": "san-pedro-san-pablo",
 "Viernes Santo - Semana Santa": "viernes-santo",
 "Día de la Virgen del Carmen": "virgen-del-carmen"
};
export function legalSource(holiday: CalendarHoliday): string {
 const sourceId = SOURCE_IDS_BY_DESCRIPTION[holiday.description || ''] || holiday.id;
 const url = SOURCES[sourceId] || (BASE_IDS.has(sourceId) ? BASE_LAW : undefined);
 if (!url) throw new Error(`Falta revisar la fuente oficial del feriado: ${holiday.id}`);
 return url;
}
export const calendarTitle = (options: CalendarOptions) => `Feriados de Chile ${options.year}${options.month ? ` - ${MONTHS[options.month-1]}` : ''}`;
export const calendarSubtitle = (options: CalendarOptions) => `${AREA_LABELS[options.area]} | ${options.onlyMandatory ? 'Solo irrenunciables del comercio' : 'Todos los feriados fechados'}`;
export const calendarFilename = (options: CalendarOptions) => `feriados-chile-${options.year}${options.month ? `-${String(options.month).padStart(2,'0')}` : ''}-${options.area}${options.onlyMandatory ? '-irrenunciables' : ''}`;

export function selectCalendarHolidays(holidays: CalendarHoliday[], options: CalendarOptions): DatedHoliday[] {
 if (!REVIEWED_YEARS.includes(options.year) || !Number.isInteger(options.month) || options.month<0 || options.month>12
  || !Object.hasOwn(AREA_LABELS, options.area) || typeof options.onlyMandatory !== 'boolean') throw new Error('Elige un año revisado, una zona y un período válidos.');
 return holidays.filter((h): h is DatedHoliday => !!h.date && h.date.startsWith(`${options.year}-`) && appliesToArea(h,options.area)
  && (!options.month || Number(h.date.slice(5,7))===options.month) && (!options.onlyMandatory || h.irrenunciable))
  .sort((a,b)=>a.date.localeCompare(b.date)||a.id.localeCompare(b.id));
}

export function monthGrid(year: number, month: number): (number|null)[] {
 const offset=(new Date(Date.UTC(year,month-1,1)).getUTCDay()+6)%7;
 const last=new Date(Date.UTC(year,month,0)).getUTCDate();
 return Array.from({length:42},(_,i)=>i>=offset && i<offset+last ? i-offset+1 : null);
}
function escapeText(value: string): string {
 return value.replaceAll('\\','\\\\').replace(/\r\n|\r|\n/g,'\\n').replaceAll(',','\\,').replaceAll(';','\\;');
}
function foldLine(line: string): string {
 let output='',bytes=0;
 for(const char of line){const size=new TextEncoder().encode(char).length;if(bytes+size>75){output+='\r\n ';bytes=1;}output+=char;bytes+=size;}
 return output;
}
export function calendarICS(holidays: DatedHoliday[], options: CalendarOptions, now = new Date()): string {
 const stamp=now.toISOString().replace(/[-:]/g,'').replace(/\.\d{3}/,'');
 const lines=['BEGIN:VCALENDAR','VERSION:2.0','PRODID:-//Feriados Chile//Calendario descargable//ES','CALSCALE:GREGORIAN',`X-WR-CALNAME:${escapeText(calendarTitle(options))}`];
 for(const h of holidays){
  const end=new Date(Date.parse(`${h.date}T00:00:00Z`)+86400000).toISOString().slice(0,10);
  const area=h.type==='Local' ? h.beneficiaries || 'Local' : 'Nacional';
  const description=[`Ámbito: ${area}.`,h.irrenunciable ? 'Irrenunciable para dependientes del comercio, con excepciones legales. Consulta la Dirección del Trabajo: '+COMMERCE_SOURCE : 'No pertenece a los cinco feriados irrenunciables del comercio.',`Respaldo: ${h.legalSupport}.`, `Fuente oficial: ${legalSource(h)}`,`Revisión: ${REVIEWED_LABEL}. Copia descargada, sin actualización automática.`, `Más información: ${h.articleUrl || CALENDAR_PAGE}`].join('\n');
  lines.push('BEGIN:VEVENT',`UID:${encodeURIComponent(h.id)}-${options.year}@feriados-chile.com`,`DTSTAMP:${stamp}`,`DTSTART;VALUE=DATE:${h.date.replaceAll('-','')}`,`DTEND;VALUE=DATE:${end.replaceAll('-','')}`,`SUMMARY:${escapeText(h.description || 'Feriado')}`,`DESCRIPTION:${escapeText(description)}`,`URL:${h.articleUrl || CALENDAR_PAGE}`,'TRANSP:TRANSPARENT','END:VEVENT');
 }
 return lines.map(foldLine).join('\r\n')+'\r\nEND:VCALENDAR\r\n';
}
