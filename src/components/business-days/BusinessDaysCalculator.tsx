import { useEffect, useMemo, useState } from 'react';
import type { Area, PlannerHoliday } from '../../utils/holidays/planner';
import {
 AREA_LABELS, INITIAL_CALCULATION, MAX_DATE, MIN_DATE, calculateBusinessDays,
 decodeCalculation, encodeCalculation, fullDate, type CalculationOptions,
} from '../../utils/holidays/business-days';
import CalculationCalendar from './CalculationCalendar';

const control = 'mt-1 min-w-0 w-full rounded-lg border border-gray-300 bg-white p-3 text-base focus-visible:outline-2 focus-visible:outline-emerald-700';
export default function BusinessDaysCalculator({holidays}: {holidays: PlannerHoliday[]}) {
 const [options, setOptions] = useState<CalculationOptions>(INITIAL_CALCULATION);
 const [ready, setReady] = useState(false);
 const [linkError, setLinkError] = useState('');
 const [shareUrl, setShareUrl] = useState('');
 const [shareMessage, setShareMessage] = useState('');
 useEffect(() => {
  function restore() {
   setLinkError(''); setShareUrl(''); setShareMessage('');
   try {
    const parsed = decodeCalculation(window.location.hash);
    if (parsed) {
     setOptions(parsed);
     document.getElementById('calculadora')?.scrollIntoView({block:'start'});
     document.getElementById('business-heading')?.focus({preventScroll:true});
    }
   } catch (error) { setLinkError((error as Error).message); }
  }
  // Clicking the current example again does not fire hashchange, but must reset edits.
  function repeatExample(event: MouseEvent) {
   if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
   const anchor = event.target instanceof Element ? event.target.closest('a[href^="#calculo?"]') : null;
   if (anchor?.getAttribute('href') === window.location.hash) {
    event.preventDefault(); restore();
   }
  }
  restore(); setReady(true);
  window.addEventListener('hashchange', restore);
  document.addEventListener('click', repeatExample);
  return () => {
   window.removeEventListener('hashchange', restore);
   document.removeEventListener('click', repeatExample);
  };
 }, []);
 const {result, error} = useMemo(() => {
  try { return {result: calculateBusinessDays(holidays, options), error: ''}; }
  catch (error) { return {result: null, error: (error as Error).message}; }
 }, [holidays, options]);
 function update(patch: Partial<CalculationOptions>) {
  setOptions(previous => ({...previous, ...patch}));
  setLinkError(''); setShareUrl(''); setShareMessage('');
 }
 async function share() {
  const url = new URL(window.location.href);
  url.search = ''; url.hash = encodeCalculation(options);
  setShareUrl(url.href);
  try {
   await navigator.clipboard.writeText(url.href);
   setShareMessage('Enlace copiado. Al abrirlo se recuperan estas fechas y opciones.');
  } catch { setShareMessage('Copia el enlace del campo de abajo para compartir este cálculo.'); }
 }
 const failure = linkError || error;
 return <section id="calculadora" aria-labelledby="business-heading" className="not-prose my-8 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 sm:p-6 text-gray-900">
  <h2 id="business-heading" tabIndex={-1} className="text-2xl font-bold text-emerald-950">Calcula tus días hábiles</h2>
  <p className="my-3 text-sm text-gray-700">Lunes a viernes, descontando feriados de la zona elegida. Fechas disponibles: 2026 y 2027. Ejemplo inicial: enero de 2027.</p>
  <noscript><p className="my-3 rounded-lg bg-amber-100 p-3">Activa JavaScript para cambiar las fechas. El resultado visible corresponde al ejemplo de enero de 2027; puedes leer la guía y sus ejemplos sin activarlo.</p></noscript>
  <fieldset disabled={!ready} className="space-y-4">
   <legend className="sr-only">Opciones de la calculadora</legend>
   <div className="grid gap-4 sm:grid-cols-2">
    <label className="min-w-0 text-sm font-semibold">Qué quieres calcular
     <select className={control} value={options.mode} onChange={e => update({mode:e.target.value as CalculationOptions['mode'], includeStart:e.target.value === 'range'})}>
      <option value="range">Contar entre dos fechas</option><option value="add">Sumar días hábiles</option>
     </select>
    </label>
    <label className="min-w-0 text-sm font-semibold">Zona de los feriados
     <select className={control} value={options.area} onChange={e => update({area:e.target.value as Area})}>
      {Object.entries(AREA_LABELS).map(([value,label]) => <option key={value} value={value}>{label}</option>)}
     </select>
    </label>
    <label className="min-w-0 text-sm font-semibold">Fecha inicial
     <input className={control} type="date" min={MIN_DATE} max={MAX_DATE} value={options.start} onChange={e => update({start:e.target.value})} aria-describedby="calculation-rule" />
    </label>
    {options.mode === 'range' ? <label className="min-w-0 text-sm font-semibold">Fecha final
     <input className={control} type="date" min={MIN_DATE} max={MAX_DATE} value={options.end} onChange={e => update({end:e.target.value})} />
    </label> : <label className="min-w-0 text-sm font-semibold">Días hábiles a sumar
     <input className={control} type="number" min={1} max={520} step={1} value={Number.isFinite(options.amount) ? options.amount : ''} onChange={e => update({amount:e.target.valueAsNumber})} />
    </label>}
   </div>
   <label className="flex items-start gap-2 text-sm font-medium">
    <input className="mt-1 size-4 shrink-0 accent-emerald-700" type="checkbox" checked={options.includeStart} onChange={e => update({includeStart:e.target.checked})} />
    Incluir la fecha inicial en el conteo (solo suma como hábil si corresponde)
   </label>
  </fieldset>
  <p id="calculation-rule" className="mt-3 text-sm text-gray-700">
   {options.includeStart ? 'Se considera la fecha inicial.' : 'El conteo comienza al día siguiente de la fecha inicial.'}{' '}
   {options.mode === 'range' ? 'La fecha final siempre se considera.' : 'Se avanza hasta completar la cantidad de días hábiles indicada.'} Los resultados se actualizan al cambiar las opciones.
  </p>
  {failure ? <p role="alert" className="mt-4 rounded-lg border border-red-200 bg-red-50 p-3 text-red-900">{failure}</p> : result && <>
   <div role="status" aria-live="polite" aria-atomic="true" className="mt-5 rounded-xl bg-emerald-900 p-5 text-white">
    <p className="text-sm">{options.mode === 'add' ? 'Fecha resultante' : 'Días hábiles en el período'}</p>
    <p className="mt-1 text-2xl font-bold">{options.mode === 'add' ? fullDate(result.end) : `${result.business} ${result.business === 1 ? 'día hábil' : 'días hábiles'}`}</p>
    <p className="mt-2 text-sm">Del {fullDate(options.start)} al {fullDate(result.end)} · {options.includeStart ? 'con' : 'sin'} el día inicial · {AREA_LABELS[options.area]}.</p>
    <p className="mt-2 text-sm">{result.total} {result.total === 1 ? 'día considerado' : 'días considerados'} = {result.business} {result.business === 1 ? 'hábil' : 'hábiles'} + {result.weekends} de fin de semana + {result.holidays} {result.holidays === 1 ? 'feriado' : 'feriados'} de lunes a viernes.</p>
   </div>
   <p className="mt-3 text-xs text-gray-700">Si un feriado cae sábado o domingo, se muestra en el calendario y se descuenta una sola vez, como fin de semana.</p>
   <CalculationCalendar key={`${options.start}-${result.end}`} days={result.days} />
   <button type="button" disabled={!ready} onClick={share} className="mt-4 rounded-lg bg-emerald-800 px-4 py-3 font-semibold text-white hover:bg-emerald-950 focus-visible:outline-2 focus-visible:outline-offset-2 disabled:opacity-50">Copiar enlace del cálculo</button>
   <p role="status" className="mt-2 text-sm text-gray-700">{shareMessage}</p>
   {shareUrl && <label className="block text-sm font-semibold">Enlace para compartir<input className={control} type="text" value={shareUrl} readOnly onFocus={e => e.target.select()} /></label>}
  </>}
  <p className="mt-4 text-sm text-gray-700">Para organización personal. Un trámite, contrato o jornada puede tener reglas distintas. <a href="#cuando-usar-este-calculo" className="font-semibold text-emerald-800 underline">Revisa cuándo usar este cálculo</a>. Feriados revisados al 6 de noviembre de 2026; no se incluyen proyectos de ley.</p>
 </section>;
}
