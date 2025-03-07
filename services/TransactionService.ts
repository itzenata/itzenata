'use server';

import { redirect } from 'next/navigation';
import { Transaction } from 'types/transactions-types';
import {
  addNewTransaction,
  deleteTransactionById,
  updateTransaction
} from '@/lib/db/transactions';
import { TransactionAccount } from 'types/accounts-type';

// Function to handle adding a new transaction
export async function handleAddTransaction(
  transactionData: any,
  accountData: any,
  companyId: number,
  journalId: number
) {
  try {
    const transaction: Transaction = {
      companyId: companyId,
      journalId: journalId,
      libelle: transactionData.libelle as string,
      montantDebit: transactionData.montantDebit.toFixed(2) ?? '0',
      montantCredit: transactionData.montantCredit.toFixed(2) ?? '0',
      transactionDate: transactionData.transactionDate as string,
      createdAt: null,
      updatedAt: null
    };

    console.log('Adding new accountData red:', accountData);

    await addNewTransaction(transaction, accountData);
  } catch (error) {}
}

// Function to handle updating a transaction
export async function handleUpdateTransaction(
  transactionId: number,
  transactionData: any,
  accountData: any
) {
  try {
    const transaction: Transaction = {
      companyId: transactionData.companyId,
      journalId: transactionData.journalId,
      libelle: transactionData.libelle as string,
      montantDebit: transactionData.montantDebit.toFixed(2) ?? '0',
      montantCredit: transactionData.montantCredit.toFixed(2) ?? '0',
      transactionDate: transactionData.transactionDate as string,
      createdAt: null,
      updatedAt: null
    };

    console.log('Updating transaction with new account data:', accountData);

    await updateTransaction(transactionId, transaction, accountData);
  } catch (error) {
    console.error('Error updating transaction:', error);
  }
}

// Function to handle deleting a transaction
export async function handleDeleteTransaction(
  id: number,
  companyId: number,
  journalId: number
) {
  {
    await deleteTransactionById(id);
    redirect(
      `/companies/${companyId}/details/journals/${journalId}/transactions`
    );
  }
}
