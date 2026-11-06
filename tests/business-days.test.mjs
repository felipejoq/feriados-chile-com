import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import { calculateBusinessDays, encodeCalculation, decodeCalculation } from '../src/utils/holidays/business-days.ts';
const holidays = [2026, 2027].flatMap(year => readdirSync(`src/content/holidays_${year}`).map(file => ({id:file, ...JSON.parse(readFileSync(`src/content/holidays_${year}/${file}`))})));
const base = {mode:'range', start:'2027-01-01', end:'2027-01-31', amount:10, area:'national', includeStart:true};
const calc = options => calculateBusinessDays(holidays, {...base, ...options});

test('January 2027 counts both endpoints, excludes New Year and ten weekend days', () => {
 const r = calc({});
 assert.deepEqual([r.business, r.weekends, r.holidays, r.total], [20, 10, 1, 31]);
 assert.equal(r.days[0].kind, 'holiday');
});
test('a holiday on Saturday is excluded once while keeping its holiday label', () => {
 const r = calc({start:'2027-09-17', end:'2027-09-19'});
 assert.deepEqual([r.business, r.weekends, r.holidays, r.total], [0, 2, 1, 3]);
 assert.ok(r.days[1].names.includes('Independencia Nacional'));
});
test('local holidays apply only to their beneficiaries', () => {
 assert.equal(calc({start:'2027-06-07', end:'2027-06-07'}).business, 1);
 assert.equal(calc({start:'2027-06-07', end:'2027-06-07', area:'arica'}).business, 0);
 assert.equal(calc({start:'2027-08-20', end:'2027-08-20', area:'chillan'}).business, 0);
 assert.equal(calc({start:'2027-08-20', end:'2027-08-20', area:'arica'}).business, 1);
});
test('range can exclude the start, including an empty one-day range', () => {
 assert.equal(calc({start:'2027-01-04', end:'2027-01-05', includeStart:false}).business, 1);
 const r = calc({start:'2027-01-04', end:'2027-01-04', includeStart:false});
 assert.equal(r.total, 0);
 assert.equal(r.days[0].kind, 'excluded');
});
test('adding five days after December 6 skips December 8 and the weekend', () => {
 const r = calc({mode:'add', start:'2027-12-06', amount:5, includeStart:false});
 assert.equal(r.end, '2027-12-14');
 assert.deepEqual(r.days.filter(d=>d.kind==='business').map(d=>d.date), ['2027-12-07','2027-12-09','2027-12-10','2027-12-13','2027-12-14']);
 assert.equal(r.total, 8);
});
test('including the start only counts it if it is a business day', () => {
 assert.equal(calc({mode:'add', start:'2027-12-06', amount:5}).end, '2027-12-13');
 assert.equal(calc({mode:'add', start:'2027-12-08', amount:1}).end, '2027-12-09');
});
test('addition crosses years with New Year excluded and December 31 counted', () => {
 const r = calc({mode:'add', start:'2026-12-30', amount:2, includeStart:false});
 assert.equal(r.end, '2027-01-04');
 assert.equal(r.days.find(d=>d.date==='2026-12-31').kind, 'business');
});
test('shifted holidays use their observed date and ignore bank-only special entries', () => {
 assert.equal(calc({start:'2027-06-28',end:'2027-06-29'}).business, 1);
 const r = calculateBusinessDays([...holidays,{id:'bank',date:'2027-12-31',type:'Especial',description:'Banco'}], {...base,start:'2027-12-31',end:'2027-12-31'});
 assert.equal(r.business,1);
});
test('calendar calculation stays correct across Chile daylight saving changes', () => {
 const r = calc({start:'2027-09-03', end:'2027-09-06'});
 assert.deepEqual([r.business,r.weekends,r.total], [2,2,4]);
});
test('malformed, impossible and unsupported dates never silently roll forward', () => {
 for (const start of ['', '2027-02-29', '2026-02-30', '2027-13-01', '01/01/2027','2025-12-31','2028-01-01']) assert.throws(()=>calc({start}));
 assert.throws(()=>calc({start:'2027-02-01',end:'2027-01-31'}));
 assert.throws(()=>calc({mode:'add',start:'2027-12-31',amount:1,includeStart:false}));
});
test('invalid options and unbounded amounts are rejected', () => {
 for (const amount of [0,-1,1.5,NaN,Infinity,1000000]) assert.throws(()=>calc({mode:'add',amount}));
 assert.throws(()=>calc({area:'unknown'}));
 assert.throws(()=>calc({mode:'unknown'}));
 assert.throws(()=>calc({includeStart:'false'}));
});
test('shared links restore options and the same result without changing unrelated anchors', () => {
 const options = {...base,mode:'add',start:'2027-06-04',area:'arica',includeStart:false,amount:1};
 const restored = decodeCalculation(encodeCalculation(options));
 assert.deepEqual(restored,options);
 assert.equal(calculateBusinessDays(holidays,restored).end,'2027-06-08');
 assert.equal(decodeCalculation('#fuentes'),null);
 assert.throws(()=>decodeCalculation('#calculo?modo=add&desde=2027-01-01'));
 assert.throws(()=>decodeCalculation('#calculo?modo=range&desde=2027-01-01&hasta=2027-01-31&dias=10&zona=arica&inicio=no'));
});
