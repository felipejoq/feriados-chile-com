export interface PlannerHoliday { id: string; date?: string | null; description?: string; type: string; beneficiaries?: string }
export interface BreakPlan { start: string; end: string; days: number; leave: string[]; holidays: string[] }
export type Area = 'national' | 'arica' | 'chillan';
const DAY = 86400000;
const iso = (time: number) => new Date(time).toISOString().slice(0,10);
export const formatDay = (date: string) => new Intl.DateTimeFormat('es-CL', {day:'numeric', month:'long', timeZone:'UTC'}).format(new Date(`${date}T12:00:00Z`));

// Calendar dates are evaluated in UTC so results do not depend on the build/server timezone.
export function planBreaks(holidays: PlannerHoliday[], year: number, area: Area, budget: number, from = `${year}-01-01`): BreakPlan[] {
 const applicable = holidays.filter(h => h.date?.startsWith(`${year}-`) && h.type !== 'Especial' && (h.type !== 'Local' || (area === 'arica' && h.beneficiaries === 'Región de Arica y Parinacota') || (area === 'chillan' && h.beneficiaries === 'Comunas de Chillán y Chillán Viejo')));
 const dates = new Map(applicable.map(h => [h.date!, h.description || 'Feriado']));
 const days = [];
 for (let t=Date.UTC(year,0,1); t<Date.UTC(year+1,0,1); t+=DAY) {
  const date=iso(t), weekday=new Date(t).getUTCDay();
  days.push({date,free:weekday===0 || weekday===6 || dates.has(date),holiday:dates.get(date)});
 }
 const plans: BreakPlan[]=[];
 const maxLeave=Math.max(0,Math.min(2,Math.floor(budget)));
 for(let i=0;i<days.length;i++) {
  if(days[i].date<from) continue;
  const leave:string[]=[], names=new Set<string>();
  for(let j=i;j<days.length;j++) {
   const d=days[j];
   if(!d.free) leave.push(d.date);
   if(leave.length>maxLeave) break;
   if(d.holiday) names.add(d.holiday);
   if(names.size && j-i+1>=3) plans.push({start:days[i].date,end:d.date,days:j-i+1,leave:[...leave],holidays:[...names]});
  }
 }
 // Keep maximal intervals at each vacation cost; retain zero-cost alternatives.
 return plans.filter(p=>!plans.some(q=>q!==p && q.start<=p.start && q.end>=p.end && q.leave.length<=p.leave.length && q.days>p.days));
}

export function calendarFile(plan: BreakPlan): string {
 const compact=(date:string)=>date.replaceAll('-','');
 const end=iso(Date.parse(`${plan.end}T00:00:00Z`)+DAY);
 const description=plan.leave.length ? `Sugerencia: solicitar ${plan.leave.join(', ')}. Requiere acuerdo con tu empleador.` : 'Descanso para jornada de lunes a viernes. Revisa las condiciones de tu trabajo.';
 const escape=(s:string)=>s.replaceAll('\\','\\\\').replaceAll('\n','\\n').replaceAll(',','\\,').replaceAll(';','\\;');
 const lines=['BEGIN:VCALENDAR','VERSION:2.0','PRODID:-//Feriados Chile//Planificador//ES','BEGIN:VEVENT',`UID:${plan.start}-${plan.end}@feriados-chile.com`,`DTSTAMP:${new Date().toISOString().replace(/[-:]/g,'').replace(/\.\d{3}/,'')}`,`DTSTART;VALUE=DATE:${compact(plan.start)}`,`DTEND;VALUE=DATE:${compact(end)}`,`SUMMARY:${plan.leave.length?'Sugerencia de descanso':'Fin de semana largo'} en Chile`,`DESCRIPTION:${escape(description)}`,'END:VEVENT','END:VCALENDAR'];
 // RFC 5545 folds content lines at 75 octets, including multibyte Spanish text.
 return lines.map(line=>{let out='',bytes=0;for(const char of line){const size=new TextEncoder().encode(char).length;if(bytes+size>75){out+='\r\n ';bytes=1;}out+=char;bytes+=size;}return out;}).join('\r\n')+'\r\n';
}
