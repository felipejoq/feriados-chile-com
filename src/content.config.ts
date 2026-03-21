import { z, defineCollection, reference } from 'astro:content';
import { glob } from 'astro/loaders';
import {HolidayTypes} from "./interfaces/holidays/holiday-types.ts";

const articleCollection = defineCollection({
    loader: glob({
        pattern: '**/*.md',
        base: './src/content/articles',
        generateId: ({ entry }) => entry.replace(/\.md$/, ''),
    }),
    schema: z.object({
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
    type: z.nativeEnum(HolidayTypes),
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

export const collections = {
    'articles': articleCollection,
    'holidays_2024': holidaysCollection,
    'holidays_2025': holidays2025Collection,
    'holidays_2026': holidays2026Collection,
};
