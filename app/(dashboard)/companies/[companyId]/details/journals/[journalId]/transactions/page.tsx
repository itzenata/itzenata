import React from 'react';
import Transactions from './components/Transactions';
import { getTransactionsByJournalAndCompany } from '@/lib/db/transactions'; // Adjust import based on your structure
import { SearchInput } from 'app/(dashboard)/search-input';

const TransactionsPage = async ({
  params
}: {
  params: Promise<{ companyId: string; journalId: string }>;
}) => {
  const { companyId, journalId } = await params;

  if (!companyId) {
    console.error('Company ID is undefined');
    return (
      <div>
        <h1>Transactions</h1>
        <p>Error: Company ID is missing.</p>
      </div>
    );
  }

  const companyIdNumber = Number(companyId);
  const journalIdNumber = Number(journalId);

  if (isNaN(companyIdNumber) || isNaN(journalIdNumber)) {
    console.error('Invalid parameters:', { companyId, journalId });
    return (
      <div>
        <h1>Transactions</h1>
        <p>Error: Invalid Company ID or Journal ID.</p>
      </div>
    );
  }

  try {
    const transactionsData = await getTransactionsByJournalAndCompany(
      companyIdNumber,
      journalIdNumber
    );

    return (
      <div>
        <Transactions
          transactions={transactionsData}
          companyId={companyIdNumber}
          journalId={journalIdNumber}
        />
      </div>
    );
  } catch (error) {
    console.error('Error fetching transactions:', error);
    return (
      <div>
        <p>Error fetching transactions. Please try again later.</p>
      </div>
    );
  }
};

export default TransactionsPage;
