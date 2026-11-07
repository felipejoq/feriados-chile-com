# Actualización de calendarios y herramientas

Revisión inicial de este procedimiento: 2026-11-06. Las herramientas no verifican automáticamente nuevas leyes y no se amplía la cobertura por el cambio del reloj.

## Antes de habilitar un año

1. Revisar las leyes vigentes en BCN/Ley Chile y publicaciones del Diario Oficial. Para elecciones, confirmar convocatorias en Servel. Separar los proyectos de ley de los feriados vigentes. Aplicar las reglas de traslados, Semana Santa y solsticio con fuentes oficiales y la fecha chilena correcta.
2. Crear `src/content/holidays_AAAA/*.json`, conservando identificadores estables para cada festividad. Registrar fecha, ámbito, beneficiarios, condición de irrenunciable, fundamento legal y referencia al artículo. No duplicar los datos de otro año sin revisión.
3. Registrar la colección en `src/content.config.ts` y en `src/utils/holidays/holidayCollection.ts`. Crear/verificar la ruta anual y su enlace en `src/utils/data/links-archive.ts`; las herramientas no crean las páginas anuales.
4. Añadir el año a `REVIEWED_YEARS` y actualizar `REVIEWED_ON` en `src/utils/holidays/coverage.ts` solo tras revisar la cobertura completa. Mantener los años ordenados, sin huecos. Esta configuración controla el año predeterminado, límites y opciones de las tres herramientas; el planificador empieza desde la fecha de revisión para el año de esa revisión, y desde enero para otros años.
5. Añadir expectativas independientes para el año en `scripts/validate-holidays.mjs`. El validador exige que coincidan con la cobertura publicada. Para una festividad nueva, registrar su fuente oficial en `calendar-export.ts`; las festividades no reconocidas no reciben una fuente legal inventada.
6. Revisar manualmente las guías: `calendario-feriados-chile-descargar.md`, `calculadora-dias-habiles-chile.md` y la guía anual de fines de semana largos. Actualizar cobertura, revisión, enlaces y ejemplos que se presenten como actuales; los ejemplos fechados pueden conservarse como históricos. Usar `updatedDate` cuando cambie su contenido. No renombrar una URL anual antigua para cambiar su año.
7. Ejecutar `npm run validate:holidays`, `npm test`, `npx astro check`, `npm run build` y `npm audit`. Probar límites del último año y cruces de año. Generar PDF anual/mensual, inspeccionar todas las páginas renderizadas y comprobar las fechas del ICS con sus filtros.
8. Publicar mediante PR hacia `main`, revisión, merge y despliegue. Comprobar las tres herramientas en producción, portada R2, descargas, metadatos y sitemap.

## Cambios durante un año

Actualizar los registros afectados, comprobar sus fuentes y revisar artículos/expectativas. Si se cambia la fecha de revisión compartida, volver a revisar el conjunto de años habilitados. Los PDF y archivos ICS ya descargados son copias; no se actualizan ni corrigen las cuentas de calendario de los usuarios. No anunciar sincronización automática mientras no exista un servicio de suscripción probado.

## Fuentes de referencia

- BCN, Ley Chile: https://www.bcn.cl/leychile/
- Diario Oficial: https://www.diariooficial.interior.gob.cl/
- Servel: https://www.servel.cl/
- DT, alcance de irrenunciables del comercio: https://dt.gob.cl/portal/1628/w3-article-95017.html
- Google, importar: https://support.google.com/calendar/answer/37118?hl=es
- Microsoft, importar frente a suscribirse: https://support.microsoft.com/es-es/outlook/import-or-subscribe-to-a-calendar-in-outlook-com-or-outlook-on-the-web
- Apple, importar/exportar en Mac: https://support.apple.com/es-lamr/guide/calendar/icl1023/mac
- RFC 5545 (fechas de día completo, fin exclusivo, escape y plegado): https://www.rfc-editor.org/rfc/rfc5545.html
