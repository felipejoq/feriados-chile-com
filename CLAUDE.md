# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Feriados App (feriados-chile.com) — a Chilean holidays web app built with Astro 6, React 19, and Tailwind CSS 4. Displays holidays by year with filtering, search, and informational articles. Data sourced from the Chilean government API (apis.digital.gob.cl/fl/).

## Commands

- `npm run dev` — Start dev server (binds to 0.0.0.0)
- `npm run build` — Production build (SSR via @astrojs/node standalone)
- `npm run start` — Run production server (`node ./dist/server/entry.mjs`)
- `npm run preview` — Preview production build

Requires Node.js >= 22.

## Architecture

**Rendering**: Hybrid SSR with `@astrojs/node` adapter. Some components use `server:defer` for deferred server rendering with fallback slots.

**Content system**: Uses Astro Content Collections with `glob` loaders in `src/content.config.ts`. Each year has its own collection (`holidays_2024`, `holidays_2025`, `holidays_2026`) loading JSON files from corresponding directories. Articles are a separate collection loading Markdown files. Holiday collections reference articles via `reference('articles')`.

**Holiday data model**: Each holiday JSON has: `description`, `type` (enum: Civil, Religioso, Local, Especial), `legalSupport`, `irrenunciable` (boolean), `date` (ISO string), optional `slug`, `beneficiaries`, `icon`, and `article` reference.

**State management**: Nanostores (`src/store/holidaysStore.ts`) manages client-side filtering/search state shared between Astro and React components. Filters: text query, holiday type, month.

**Pages**: Year-specific static pages (`/2024`, `/2025`, `/2026`), dynamic article pages via `[...slug].astro`, and a catch-all 404.

**Key directories**:
- `src/actions/` — Server actions organized by domain (date, holiday)
- `src/utils/` — Utilities for caching, config, data, dates, formatters, holidays
- `src/components/` — Astro and React components (holidays, filters, status cards, icons, share, fallbacks)

## Language

The project content and UI are in Spanish. Code identifiers mix English and Spanish.
