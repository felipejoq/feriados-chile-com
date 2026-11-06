import { defineCollection, reference } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';
import {HolidayTypes} from "./interfaces/holidays/holiday-types.ts";

const articleCollection = defineCollection({
    loader: glob({
        pattern: '**/*.md',
        base: './src/content/articles',
        generateId: ({ entry }) => entry.replace(/\.md$/, ''),
    }),
    schema: z.object({
        showHolidayInfo: z.boolean().default(true),
        tool: z.enum(["long-weekends", "business-days"]).optional(),
        updatedDate: z.string().optional(),
        title: z.string(),
        description: z.string(),
        keywords: z.array(z.string()),
        date: z.string(),
        author: z.string(),
        image: z.string(),
        alt_text: z.string(),
        slug: z.string(),
    }),
});

const holidaySchema = z.object({
    legalSupport: z.string(),
    description: z.string().optional(),
    type: z.enum(HolidayTypes),
    irrenunciable: z.boolean(),
    beneficiaries: z.string().optional(),
    slug: z.string().optional(),
    date: z.string().nullable().optional(),
    icon: z.string().optional(),
    article: reference('articles').optional(),
});

const holidaysCollection = defineCollection({
    loader: glob({ pattern: '**/*.json', base: './src/content/holidays_2024' }),
    schema: holidaySchema,
});

const holidays2025Collection = defineCollection({
    loader: glob({ pattern: '**/*.json', base: './src/content/holidays_2025' }),
    schema: holidaySchema,
});

const holidays2026Collection = defineCollection({
    loader: glob({ pattern: '**/*.json', base: './src/content/holidays_2026' }),
    schema: holidaySchema,
});

const holidays2027Collection = defineCollection({
    loader: glob({ pattern: '**/*.json', base: './src/content/holidays_2027' }),
    schema: holidaySchema,
});

export const collections = {
    'articles': articleCollection,
    'holidays_2024': holidaysCollection,
    'holidays_2025': holidays2025Collection,
    'holidays_2026': holidays2026Collection,
    'holidays_2027': holidays2027Collection,
};
