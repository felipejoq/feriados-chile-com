import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import { planBreaks, calendarFile } from '../src/utils/holidays/planner.ts';
const holidays = readdirSync('src/content/holidays_2027').map(f => ({id:f.replace('.json',''), ...JSON.parse(readFileSync(`src/content/holidays_2027/${f}`))})).map(h=>({...h,id:h.slug || h.id}));
test('2027 has nine national long weekends, including September 17', () => {
 const plans = planBreaks(holidays, 2027, 'national', 0);
 assert.equal(plans.length, 9);
 assert.ok(plans.some(p => p.start === '2027-09-17' && p.end === '2027-09-19'));
 assert.ok(!plans.some(p => p.start === '2027-12-31'));
});
test('local holidays only extend weekends in the selected area', () => {
 assert.equal(planBreaks(holidays,2027,'arica',0).length,10);
 assert.equal(planBreaks(holidays,2027,'chillan',0).length,10);
});
test('December 8 allows five days off with two vacation days', () => {
 const p = planBreaks(holidays,2027,'national',2).find(p=>p.start==='2027-12-04' && p.end==='2027-12-08');
 assert.deepEqual(p?.leave,['2027-12-06','2027-12-07']);
 assert.equal(p?.days,5);
});
test('budget zero never invents vacation days and dates stay within year', () => {
 for (const p of planBreaks(holidays,2027,'national',0)) {
  assert.equal(p.leave.length,0); assert.match(p.start,/^2027-/); assert.match(p.end,/^2027-/);
 }
});
test('calendar export has an exclusive end and marks suggested leave', () => {
 const p = {start:'2027-12-04',end:'2027-12-08',days:5,leave:['2027-12-06','2027-12-07'],holidays:['Inmaculada Concepción']};
 const ics = calendarFile(p);
 assert.ok(ics.includes('DTEND;VALUE=DATE:20271209'));
 assert.ok(ics.includes('Sugerencia'));
 assert.ok(ics.includes('2027-12-06'));
});
test('vacation days can extend either edge of a long weekend', () => {
 const holidays=[{id:'navidad',date:'2026-12-25',description:'Navidad',type:'Religioso'}];
 const plans=planBreaks(holidays,2026,'national',1,'2026-11-06');
 assert.ok(plans.some(p=>p.start==='2026-12-24' && p.end==='2026-12-27' && p.leave[0]==='2026-12-24'));
 assert.ok(plans.some(p=>p.start==='2026-12-25' && p.end==='2026-12-28' && p.leave[0]==='2026-12-28'));
});
