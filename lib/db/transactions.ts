import { db, transactionAccounts } from './schema';
import { transactions } from './schema';
import {
  Transaction,
  transactionSchema,
  accountTransactionSchema
} from 'types/transactions-types';
import { accounts } from './schema';
import { eq, and, inArray } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { TransactionWithAccount } from 'types/accounts-type';
export async function addNewTransaction(
  transaction: Transaction,
  accounts: any[]
): Promise<void> {
  try {
    const validatedData = transactionSchema.parse(transaction);

    const insertedTransaction = await db
      .insert(transactions)
      .values(validatedData)
      .returning()
      .then((result) => {
        return result[0];
      });

    if (!insertedTransaction) {
      throw new Error('Failed to insert transaction');
    }

    if (!Array.isArray(accounts) || accounts.length === 0) {
      throw new Error('accountIds must be a non-empty array');
    }

    const transactionAccountsData = accounts.map((account: any) => ({
      transactionId: insertedTransaction.id,
      accountId: account.accountId,
      montantDebit: account.montantDebit.toFixed(2),
      montantCredit: account.montantCredit.toFixed(2)
    }));

    console.log('Transaction Accounts Data:', transactionAccountsData);
    const validatedTransactionAccountsData = accountTransactionSchema
      .array()
      .parse(transactionAccountsData);

    await db
      .insert(transactionAccounts)
      .values(validatedTransactionAccountsData);

    const urltoredirect = `/companies/${transaction.companyId}/details/journals/${transaction.journalId}/transactions`;

    revalidatePath(urltoredirect);
  } catch (error) {
    console.error('Error creating transaction:', error);
    throw new Error('Transaction validation or creation failed.');
  }
}

export async function deleteTransactionById(id: number): Promise<void> {
  try {
    await db.delete(transactions).where(eq(transactions.id, id));
  } catch (error) {
    console.error('Error deleting transaction:', error);
    throw new Error('Failed to delete transaction.');
  }
}

export const getTransactionsByJournalAndCompany = async (
  companyId: number,
  journalId: number
): Promise<TransactionWithAccount[]> => {
  try {
    const transactionResults = await db
      .select()
      .from(transactions)
      .where(
        and(
          eq(transactions.companyId, companyId),
          eq(transactions.journalId, journalId)
        )
      );

    if (transactionResults.length === 0) {
      console.warn(
        'No transactions found for the given Company ID and Journal ID.'
      );
      return [];
    }

    const transactionIds = transactionResults.map((t) => t.id);

    const accountsResults = await db
      .select({
        accountId: transactionAccounts.accountId,
        libelle: accounts.libelle,
        montantDebit: transactionAccounts.montantDebit,
        montantCredit: transactionAccounts.montantCredit,
        transactionId: transactionAccounts.transactionId,
        code: accounts.code
      })
      .from(transactionAccounts)
      .innerJoin(accounts, eq(transactionAccounts.accountId, accounts.id))
      .where(inArray(transactionAccounts.transactionId, transactionIds));

    return transactionResults.map((transaction) => {
      const associatedAccounts = accountsResults.filter(
        (c) => c.transactionId === transaction.id
      );

      return {
        ...transaction,
        montantDebit: parseFloat(transaction.montantDebit ?? '0'),
        montantCredit: parseFloat(transaction.montantCredit ?? '0'),
        accounts: associatedAccounts.map((c) => ({
          id: c.accountId,
          code: c.code,
          libelle: c.libelle,
          montantDebit: parseFloat(c.montantDebit ?? '0'),
          montantCredit: parseFloat(c.montantCredit ?? '0')
        }))
      } as TransactionWithAccount;
    });
  } catch (error) {
    console.error('Error fetching transactions:', error);
    throw new Error('Failed to fetch transactions');
  }
};

export async function updateTransaction(
  transactionId: number,
  updatedTransaction: Transaction,
  updatedAccounts: any[]
): Promise<void> {
  try {
    const validatedData = transactionSchema.parse(updatedTransaction);

    const updated = await db
      .update(transactions)
      .set(validatedData)
      .where(eq(transactions.id, transactionId))
      .returning();

    if (!updated.length) {
      throw new Error('Transaction update failed');
    }

    if (!Array.isArray(updatedAccounts) || updatedAccounts.length === 0) {
      throw new Error('Updated accounts must be a non-empty array');
    }

    await db
      .delete(transactionAccounts)
      .where(eq(transactionAccounts.transactionId, transactionId));

    const newTransactionAccountsData = updatedAccounts.map((account: any) => ({
      transactionId,
      accountId: account.accountId,
      montantDebit: account.montantDebit.toFixed(2),
      montantCredit: account.montantCredit.toFixed(2)
    }));

    const validatedTransactionAccountsData = accountTransactionSchema
      .array()
      .parse(newTransactionAccountsData);

    await db
      .insert(transactionAccounts)
      .values(validatedTransactionAccountsData);

    const urlToRedirect = `/companies/${updatedTransaction.companyId}/details/journals/${updatedTransaction.journalId}/transactions`;
    revalidatePath(urlToRedirect);
  } catch (error) {
    console.error('Error updating transaction:', error);
    throw new Error('Transaction update failed.');
  }
}
