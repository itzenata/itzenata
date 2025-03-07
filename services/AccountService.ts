'use server';
import { getCompanyById } from '@/lib/db/companies';
import { accounts, db, tiers, transactionAccounts } from '@/lib/db/schema';
import { asc, desc, eq } from 'drizzle-orm';
import { Company } from 'types';
import { Account } from 'types/accounts-type';

import { transactions, journals } from '@/lib/db/schema';
import { sum, sql } from 'drizzle-orm';

export async function getCompanyDetails(
  companyId: number
): Promise<Company | null> {
  try {
    return await getCompanyById(companyId);
  } catch (error) {
    console.error(
      `Failed to fetch company details for ID ${companyId}:`,
      error
    );
    return null;
  }
}

// Fetch and sort accounts
export async function getSortedAccounts(
  sortField: keyof Account = 'code',
  sortOrder: 'asc' | 'desc' = 'asc'
): Promise<Account[]> {
  const validFields: (keyof Account)[] = ['code', 'libelle', 'class'];
  if (!validFields.includes(sortField)) {
    throw new Error(`Invalid sortField: ${sortField}`);
  }

  const sortedAccounts = await db
    .select()
    .from(accounts)
    .orderBy(
      sortOrder === 'asc' ? asc(accounts[sortField]) : desc(accounts[sortField])
    );
  const tiersWithAccounts = await db
    .select({
      id: tiers.id,
      code: tiers.code,
      libelle: tiers.libelle,
      class: tiers.class,
      compteCollectif: tiers.compteCollectif,
      linkedAccount: accounts.libelle
    })
    .from(tiers)
    .leftJoin(accounts, eq(tiers.compteCollectif, accounts.code)) // Join tiers with accounts
    .orderBy(
      sortOrder === 'asc' ? asc(tiers[sortField]) : desc(tiers[sortField])
    );

  // Merge both lists
  return [...sortedAccounts, ...tiersWithAccounts];
}

// Fonction serveur pour récupérer les accounts filtrés et triés
export async function getAccountByCode(
  search: string,
  sortField: keyof Account = 'code',
  sortOrder: 'asc' | 'desc' = 'asc'
): Promise<Account[]> {
  const allAccounts = await getSortedAccounts(sortField, sortOrder);

  const filteredAccounts = search
    ? allAccounts.filter(
        (account) =>
          account.libelle.toLowerCase().includes(search.toLowerCase()) ||
          account.code.includes(search)
      )
    : allAccounts;

  return filteredAccounts.slice(0, 20);
}

// Fetch transaction accounts with debit and credit details

export async function fetchFinancialData() {
  try {
    // 1. Monthly Revenue and Profit Analysis
    const monthlyRevenue = await db
      .select({
        month: sql`TO_CHAR(transaction_date, 'Mon')`.as('month'),
        Revenue: sum(transactionAccounts.montantCredit).as('Revenue'),
        Costs: sum(transactionAccounts.montantDebit).as('Costs'),
        Profit:
          sql`SUM(transaction_accounts.montant_credit - transaction_accounts.montant_debit)`.as(
            'Profit'
          )
      })
      .from(transactions)
      .innerJoin(
        transactionAccounts,
        eq(transactions.id, transactionAccounts.transactionId)
      )
      .groupBy(sql`TO_CHAR(transaction_date, 'Mon')`);

    // 2. Transaction Types by Journal
    const journalTransactionTypes = await db
      .select({
        name: journals.name,
        Comptant: sum(transactionAccounts.montantDebit).as('Comptant'),
        Crédit: sum(transactionAccounts.montantCredit).as('Crédit')
      })
      .from(journals)
      .innerJoin(transactions, eq(journals.id, transactions.journalId))
      .innerJoin(
        transactionAccounts,
        eq(transactions.id, transactionAccounts.transactionId)
      )
      .groupBy(journals.name);

    // 3. Profitability by Journal
    const profitabilityByJournal = await db
      .select({
        name: journals.name,
        value:
          sql`SUM(transaction_accounts.montant_credit - transaction_accounts.montant_debit)`.as(
            'value'
          )
      })
      .from(journals)
      .innerJoin(transactions, eq(journals.id, transactions.journalId))
      .innerJoin(
        transactionAccounts,
        eq(transactions.id, transactionAccounts.transactionId)
      )
      .groupBy(journals.name);

    // 4. Weekly Cash Flow
    const cashFlow = await db
      .select({
        week: sql`TO_CHAR(transaction_date, 'IW')`.as('week'), // Week number in ISO format
        Entrees: sum(transactionAccounts.montantCredit).as('Entrees'),
        Sorties: sum(transactionAccounts.montantDebit).as('Sorties')
      })
      .from(transactions)
      .innerJoin(
        transactionAccounts,
        eq(transactions.id, transactionAccounts.transactionId)
      )
      .groupBy(sql`TO_CHAR(transaction_date, 'IW')`);

    // 5. Transaction Scatter
    const transactionScatter = await db
      .select({
        x: transactionAccounts.montantCredit,
        y: transactionAccounts.montantDebit,
        z: sql`ABS(transaction_accounts.montant_credit - transaction_accounts.montant_debit)`.as(
          'z'
        )
      })
      .from(transactionAccounts);

    // 6. Periodic Growth Comparison
    const periodicGrowth = await db
      .select({
        period: sql`TO_CHAR(transaction_date, 'Q')`.as('period'), // Quarterly growth
        Croissance:
          sql`SUM(transaction_accounts.montant_credit - transaction_accounts.montant_debit)`.as(
            'Croissance'
          ),
        Objectif: sql`10000`.as('Objectif') // Replace with actual target if available
      })
      .from(transactions)
      .innerJoin(
        transactionAccounts,
        eq(transactions.id, transactionAccounts.transactionId)
      )
      .groupBy(sql`TO_CHAR(transaction_date, 'Q')`);

    return {
      monthlyRevenue,
      journalTransactionTypes,
      profitabilityByJournal,
      cashFlow,
      transactionScatter,
      periodicGrowth
    };
  } catch (error) {
    console.error('Error fetching financial data:', error);
    throw new Error('Failed to fetch financial data.');
  }
}
