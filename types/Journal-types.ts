import { z } from 'zod';

export interface Journal {
  id?: number;
  name: string;
  lastEditDate: Date | null;
  lastEditUser: string | null;
  status: string | null;
  type: string | null;
}
export const journalInsertSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  lastEditDate: z
    .date()
    .nullable()
    .default(() => new Date()),
  lastEditUser: z.string().nullable(),
  status: z.string().default('active').nullable(),
  type: z.string().nullable()
});

export const journalUpdateSchema = journalInsertSchema.extend({
  id: z.number()
});
export type JournalInsert = z.infer<typeof journalInsertSchema>;
export type UpdateJournalArgs = z.infer<typeof journalUpdateSchema>;

export type PartialJournal = Partial<Journal>;

export interface JournalListResponse {
  journals: Journal[];
  total: number;
  hasMore: boolean;
}

export enum JournalStatus {
  ACTIVE = 'active',
  ARCHIVED = 'archived'
}

export enum JournalType {
  SALE = 'sale',
  PURCHASE = 'purchase',
  BANK = 'bank',
  CASH = 'cash',
  GENERAL = 'general'
}

export const journalFilterSchema = z.object({
  search: z.string().optional(),
  status: z.nativeEnum(JournalStatus).optional(),
  type: z.nativeEnum(JournalType).optional(),
  startDate: z.date().optional(),
  endDate: z.date().optional()
});

export type JournalFilter = z.infer<typeof journalFilterSchema>;

export const journalSortSchema = z.object({
  field: z.enum([
    'name',
    'totalOperations',
    'lastEditDate',
    'totalValue',
    'type'
  ]),
  direction: z.enum(['asc', 'desc'])
});

export type JournalSort = z.infer<typeof journalSortSchema>;
