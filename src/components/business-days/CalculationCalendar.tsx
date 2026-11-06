import { useState } from 'react';
import { fullDate, type CalculationDay } from '../../utils/holidays/business-days';

const labels = {business: 'Hábil', weekend: 'Fin de semana', holiday: 'Feriado', excluded: 'Inicio no contado'};
const styles = {
 business: 'bg-emerald-100 text-emerald-950', weekend: 'bg-slate-100 text-slate-700',
 holiday: 'bg-amber-100 text-amber-950', excluded: 'bg-white text-gray-500 border border-dashed border-gray-400',
};
export default function CalculationCalendar({days}: {days: CalculationDay[]}) {
 const months = [...new Set(days.map(day => day.date.slice(0, 7)))];
 const [selected, setSelected] = useState(months[0]);
 const month = months.includes(selected) ? selected : months[0];
 const current = days.filter(day => day.date.startsWith(month));
 const byDate = new Map(current.map(day => [Number(day.date.slice(8)), day]));
 const [year, monthNumber] = month.split('-').map(Number);
 const offset = (new Date(Date.UTC(year, monthNumber - 1, 1)).getUTCDay() + 6) % 7;
 const lastDay = new Date(Date.UTC(year, monthNumber, 0)).getUTCDate();
 const monthLabel = (value: string) => new Intl.DateTimeFormat('es-CL', {month:'long',year:'numeric',timeZone:'UTC'}).format(new Date(`${value}-01T12:00:00Z`));
 const cells = Array.from({length: Math.ceil((offset + lastDay) / 7) * 7}, (_, i) => i - offset + 1);
 return <div className="mt-6 rounded-xl border border-emerald-100 bg-white p-3 sm:p-5">
  <h3 className="text-lg font-bold">Así se cuenta en el calendario</h3>
  <label className="my-3 block text-sm font-semibold">Mes del cálculo
   <select className="mt-1 w-full rounded-lg border border-gray-300 bg-white p-2" value={month} onChange={e => setSelected(e.target.value)}>
    {months.map(m => <option key={m} value={m}>{monthLabel(m)}</option>)}
   </select>
  </label>
  <p className="mb-3 text-xs text-gray-700">H: día hábil y su número en el conteo · F: feriado · S/D: fin de semana · —: inicio no contado. Sin fondo: fuera del período.</p>
  <table className="w-full table-fixed border-separate border-spacing-1 text-center text-sm" aria-label={`Calendario del cálculo: ${monthLabel(month)}`}>
   <thead><tr>{['Lu','Ma','Mi','Ju','Vi','Sá','Do'].map(d => <th key={d} scope="col" className="pb-1">{d}</th>)}</tr></thead>
   <tbody>{Array.from({length: cells.length / 7}, (_, row) => <tr key={row}>
    {cells.slice(row * 7, row * 7 + 7).map((day, col) => {
     if (day < 1 || day > lastDay) return <td key={col} />;
     const entry = byDate.get(day);
     const description = entry ? `${fullDate(entry.date)}: ${labels[entry.kind]}${entry.ordinal ? ` número ${entry.ordinal}` : ''}${entry.names.length ? `. ${entry.names.join(', ')}` : ''}` : `${day}: fuera del período`;
     return <td key={col} title={description} className={`h-14 rounded-md ${entry ? styles[entry.kind] : 'text-gray-400'}`}>
      <span className="sr-only">{description}</span>
      <span aria-hidden="true" className="block font-semibold">{day}</span>
      <span aria-hidden="true" className="block text-[10px] sm:text-xs">{entry ? entry.kind === 'business' ? `H${entry.ordinal}` : entry.kind === 'holiday' ? 'F' : entry.kind === 'weekend' ? 'S/D' : '—' : ''}</span>
     </td>;
    })}
   </tr>)}</tbody>
  </table>
  {current.some(d => d.names.length) && <ul className="mt-3 space-y-1 text-sm text-gray-700">
   {current.filter(d => d.names.length).map(d => <li key={d.date}><strong>{fullDate(d.date)}:</strong> {d.names.join(' · ')}{d.kind === 'weekend' ? ' (ya descontado como fin de semana)' : ''}{d.kind === 'excluded' ? ' (inicio no contado)' : ''}.</li>)}
  </ul>}
 </div>;
}
