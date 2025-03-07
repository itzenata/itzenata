'use server';
import {
  db,
  transactions,
  transactionAccounts,
  accounts,
  journals
} from '@/lib/db/schema';
import { eq, sum, sql } from 'drizzle-orm';
import {
  EcritureComptableContent,
  GrandLivreContent,
  BalanceGeneraleContent
} from 'types/general-types';

/**
 * Utility function to build date filtering conditions.
 */
function buildDateFilterCondition(
  companyId: number,
  dateFilter: 'mois' | 'trimestre' | 'année' | 'personnalisé',
  selectedMonth?: number,
  selectedQuarter?: number,
  selectedYear?: number,
  customStartDate?: string,
  customEndDate?: string
) {
  let whereCondition = eq(transactions.companyId, companyId);

  if (
    dateFilter === 'mois' &&
    selectedMonth !== undefined &&
    selectedYear !== undefined
  ) {
    return sql`${whereCondition} AND 
      EXTRACT(MONTH FROM ${transactions.transactionDate}) = ${selectedMonth + 1} AND
      EXTRACT(YEAR FROM ${transactions.transactionDate}) = ${selectedYear}`;
  }

  if (
    dateFilter === 'trimestre' &&
    selectedQuarter !== undefined &&
    selectedYear !== undefined
  ) {
    const quarterStartMonth = selectedQuarter * 3 + 1;
    const quarterEndMonth = quarterStartMonth + 2;
    return sql`${whereCondition} AND 
      EXTRACT(MONTH FROM ${transactions.transactionDate}) BETWEEN ${quarterStartMonth} AND ${quarterEndMonth} AND
      EXTRACT(YEAR FROM ${transactions.transactionDate}) = ${selectedYear}`;
  }

  if (dateFilter === 'année' && selectedYear !== undefined) {
    return sql`${whereCondition} AND 
      EXTRACT(YEAR FROM ${transactions.transactionDate}) = ${selectedYear}`;
  }

  if (dateFilter === 'personnalisé' && customStartDate && customEndDate) {
    return sql`${whereCondition} AND 
      ${transactions.transactionDate} BETWEEN ${customStartDate} AND ${customEndDate}`;
  }

  return whereCondition;
}

/**
 * Fetch Balance Générale for a given company.
 */
export async function getBalanceGenerale(
  companyId: number,
  dateFilter: 'mois' | 'trimestre' | 'année' | 'personnalisé',
  selectedMonth?: number,
  selectedQuarter?: number,
  selectedYear?: number,
  customStartDate?: string,
  customEndDate?: string
): Promise<BalanceGeneraleContent[]> {
  try {
    const whereCondition = buildDateFilterCondition(
      companyId,
      dateFilter,
      selectedMonth,
      selectedQuarter,
      selectedYear,
      customStartDate,
      customEndDate
    );

    const balanceData = await db
      .select({
        transactionId: transactions.id, // Added transaction ID
        accountCode: accounts.code,
        accountLibelle: accounts.libelle,
        journalId: journals.id,
        journalName: journals.name,
        soldeInitial:
          sql<number>`COALESCE(SUM(transaction_accounts.montant_debit - transaction_accounts.montant_credit), 0)`.as(
            'soldeInitial'
          ),
        mouvementsDebit: sum(transactionAccounts.montantDebit).as(
          'mouvementsDebit'
        ),
        mouvementsCredit: sum(transactionAccounts.montantCredit).as(
          'mouvementsCredit'
        ),
        soldeFinal:
          sql<number>`SUM(transaction_accounts.montant_debit - transaction_accounts.montant_credit)`.as(
            'soldeFinal'
          )
      })
      .from(transactionAccounts)
      .innerJoin(
        transactions,
        eq(transactionAccounts.transactionId, transactions.id)
      )
      .innerJoin(accounts, eq(transactionAccounts.accountId, accounts.id))
      .innerJoin(journals, eq(transactions.journalId, journals.id))
      .where(whereCondition)
      .groupBy(
        transactions.id, // Group by transaction ID
        accounts.code,
        accounts.libelle,
        journals.id,
        journals.name
      );

    return balanceData.map((balance) => ({
      transactionId: balance.transactionId, // Ensure transaction ID is included
      accountCode: balance.accountCode || '',
      accountLibelle: balance.accountLibelle || '',
      journalId: balance.journalId,
      journalName: balance.journalName || '',
      soldeInitial: balance.soldeInitial,
      mouvementsDebit: balance.mouvementsDebit
        ? parseFloat(balance.mouvementsDebit.toString())
        : 0,
      mouvementsCredit: balance.mouvementsCredit
        ? parseFloat(balance.mouvementsCredit.toString())
        : 0,
      soldeFinal: balance.soldeFinal
    }));
  } catch (error) {
    console.error(
      `❌ Error fetching Balance Générale for company ID ${companyId}:`,
      error
    );
    throw new Error('Failed to fetch balance générale.');
  }
}

