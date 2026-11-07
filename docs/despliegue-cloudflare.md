# Despliegue en Cloudflare

## Arquitectura

- Worker: `feriados-chile`, cuenta Personal Account.
- Dominio de producción: `https://feriados-chile.com`.
- Dirección técnica: `https://feriados-chile.felpe-an.workers.dev`.
- Astro prerenderiza los artículos y calendarios; Workers ejecuta las islas de servidor, las acciones y el 404.
- Se conserva `America/Santiago` para las fechas calculadas en cada solicitud.
- Imágenes: bucket R2 `feriados-chile`, dominio `media.feriados-chile.com`.
- No se requieren bases de datos, sesiones, KV ni Cloudflare Images. Las imágenes de Astro se optimizan al compilar.
- `assets.html_handling: drop-trailing-slash` conserva las URLs canónicas sin barra final.
- Los registros están habilitados; las trazas tienen muestreo del 10 %.

## Desarrollo y comprobaciones

Usar Node 22.23.4 (`nvm use`) y las versiones de `package-lock.json`.

```sh
npm ci
npm run generate-types
npm test
npx astro check
npm run build
npx wrangler deploy --dry-run
```

`npm run dev` sirve el proyecto con el entorno de Cloudflare. `npm run preview`
permite revisar la compilación local. Los tipos generados se excluyen de Git;
`--include-runtime=false` evita mezclar los tipos DOM del navegador con los
tipos globales del runtime de Workers en los componentes React.

## Publicación automática

Workers Builds está conectado a `felipejoq/feriados-chile-com`, rama `main`.
Crear un PR, revisar las comprobaciones y hacer merge.

- Build: `npm run generate-types && npm test && npx astro check && npm run build`.
- Deploy: `npx wrangler deploy`.
- Variable de compilación: `NODE_VERSION=22.23.4`.
- El token de despliegue se administra en Cloudflare, nunca en el repositorio.

Para una publicación manual autorizada: `npm run deploy` con Wrangler autenticado
en la cuenta indicada en `wrangler.jsonc`.

Antes de dar una publicación por terminada, comprobar el estado del build y la
URL pública: portada y estado de hoy, filtros, años, calculadoras, PDF/ICS,
imágenes R2, sitemap, canonical y una ruta inexistente que devuelva 404.

## Migración desde Railway

La migración retira el adaptador de Node y el Dockerfile del alojamiento anterior.
Esta rama compila para Workers; no debe continuar desplegándose en Railway.
Tras verificar el dominio en Cloudflare, detener el servicio antiguo y desconectar
su fuente de GitHub para evitar despliegues posteriores. Detener Railway es un
paso separado de cambiar el dominio; el cambio de DNS por sí solo no detiene
su consumo de recursos.

El último código anterior a la migración está en el commit
`6f8894cf7f5f5a2870b1d0d7adaf868586d19a88`. Para una reversión a Railway,
restaurar y comprobar ese despliegue antes de devolverle el dominio. El registro
anterior era un CNAME proxied de `feriados-chile.com` a
`n6t23bak.up.railway.app`. El dominio de R2 y los registros TXT no se modifican.

Para revertir solamente código dentro de Cloudflare, utilizar una versión anterior
verificada del mismo Worker; los cambios de dominio o de configuración externa
deben revisarse por separado.
