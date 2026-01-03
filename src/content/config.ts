import { z, defineCollection } from 'astro:content';
import {HolidayTypes} from "../interfaces/holidays/holiday-types.ts";

const articleCollection = defineCollection({
    type: 'content',
    schema: z.object({
        title: z.string(),
        description: z.string(),
        keywords: z.array(z.string()),
        date: z.string(),
        author: z.string(),
        image: z.string(),
        alt_text: z.string(),
    }),
});

const holidaysCollection = defineCollection({
    type: 'data',
    schema: z.object({
        legalSupport: z.string(),
        description: z.string().optional(),
        type: z.nativeEnum(HolidayTypes),
        irrenunciable: z.boolean(),
        beneficiaries: z.string().optional(),
        slug: z.string().optional(),
        date: z.string().nullable().optional(),
        icon: z.string().optional(),
    }),
});

export const collections = {
    'articles': articleCollection,
    'holidays_2024': holidaysCollection,
    'holidays_2025': holidaysCollection,
    'holidays_2026': holidaysCollection,
};