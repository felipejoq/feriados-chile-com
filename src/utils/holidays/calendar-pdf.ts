import { jsPDF } from 'jspdf';
import { REVIEWED_LABEL } from './coverage.ts';
import { MONTHS, CALENDAR_PAGE, COMMERCE_SOURCE, calendarTitle, calendarSubtitle, legalSource, monthGrid, type CalendarOptions, type DatedHoliday } from './calendar-export.ts';

/** Vector text and grids: printable A4, no screenshots or HTML rendering. */
export function createCalendarPDF(holidays: DatedHoliday[], options: CalendarOptions): jsPDF {
 const pdf = new jsPDF({unit:'mm',format:'a4',compress:true});
 const green = [6,78,59] as const;
 pdf.setProperties({title:calendarTitle(options),author:'feriados-chile.com',subject:calendarSubtitle(options),creator:'Feriados de Chile'});
 function header(title: string) {
  pdf.setFillColor(...green);pdf.rect(0,0,210,33,'F');
  pdf.setTextColor(255,255,255);pdf.setFont('helvetica','bold');pdf.setFontSize(18);pdf.text(title,12,14);
  pdf.setFont('helvetica','normal');pdf.setFontSize(9);pdf.text(calendarSubtitle(options),12,23);
  pdf.setTextColor(30,41,59);
 }
 function drawMonth(month: number, x: number, y: number, width: number, height: number) {
  const large=width>100, cellWidth=width/7, rowHeight=(height-16)/6;
  pdf.setFont('helvetica','bold');pdf.setFontSize(large?14:10);pdf.setTextColor(...green);pdf.text(MONTHS[month-1],x,y+4);
  pdf.setFontSize(large?9:7);
  ['L','M','X','J','V','S','D'].forEach((label,i)=>pdf.text(label,x+cellWidth*(i+.5),y+11,{align:'center'}));
  const highlighted=new Map(holidays.filter(h=>Number(h.date.slice(5,7))===month).map(h=>[Number(h.date.slice(8)),h]));
  monthGrid(options.year,month).forEach((day,index)=>{
   if(!day)return;
   const col=index%7,row=Math.floor(index/7),cx=x+col*cellWidth,cy=y+14+row*rowHeight;
   const holiday=highlighted.get(day);
   if(holiday){
    if(holiday.irrenunciable) pdf.setFillColor(254,230,173); else pdf.setFillColor(209,250,229);
    pdf.roundedRect(cx+.5,cy,cellWidth-1,rowHeight-1,1,1,'F');
   }
   pdf.setFont('helvetica',holiday?'bold':'normal');
   if(col>=5&&!holiday) pdf.setTextColor(100,116,139); else pdf.setTextColor(30,41,59);
   pdf.setFontSize(large?13:8);
   pdf.text(`${day}${holiday?.irrenunciable?'*':holiday?'+':''}`,cx+cellWidth/2,cy+rowHeight*.62,{align:'center'});
  });
 }
 function list(start: number) {
  let y=start;
  pdf.setFont('helvetica','bold');pdf.setFontSize(12);pdf.setTextColor(...green);pdf.text('Fechas incluidas y respaldo legal',12,y);y+=9;
  if(!holidays.length){pdf.setFont('helvetica','normal');pdf.setFontSize(10);pdf.text('No hay feriados que coincidan con esta selección.',12,y);return;}
  for(const h of holidays){
   const legal=`${h.type==='Local'?h.beneficiaries:'Nacional'} | ${h.legalSupport}`;
   pdf.setFont('helvetica','normal');pdf.setFontSize(7.5);
   const legalLines: string[]=pdf.splitTextToSize(legal,152);
   const rowHeight=6+legalLines.length*3.5;
   if(y+rowHeight>253){pdf.addPage();header('Fechas y fuentes (continuación)');y=44;}
   pdf.setFont('helvetica','bold');pdf.setFontSize(9);pdf.setTextColor(30,41,59);
   const [,month,day]=h.date.split('-');
   pdf.text(`${day}/${month}`,12,y);
   pdf.text(`${h.description}${h.irrenunciable?' *':''}`,29,y);
   pdf.setFont('helvetica','normal');pdf.setFontSize(7.5);pdf.setTextColor(71,85,105);pdf.text(legalLines,29,y+4);
   pdf.setTextColor(...green);pdf.setFontSize(7);pdf.textWithLink('Fuente',187,y,{url:legalSource(h)});
   y+=rowHeight;
   pdf.setDrawColor(226,232,240);pdf.line(12,y-3,198,y-3);
  }
 }
 header(calendarTitle(options));
 if(options.month){drawMonth(options.month,14,40,182,108);list(163);}
 else {
  for(let i=0;i<12;i++)drawMonth(i+1,12+(i%3)*64,40+Math.floor(i/3)*51,58,46);
  pdf.addPage();header(`Feriados ${options.year}: fechas y fuentes`);list(44);
 }
 const pages=pdf.getNumberOfPages();
 for(let page=1;page<=pages;page++){
  pdf.setPage(page);pdf.setFont('helvetica','normal');pdf.setFontSize(8);pdf.setTextColor(51,65,85);
  pdf.text('+ Feriado seleccionado. * Irrenunciable del comercio, con excepciones legales.',12,263);
  pdf.textWithLink('Alcance y excepciones: Dirección del Trabajo',12,268,{url:COMMERCE_SOURCE});
  pdf.setFontSize(7.5);
  pdf.text(`Revisión: ${REVIEWED_LABEL}. Copia estática; no se actualiza automáticamente.`,12,274);
  pdf.text('No incluye proyectos de ley ni añade eventos para todos los domingos.',12,279);
  pdf.setTextColor(...green);pdf.textWithLink('feriados-chile.com/calendario-feriados-chile-descargar',12,286,{url:CALENDAR_PAGE});
  pdf.setTextColor(71,85,105);pdf.text(`${page} / ${pages}`,198,286,{align:'right'});
 }
 return pdf;
}
