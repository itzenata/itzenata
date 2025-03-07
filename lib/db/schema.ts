import 'server-only';
import { drizzle } from 'drizzle-orm/postgres-js';
import {
  pgTable,
  text,
  numeric,
  integer,
  timestamp,
  pgEnum,
  serial,
  date
} from 'drizzle-orm/pg-core';
import postgres from 'postgres';

export const queryClient = postgres(process.env.POSTGRES_URL!);
export const db = drizzle(queryClient);

// Define the Company Table as companies
export const statusEnum = pgEnum('status', ['active', 'inactive']);
export const companies = pgTable('company', {
  id: serial('id').primaryKey(),
  imageUrl: text('image_url').notNull(),
  name: text('name').notNull(),
  status: statusEnum('status').notNull(),
  capital: integer('capital'),
  employees: integer('employees').notNull(),
  foundedOn: date('founded_on'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
  activity: text('activity'),
  legalForm: text('legal_form'),
  address: text('address'),
  additionalInfo: text('additional_info'),
  phone: text('phone'),
  email: text('email'),
  website: text('website'),
  vatIdentifier: text('vat_identifier'),
  ifId: integer('if_id'),
  ice: integer('ice'),
  rc: integer('rc'),
  cnss: integer('cnss'),
  declarationRegime: text('declaration_regime'),
  paymentMode: text('payment_mode'),
  debutEncaissement: text('debut_encaissement')
});

// Define Transactions table as transactions
export const transactionTypeEnum = pgEnum('transaction_type', [
  'income',
  'expense'
]);

export const transactions = pgTable('transactions', {
  id: serial('id').primaryKey(),
  companyId: integer('company_id')
    .notNull()
    .references(() => companies.id, { onDelete: 'cascade' }),
  montantDebit: numeric('montant_debit_total', { precision: 15, scale: 2 }),
  montantCredit: numeric('montant_credit_total', { precision: 15, scale: 2 }),
  libelle: text('libelle'),
  transactionDate: date('transaction_date'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
  journalId: integer('journal_id')
    .notNull()
    .references(() => journals.id, { onDelete: 'cascade' })
});

// Define the `accounts` table
export const accounts = pgTable('accounts', {
  id: serial('id').primaryKey(),
  code: text('code').notNull(),
  libelle: text('libelle').notNull(),
  class: text('class').notNull()
});

// Define the `transaction_accounts` table for many-to-many relationship
export const transactionAccounts = pgTable('transaction_accounts', {
  transactionId: integer('transaction_id')
    .notNull()
    .references(() => transactions.id, { onDelete: 'cascade' }),
  accountId: integer('account_id')
    .notNull()
    .references(() => accounts.id, { onDelete: 'cascade' }),
  montantDebit: numeric('montant_debit', { precision: 15, scale: 2 }),
  montantCredit: numeric('montant_credit', { precision: 15, scale: 2 })
});

// Define the `journals` table
export const journals = pgTable('journals', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  totalOperations: integer('total_operations').default(0),
  lastEditDate: timestamp('last_edit_date').defaultNow(),
  lastEditUser: text('last_edit_user'),
  status: text('status'),
  totalValue: numeric('total_value', { precision: 15, scale: 2 }),
  type: text('type')
});

// Define the `tiers` table
export const tiers = pgTable('tiers', {
  id: serial('id').primaryKey(),
  code: text('code').notNull(),
  libelle: text('libelle').notNull(),
  class: text('class').notNull(),
  compteCollectif: integer('compte_collectif').references(() => accounts.code, {
    onDelete: 'set null'
  })
});
