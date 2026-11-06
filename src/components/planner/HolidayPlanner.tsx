import {useState} from 'react';
import {planBreaks, formatDay, calendarFile, type Area, type PlannerHoliday, type BreakPlan} from '../../utils/holidays/planner';

export default function HolidayPlanner({holidays}: {holidays: PlannerHoliday[]}) {
 const [year,setYear]=useState(2027), [area,setArea]=useState<Area>('national'), [budget,setBudget]=useState(0);
 const plans=planBreaks(holidays,year,area,budget,year===2026?'2026-11-06':'2027-01-01');
 function download(plan:BreakPlan) {
  const url=URL.createObjectURL(new Blob([calendarFile(plan)],{type:'text/calendar;charset=utf-8'}));
  const a=document.createElement('a');a.href=url;a.download=`descanso-${plan.start}.ics`;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
 }
 return <section aria-labelledby="planner-heading" className="not-prose my-8 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 sm:p-6">
  <h2 id="planner-heading" className="text-2xl font-bold text-emerald-950">Planifica tus días libres</h2>
  <p className="my-3 text-sm text-gray-700">Para quienes descansan sábados, domingos y feriados. Los días de vacaciones son sugerencias que debes acordar con tu empleador. Calculamos dentro del año elegido.</p>
  <div className="grid gap-4 sm:grid-cols-3">
   <label className="min-w-0 text-sm font-semibold">Año<select className="mt-1 min-w-0 w-full rounded-lg border bg-white p-3" value={year} onChange={e=>setYear(Number(e.target.value))}><option value={2027}>2027 completo</option><option value={2026}>2026 desde el 6 de noviembre</option></select></label>
   <label className="min-w-0 text-sm font-semibold">Zona<select className="mt-1 min-w-0 w-full rounded-lg border bg-white p-3" value={area} onChange={e=>setArea(e.target.value as Area)}><option value="national">Feriados nacionales</option><option value="arica">Arica y Parinacota</option><option value="chillan">Chillán y Chillán Viejo</option></select></label>
   <label className="min-w-0 text-sm font-semibold">Vacaciones disponibles<select className="mt-1 min-w-0 w-full rounded-lg border bg-white p-3" value={budget} onChange={e=>setBudget(Number(e.target.value))}><option value={0}>Sin pedir días</option><option value={1}>Hasta 1 día</option><option value={2}>Hasta 2 días</option></select></label>
  </div>
  <p role="status" aria-live="polite" className="my-4 font-semibold">{plans.length} {plans.length === 1 ? 'opción' : 'opciones'} de descanso</p>
  <div className="grid gap-3 sm:grid-cols-2">
   {plans.map(p=><article key={`${p.start}-${p.end}`} className="rounded-xl border border-emerald-100 bg-white p-4">
    <h3 className="font-bold">{formatDay(p.start)} al {formatDay(p.end)}</h3>
    <p className="my-2 text-lg font-semibold text-emerald-800">{p.days} días seguidos · {p.leave.length} de vacaciones</p>
    <p className="text-sm text-gray-700">{p.holidays.join(' · ')}</p>
    {p.leave.length>0 && <p className="mt-2 text-sm">Solicita: {p.leave.map(formatDay).join(' y ')}.</p>}
    <button type="button" className="mt-3 rounded-lg bg-emerald-800 px-3 py-2 text-sm text-white hover:bg-emerald-950 focus-visible:outline-2 focus-visible:outline-offset-2" onClick={()=>download(p)}>Agregar al calendario (.ics)</button>
   </article>)}
  </div>
  <p className="mt-4 text-sm text-gray-700">Las propuestas legislativas y el cierre bancario del 31 de diciembre no suman días libres. Revisión: 6 de noviembre de 2026.</p>
 </section>;
}
