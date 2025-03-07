import { z } from 'zod';

export interface Transaction {
  montantDebit: number | 0;
  montantCredit: number | 0;
  id?: number;
  createdAt: Date | null;
  updatedAt: Date | null;
  companyId: number;
  libelle: string | null;
  transactionDate: string | null;
  journalId: number;
}
export interface Account {
  montantDebit: string;
  montantCredit: string;
  libelle: string;
  id: number;
  code: string;
  class: string;
}

export type TransactionWithType = Transaction & { _type?: string };

export type AddTransactionArgs = Omit<
  z.infer<typeof transactionSchema>,
  'id' | 'createdAt' | 'updatedAt'
>;

export type UpdateTransactionArgs = Partial<
  Omit<Transaction, 'id' | 'createdAt' | 'updatedAt'>
> & {
  id: number;
};

export const accountSchema = z.object({
  id: z.number(),
  code: z.string(),
  montantDebit: z.number().positive(),
  montantCredit: z.number().positive(),
  libelle: z.string(),
  class: z.string()
});

export const transactionSchema = z.object({
  id: z.number().optional(),
  montantDebit: z.string(),
  montantCredit: z.string(),
  createdAt: z.date().nullable(),
  updatedAt: z.date().nullable(),
  companyId: z.number().positive(),
  libelle: z.string().nullable(),
  transactionDate: z.string().nullable(),
  journalId: z.number().positive()
});

export const accountTransactionSchema = z.object({
  transactionId: z.number(),
  accountId: z.number().positive(),
  montantDebit: z.string(),
  montantCredit: z.string(),
  libelle: z.string()
});
