import {useEffect,useState} from 'react';
import {AREA_LABELS,fullDate} from '../../utils/holidays/business-days';
import {DEFAULT_YEAR,REVIEWED_YEARS,REVIEWED_LABEL} from '../../utils/holidays/coverage';
import {MONTHS,COMMERCE_SOURCE,calendarFilename,calendarICS,legalSource,monthGrid,selectCalendarHolidays,type CalendarHoliday,type CalendarOptions,type DatedHoliday} from '../../utils/holidays/calendar-export';

const control='mt-1 w-full min-w-0 rounded-lg border border-gray-300 bg-white p-3 text-base';
function saveFile(blob: Blob, filename: string) {
 const url=URL.createObjectURL(blob),anchor=document.createElement('a');
 anchor.href=url;anchor.download=filename;document.body.append(anchor);anchor.click();anchor.remove();
 setTimeout(()=>URL.revokeObjectURL(url),10000);
}
function MonthPreview({year,month,holidays}:{year:number;month:number;holidays:DatedHoliday[]}) {
 const dates=new Map(holidays.filter(h=>Number(h.date.slice(5,7))===month).map(h=>[Number(h.date.slice(8)),h]));
 const grid=monthGrid(year,month);
 return <table className="w-full table-fixed border-separate border-spacing-1 text-center text-xs" aria-label={`${MONTHS[month-1]} de ${year}`}>
  <caption className="pb-2 text-left text-base font-bold text-emerald-950">{MONTHS[month-1]} {year}</caption>
  <thead><tr>{['Lu','Ma','Mi','Ju','Vi','Sá','Do'].map(d=><th key={d} scope="col">{d}</th>)}</tr></thead>
  <tbody>{Array.from({length:6},(_,row)=><tr key={row}>{grid.slice(row*7,row*7+7).map((day,col)=>{
   const h=day?dates.get(day):undefined;
   return <td key={col} className={`h-9 rounded ${h?.irrenunciable?'bg-amber-100 font-bold text-amber-950':h?'bg-emerald-100 font-bold text-emerald-950':col>4?'text-gray-500':'text-gray-800'}`}>
    {day && <><span aria-hidden="true">{day}{h?.irrenunciable?'*':h?'+':''}</span><span className="sr-only">{day} de {MONTHS[month-1]}{h?`: ${h.description}${h.irrenunciable?', irrenunciable del comercio con excepciones legales':''}`:''}</span></>}
   </td>;
  })}</tr>)}</tbody>
 </table>;
}
export default function DownloadableCalendar({holidays}:{holidays:CalendarHoliday[]}) {
 const [options,setOptions]=useState<CalendarOptions>({year:DEFAULT_YEAR,area:'national',month:0,onlyMandatory:false});
 const [ready,setReady]=useState(false),[busy,setBusy]=useState(false),[message,setMessage]=useState(''),[error,setError]=useState('');
 useEffect(()=>setReady(true),[]);
 const selected=selectCalendarHolidays(holidays,options);
 const months=options.month?[options.month]:Array.from({length:12},(_,i)=>i+1);
 function update(patch:Partial<CalendarOptions>){setOptions(previous=>({...previous,...patch}));setMessage('');setError('');}
 async function download(format:'pdf'|'ics') {
  setBusy(true);setError('');setMessage(format==='pdf'?'Preparando el PDF…':'Preparando el calendario…');
  try {
   const filename=calendarFilename(options);
   if(format==='pdf'){
    const {createCalendarPDF}=await import('../../utils/holidays/calendar-pdf');
    const pdf=createCalendarPDF(selected,options);saveFile(pdf.output('blob'),`${filename}.pdf`);
   }else saveFile(new Blob([calendarICS(selected,options)],{type:'text/calendar;charset=utf-8'}),`${filename}.ics`);
   setMessage(`Archivo ${format.toUpperCase()} preparado. Revisa las descargas de tu navegador. Es una copia sin actualización automática.`);
  }catch{setError('No pudimos preparar el archivo. Inténtalo nuevamente.');setMessage('');}
  finally{setBusy(false);}
 }
 return <section id="calendario-descargable" aria-labelledby="download-calendar-heading" className="not-prose my-8 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 sm:p-6 text-gray-900">
  <h2 id="download-calendar-heading" className="text-2xl font-bold text-emerald-950">Personaliza tu calendario de feriados</h2>
  <p className="my-3 text-sm text-gray-700">Elige lo que quieres ver y descargar. PDF en tamaño A4; archivo .ics para importar a tu aplicación de calendario. Revisión: {REVIEWED_LABEL}.</p>
  <noscript><p>Activa JavaScript para cambiar los filtros y descargar los archivos. La vista inicial muestra {DEFAULT_YEAR} con feriados nacionales.</p></noscript>
  <fieldset disabled={!ready||busy} className="grid gap-4 sm:grid-cols-2">
   <legend className="sr-only">Opciones del calendario descargable</legend>
   <label className="min-w-0 text-sm font-semibold">Año del calendario<select className={control} value={options.year} onChange={e=>update({year:Number(e.target.value)})}>{[...REVIEWED_YEARS].reverse().map(year=><option key={year} value={year}>{year}</option>)}</select></label>
   <label className="min-w-0 text-sm font-semibold">Zona del calendario<select className={control} value={options.area} onChange={e=>update({area:e.target.value as CalendarOptions['area']})}>{Object.entries(AREA_LABELS).map(([value,label])=><option key={value} value={value}>{label}</option>)}</select></label>
   <label className="min-w-0 text-sm font-semibold">Período a descargar<select className={control} value={options.month} onChange={e=>update({month:Number(e.target.value)})}><option value={0}>Año completo</option>{MONTHS.map((month,i)=><option key={month} value={i+1}>{month}</option>)}</select></label>
   <label className="min-w-0 text-sm font-semibold">Feriados a incluir<select className={control} value={options.onlyMandatory?'mandatory':'all'} onChange={e=>update({onlyMandatory:e.target.value==='mandatory'})}><option value="all">Todos los feriados fechados</option><option value="mandatory">Solo irrenunciables del comercio</option></select></label>
  </fieldset>
  <p role="status" aria-live="polite" className="mt-4 font-semibold">{selected.length} {selected.length===1?'feriado incluido':'feriados incluidos'} en esta selección.</p>
  {options.onlyMandatory && <p className="mt-2 rounded-lg bg-amber-100 p-3 text-sm">Esta selección muestra solo los cinco feriados irrenunciables del comercio que coincidan con el período. Los demás feriados siguen existiendo. Hay actividades exceptuadas: <a className="underline" href={COMMERCE_SOURCE}>consulta el alcance en la Dirección del Trabajo</a>.</p>}
  <div className="my-4 flex flex-wrap gap-3">
   <button type="button" disabled={!ready||busy} onClick={()=>download('pdf')} className="rounded-lg bg-emerald-800 px-4 py-3 font-semibold text-white hover:bg-emerald-950 disabled:opacity-50">Descargar PDF</button>
   <button type="button" disabled={!ready||busy||!selected.length} onClick={()=>download('ics')} className="rounded-lg border border-emerald-800 bg-white px-4 py-3 font-semibold text-emerald-900 hover:bg-emerald-100 disabled:opacity-50">Descargar calendario (.ics)</button>
  </div>
  {!selected.length && <p className="text-sm text-gray-700">No hay feriados con estos filtros. Puedes descargar el PDF como calendario del mes; el archivo .ics no se genera vacío.</p>}
  <p role="status" className="text-sm text-gray-700">{message}</p>
  {error && <p role="alert" className="text-sm text-red-800">{error}</p>}
  <p className="my-3 text-sm text-gray-700">+ Feriado seleccionado · * Irrenunciable del comercio, con excepciones legales. No agregamos eventos para cada domingo ni incluimos proyectos de ley.</p>
  <div className={`grid gap-4 ${options.month?'':'sm:grid-cols-2'}`}>
   {months.map(month=><div key={month} className="min-w-0 rounded-xl border border-emerald-100 bg-white p-3"><MonthPreview year={options.year} month={month} holidays={selected}/></div>)}
  </div>
  <details className="mt-4 rounded-xl border border-emerald-100 bg-white p-4">
   <summary className="cursor-pointer font-bold">Ver fechas y fuentes oficiales ({selected.length})</summary>
   <ul className="mt-3 space-y-4 text-sm">{selected.map(h=><li key={h.id}>
    <strong>{fullDate(h.date)}: {h.description}</strong>
    <p>{h.type==='Local'?h.beneficiaries:'Nacional'}{h.irrenunciable?' · Irrenunciable del comercio, con excepciones legales':''}.</p>
    <p>{h.legalSupport}. <a className="text-emerald-800 underline" href={legalSource(h)}>Fuente legal principal</a>{h.articleUrl && <> · <a className="text-emerald-800 underline" href={h.articleUrl}>Leer explicación</a></>}</p>
   </li>)}</ul>
  </details>
  <p className="mt-4 text-sm text-gray-700">Descargar o importar es guardar una copia; no crea una suscripción. <a className="font-semibold text-emerald-800 underline" href="#como-importar-el-calendario">Ver instrucciones de importación</a>.</p>
 </section>;
}