/**
 * Fetch Écritures Comptables for a given company.
 */
export async function getEcrituresComptables(
  companyId: number,
  dateFilter: 'mois' | 'trimestre' | 'année' | 'personnalisé',
  selectedMonth?: number,
  selectedQuarter?: number,
  selectedYear?: number,
  customStartDate?: string,
  customEndDate?: string
): Promise<EcritureComptableContent[]> {
  try {
    const whereCondition = buildDateFilterCondition(
      companyId,
      dateFilter,
      selectedMonth,
      selectedQuarter,
      selectedYear,
      customStartDate,
      customEndDate
    );

    const ecritures = await db
      .select({
        transactionId: transactions.id,
        journalId: journals.id,
        journalName: journals.name,
        date: transactions.transactionDate,
        accountCode: accounts.code,
        debit: sum(transactionAccounts.montantDebit).as('debit'),
        credit: sum(transactionAccounts.montantCredit).as('credit')
      })
      .from(transactionAccounts)
      .innerJoin(
        transactions,
        eq(transactionAccounts.transactionId, transactions.id)
      )
      .innerJoin(journals, eq(transactions.journalId, journals.id))
      .innerJoin(accounts, eq(transactionAccounts.accountId, accounts.id))
      .where(whereCondition)
      .groupBy(
        transactions.id,
        journals.id,
        journals.name,
        transactions.transactionDate,
        accounts.code
      );

    // ✅ Convert null values to safe defaults
    return ecritures.map((entry) => ({
      transactionId: entry.transactionId,
      journalId: entry.journalId,
      journalName: entry.journalName,
      date: entry.date ?? '', // Convert null to empty string
      accountCode: entry.accountCode, // Ensure it's a string
      debit: entry.debit ? parseFloat(entry.debit.toString()) : 0, // Convert null to 0
      credit: entry.credit ? parseFloat(entry.credit.toString()) : 0 // Convert null to 0
    }));
  } catch (error) {
    console.error(
      `❌ Error fetching Écritures Comptables for company ID ${companyId}:`,
      error
    );
    return []; // ✅ Ensures function always returns an array
  }
}

/**
 * Fetch Grand Livre for a given company.
 */
export async function getGrandLivre(
  companyId: number,
  dateFilter: 'mois' | 'trimestre' | 'année' | 'personnalisé',
  selectedMonth?: number,
  selectedQuarter?: number,
  selectedYear?: number,
  customStartDate?: string,
  customEndDate?: string
): Promise<GrandLivreContent[]> {
  try {
    const whereCondition = buildDateFilterCondition(
      companyId,
      dateFilter,
      selectedMonth,
      selectedQuarter,
      selectedYear,
      customStartDate,
      customEndDate
    );

    const rawData = await db
      .select({
        id: transactions.id,
        journalId: journals.id,
        accountCode: accounts.code,
        accountLibelle: accounts.libelle,
        date: transactions.transactionDate,
        description: transactions.libelle,
        debit: sum(transactionAccounts.montantDebit).as('debit'),
        credit: sum(transactionAccounts.montantCredit).as('credit')
      })
      .from(transactionAccounts)
      .innerJoin(
        transactions,
        eq(transactionAccounts.transactionId, transactions.id)
      )
      .innerJoin(journals, eq(transactions.journalId, journals.id))
      .innerJoin(accounts, eq(transactionAccounts.accountId, accounts.id))
      .where(whereCondition)
      .groupBy(
        transactions.id,
        journals.id,
        accounts.code,
        accounts.libelle,
        transactions.transactionDate,
        transactions.libelle
      );

    // ✅ Convert null values and ensure correct data format
    return rawData.map((entry) => ({
      id: entry.id,
      journalId: entry.journalId,
      accountCode: entry.accountCode || '',
      accountLibelle: entry.accountLibelle || '',
      date: entry.date ?? '',
      description: entry.description || '',
      debit: entry.debit ? parseFloat(entry.debit.toString()) : 0,
      credit: entry.credit ? parseFloat(entry.credit.toString()) : 0
    }));
  } catch (error) {
    console.error(
      `❌ Error fetching Grand Livre for company ID ${companyId}:`,
      error
    );
    throw new Error('Failed to fetch Grand Livre.');
  }
}
