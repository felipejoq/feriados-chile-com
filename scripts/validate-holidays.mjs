import assert from 'node:assert/strict';
import { readdir, readFile } from 'node:fs/promises';

const expectedCalendars = {
  2026: {
    'Año Nuevo': ['2026-01-01', true],
    'Viernes Santo - Semana Santa': ['2026-04-03', false],
    'Sábado Santo - Semana Santa': ['2026-04-04', false],
    'Día Nacional del Trabajo': ['2026-05-01', true],
    'Día de las Glorias Navales': ['2026-05-21', false],
    'Asalto y Toma del Morro de Arica': ['2026-06-07', false],
    'Día Nacional de los Pueblos Indígenas': ['2026-06-21', false],
    'San Pedro y San Pablo': ['2026-06-29', false],
    'Día de la Virgen del Carmen': ['2026-07-16', false],
    'Asunción de la Virgen': ['2026-08-15', false],
    'Nacimiento del Prócer de la Independencia': ['2026-08-20', false],
    'Independencia Nacional': ['2026-09-18', true],
    'Día de las Glorias del Ejército': ['2026-09-19', true],
    'Encuentro de Dos Mundos': ['2026-10-12', false],
    'Día de las Iglesias Evangélicas y Protestantes': ['2026-10-31', false],
    'Día de Todos los Santos': ['2026-11-01', false],
    'Inmaculada Concepción': ['2026-12-08', false],
    'Navidad': ['2026-12-25', true],
    'Feriado Bancario': ['2026-12-31', false],
    'Todos los días Domingos': [null, false],
  },
  2027: {
    'Año Nuevo': ['2027-01-01', true],
    'Viernes Santo - Semana Santa': ['2027-03-26', false],
    'Sábado Santo - Semana Santa': ['2027-03-27', false],
    'Día Nacional del Trabajo': ['2027-05-01', true],
    'Día de las Glorias Navales': ['2027-05-21', false],
    'Asalto y Toma del Morro de Arica': ['2027-06-07', false],
    'Día Nacional de los Pueblos Indígenas': ['2027-06-21', false],
    'San Pedro y San Pablo': ['2027-06-28', false],
    'Día de la Virgen del Carmen': ['2027-07-16', false],
    'Asunción de la Virgen': ['2027-08-15', false],
    'Nacimiento del Prócer de la Independencia': ['2027-08-20', false],
    'Feriado adicional de Fiestas Patrias': ['2027-09-17', false],
    'Independencia Nacional': ['2027-09-18', true],
    'Día de las Glorias del Ejército': ['2027-09-19', true],
    'Encuentro de Dos Mundos': ['2027-10-11', false],
    'Día de las Iglesias Evangélicas y Protestantes': ['2027-10-31', false],
    'Día de Todos los Santos': ['2027-11-01', false],
    'Inmaculada Concepción': ['2027-12-08', false],
    'Navidad': ['2027-12-25', true],
    'Feriado Bancario': ['2027-12-31', false],
    'Todos los días Domingos': [null, false],
  },
};

for (const [year, expected] of Object.entries(expectedCalendars)) {
  const directory = new URL(`../src/content/holidays_${year}/`, import.meta.url);
  const files = (await readdir(directory)).filter((file) => file.endsWith('.json'));
  const holidays = await Promise.all(
    files.map(async (file) => JSON.parse(await readFile(new URL(file, directory), 'utf8'))),
  );

  assert.equal(
    holidays.length,
    Object.keys(expected).length,
    `${year}: cantidad inesperada de feriados`,
  );

  for (const holiday of holidays) {
    assert.ok(expected[holiday.description], `${year}: feriado inesperado: ${holiday.description}`);
    assert.deepEqual(
      [holiday.date ?? null, holiday.irrenunciable],
      expected[holiday.description],
      `${year}: datos incorrectos para ${holiday.description}`,
    );
  }
}

console.log('Calendarios 2026 y 2027 validados correctamente.');
