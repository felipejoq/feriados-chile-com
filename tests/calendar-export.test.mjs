import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,readdirSync} from 'node:fs';
import {selectCalendarHolidays, calendarICS, monthGrid} from '../src/utils/holidays/calendar-export.ts';
const holidays=[2026,2027].flatMap(year=>readdirSync(`src/content/holidays_${year}`).map(file=>({id:file.replace('.json',''),...JSON.parse(readFileSync(`src/content/holidays_${year}/${file}`))})));
const options={year:2027,area:'national',month:0,onlyMandatory:false};
const select=patch=>selectCalendarHolidays(holidays,{...options,...patch});
test('calendar exports dated holidays only, sorted, with local holidays opt-in',()=>{
 assert.equal(select({}).length,17);
 assert.equal(select({year:2026}).length,16);
 assert.equal(select({area:'arica'}).length,18);
 assert.equal(select({area:'chillan'}).length,18);
 assert.equal(select({})[0].date,'2027-01-01');
 assert.equal(select({}).at(-1).date,'2027-12-25');
 assert.ok(!select({}).some(h=>h.type==='Local'||h.date.endsWith('12-31')));
});
test('mandatory filter is exactly the five commerce holidays and respects month',()=>{
 assert.deepEqual(select({onlyMandatory:true}).map(h=>h.date),['2027-01-01','2027-05-01','2027-09-18','2027-09-19','2027-12-25']);
 assert.equal(select({month:9}).length,3);
 assert.equal(select({month:9,onlyMandatory:true}).length,2);
 assert.equal(select({month:2}).length,0);
});
test('unsupported years, bad months and unknown areas cannot create misleading exports',()=>{
 for(const patch of [{year:2028},{month:13},{month:-1},{month:1.5},{area:'unknown'},{onlyMandatory:'false'}]) assert.throws(()=>select(patch));
});
test('grid starts on Monday, handles January Sunday alignment and leap February',()=>{
 const jan=monthGrid(2027,1); assert.deepEqual(jan.slice(0,7),[null,null,null,null,1,2,3]);
 assert.equal(jan.filter(Boolean).length,31);
 assert.equal(monthGrid(2028,2).filter(Boolean).length,29);
 assert.equal(monthGrid(2027,2).filter(Boolean).length,28);
});
test('ICS is all-day with exclusive end, legal context and no recurrence or alarms',()=>{
 const ics=calendarICS(select({month:9}),options,new Date('2026-11-06T12:00:00Z'));
 const unfolded=ics.replace(/\r\n /g,'');
 assert.equal((ics.match(/BEGIN:VEVENT/g)||[]).length,3);
 assert.ok(unfolded.includes('DTSTART;VALUE=DATE:20270917\r\nDTEND;VALUE=DATE:20270918'));
 assert.ok(unfolded.includes('Ley 20.983'));
 assert.ok(unfolded.includes('https://www.bcn.cl/leychile/navegar?i=1098384'));
 assert.ok(unfolded.includes('TRANSP:TRANSPARENT'));
 assert.ok(!/RRULE|VALARM|ORGANIZER|ATTENDEE/.test(ics));
});
test('event identities stay stable across filters and text escapes cannot inject ICS properties',()=>{
 const one=select({month:1});
 const uid=text=>text.match(/UID:(.*)\r\n/)[1];
 assert.equal(uid(calendarICS(one,options)),uid(calendarICS(one,{...options,onlyMandatory:true})));
 const strange={...one[0],description:'Prueba, Ñuble; línea\\dos\nBEGIN:VEVENT\r\nFINAL'};
 const ics=calendarICS([strange],options);
 assert.equal((ics.match(/\r\nBEGIN:VEVENT\r\n/g)||[]).length,1);
 assert.ok(ics.replace(/\r\n /g,'').includes('SUMMARY:Prueba\\, Ñuble\\; línea\\\\dos\\nBEGIN:VEVENT\\nFINAL'));
 for(const line of ics.split('\r\n'))assert.ok(Buffer.byteLength(line,'utf8')<=75);
});
test('official sources work with Astro glob IDs derived from the content slug',()=>{
 const fromAstro=select({month:1}).map(h=>({...h,id:h.slug}));
 assert.ok(calendarICS(fromAstro,options).includes('BEGIN:VEVENT'));
});
