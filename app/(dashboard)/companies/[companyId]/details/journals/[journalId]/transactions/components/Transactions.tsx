// File: components/Transactions.tsx
'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import SortingControls from 'app/(dashboard)/general-components/SortingControls';
import { X } from 'lucide-react'; // Import the X icon

import TransactionForm from './TransactionsForm';
import { handleDeleteTransaction } from 'services/TransactionService';
import { TransactionWithAccount } from 'types/accounts-type';
import { exportToPDF } from 'services/ExportToPDF';
import ExportModal from 'app/(dashboard)/ExportModal';
import { exportToXLSX } from 'services/ExportToXLSX';

const Transactions: React.FC<{
  transactions: TransactionWithAccount[];
  journalId: number;
  companyId: number;
  journalName?: string;
}> = ({ transactions, companyId, journalId, journalName }) => {
  const [showForm, setShowForm] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [expandedAccounts, setExpandedAccounts] = useState<Set<string>>(
    new Set()
  );
  const [isModalOpen, setIsModalOpen] = useState(false); // State for modal visibility
  const [pdfTitle, setPdfTitle] = useState(''); // State for PDF title
  const [currentPage, setCurrentPage] = useState(1);

  const [selectedTransaction, setSelectedTransaction] =
    useState<TransactionWithAccount | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  const handleEditTransaction = (transaction: TransactionWithAccount) => {
    setSelectedTransaction(transaction);
    setIsEditing(true);
    setShowForm(true);
  };
  const handleCloseForm = () => {
    setShowForm(false);
    setSelectedTransaction(null);
    setIsEditing(false);
  };
  const transactionsPerPage = 5;
  const searchParams = useSearchParams();

  const [filters, setFilters] = useState<{
    operationId: string;
    accountLibelle: string;
  }>({
    operationId: '',
    accountLibelle: ''
  });

  useEffect(() => {
    const operationIdParam = searchParams.get('operationId') || '';
    const accountLibelleParam = searchParams.get('q') || '';

    setSearchValue(''); // Clear previous value
    setFilters({
      operationId: operationIdParam,
      accountLibelle: accountLibelleParam
    });
  }, [searchParams]);

  const initialSortField = searchParams.get('sortField') || 'transactionDate';
  const initialSortOrder =
    (searchParams.get('sortOrder') as 'asc' | 'desc') || 'desc';

  const sortOptions = [
    { value: 'libelle', label: 'Libellé' },
    { value: 'montantDebit', label: 'Montant Débit' },
    { value: 'montantCredit', label: 'Montant Crédit' },
    { value: 'transactionDate', label: 'Date' }
  ];

  const filteredTransactions = transactions.filter((transaction) => {
    const matchesOperationId =
      !filters.operationId ||
      transaction.id?.toString() === filters.operationId;
    const matchesAccountLibelle =
      !filters.accountLibelle ||
      transaction.accounts.some((account) =>
        account.libelle
          .toLowerCase()
          .includes(filters.accountLibelle.toLowerCase())
      );

    return matchesOperationId && matchesAccountLibelle;
  });

  const [editingTransaction, setEditingTransaction] =
    useState<TransactionWithAccount | null>(null);

  // Define columns for PDF export
  const pdfColumns = [
    { header: 'Libellé', dataKey: 'libelle' },
    { header: 'Montant Débit', dataKey: 'montantDebit' },
    { header: 'Montant Crédit', dataKey: 'montantCredit' },
    { header: 'Date', dataKey: 'transactionDate' },
    { header: 'Comptes', dataKey: 'accounts' }
  ];

  // Prepare table data for PDF export
  const pdfData = filteredTransactions.map((transaction) => ({
    libelle: transaction.libelle,
    montantDebit: transaction.montantDebit,
    montantCredit: transaction.montantCredit,
    transactionDate: transaction.transactionDate,
    accounts: transaction.accounts
      .map((account) => `${account.code}: ${account.libelle}`)
      .join(', ')
  }));

  // Export to PDF function using the generic function
  const handleExportFile = (title: string, format: 'pdf' | 'xlsx') => {
    if (format === 'pdf') {
      exportToPDF(title, pdfColumns, pdfData);
    } else {
      exportToXLSX(title, pdfColumns, pdfData);
    }
  };

  const sortedTransactions = [...filteredTransactions].sort((a, b) => {
    const aField = a[initialSortField as keyof TransactionWithAccount];
    const bField = b[initialSortField as keyof TransactionWithAccount];

    if (aField == null && bField == null) return 0;
    if (aField == null) return initialSortOrder === 'asc' ? -1 : 1;
    if (bField == null) return initialSortOrder === 'asc' ? 1 : -1;

    return aField < bField
      ? initialSortOrder === 'asc'
        ? -1
        : 1
      : aField > bField
        ? initialSortOrder === 'asc'
          ? 1
          : -1
        : 0;
  });

  const toggleAccountDetails = (accountId: string) => {
    setExpandedAccounts((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(accountId)) {
        newSet.delete(accountId);
      } else {
        newSet.add(accountId);
      }
      return newSet;
    });
  };

  return (
    <div className="w-full flex flex-col gap-6">
      {showForm && (
        <Card className="p-4">
          <TransactionForm
            companyId={companyId}
            journalId={journalId}
            onClose={handleCloseForm}
            transaction={selectedTransaction}
            mode={isEditing ? 'edit' : 'add'}
          />
        </Card>
      )}
      <Card>
        <div className="flex items-center justify-between px-6 py-3">
          <div className="flex items-center gap-6">
            <CardHeader className="p-0">
              <CardTitle>Transactions</CardTitle>
              <CardDescription>
                Gérez vos transactions de manière transparente.
              </CardDescription>
            </CardHeader>
          </div>

          <div className="flex items-center gap-4">
            <SortingControls
              initialSortField={initialSortField}
              initialSortOrder={initialSortOrder}
              options={sortOptions}
            />
            {filters.operationId && (
              <Button
                onClick={() => {
                  setFilters({ ...filters, operationId: '' });
                  // Update URL without operationId
                  const params = new URLSearchParams(searchParams.toString());
                  params.delete('operationId');
                  window.history.replaceState(
                    null,
                    '',
                    `?${params.toString()}`
                  );
                }}
                className="bg-red-500 hover:bg-red-600 text-white flex items-center gap-2"
              >
                operationId={filters.operationId} <X className="w-4 h-4" />
              </Button>
            )}
            {filters.accountLibelle && (
              <Button
                onClick={() => {
                  setFilters({ ...filters, accountLibelle: '' });
                  // Update URL without accountLibelle
                  const params = new URLSearchParams(searchParams.toString());
                  params.delete('accountLibelle');
                  window.history.replaceState(
                    null,
                    '',
                    `?${params.toString()}`
                  );
                }}
                className="bg-red-500 hover:bg-red-600 text-white flex items-center gap-2"
              >
                Libelle={filters.accountLibelle} <X className="w-4 h-4" />
              </Button>
            )}
            <Button
              onClick={() => setShowForm(!showForm)}
              className="bg-indigo-600 hover:bg-indigo-700 text-white flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              {showForm ? 'Masquer le formulaire' : 'Ajouter une Transaction'}
            </Button>
            <Button
              onClick={() => setIsModalOpen(true)}
              className="bg-blue-500 hover:bg-blue-600 text-white"
            >
              Exporter
            </Button>
          </div>
        </div>

        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Libellé</TableHead>
                <TableHead className="text-right">Montant Débit</TableHead>
                <TableHead className="text-right">Montant Crédit</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Comptes</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedTransactions.length > 0 ? (
                sortedTransactions.map((transaction) => (
                  <TableRow key={transaction.id}>
                    <TableCell className="hidden">{transaction.id}</TableCell>
                    <TableCell>{transaction.libelle}</TableCell>
                    <TableCell className="text-right text-red-600">
                      {transaction.montantDebit}
                    </TableCell>
                    <TableCell className="text-right text-green-600">
                      {transaction.montantCredit}
                    </TableCell>
                    <TableCell>{transaction.transactionDate}</TableCell>

                    <TableCell>
                      <div
                        className={`grid gap-4 ${transaction.accounts.length === 2 ? 'grid-cols-2' : ''}`}
                      >
                        {transaction.accounts.map((account) => (
                          <div
                            key={account.id}
                            onDoubleClick={() =>
                              toggleAccountDetails(account.id.toString())
                            }
                            className="p-3 bg-white shadow-sm border border-gray-200 rounded-lg cursor-pointer transition-transform hover:scale-105"
                          >
                            {/* Account Code and Libellé */}
                            <div className="text-gray-800 font-semibold truncate">
                              {expandedAccounts.has(account.id) ? (
                                <>
                                  {account.code}: {account.libelle}
                                </>
                              ) : (
                                <>
                                  {account.code}:{' '}
                                  {account.libelle.length > 15
                                    ? `${account.libelle.substring(0, 15)}...`
                                    : account.libelle}
                                </>
                              )}
                            </div>

                            {/* Expanded Details */}
                            {expandedAccounts.has(account.id.toString()) && (
                              <div className="mt-2 flex flex-col gap-1 text-sm">
                                <span className="text-gray-500 truncate">
                                  <strong>Libellé:</strong>{' '}
                                  {account.customLibelleAccount}
                                </span>

                                {/* Display only one of Debit or Credit */}
                                {account.montantDebit > 0 ? (
                                  <span className="text-red-600 flex items-center gap-1">
                                    Débit: {account.montantDebit}
                                  </span>
                                ) : (
                                  <span className="text-green-600 flex items-center gap-1">
                                    Crédit: {account.montantCredit}
                                  </span>
                                )}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </TableCell>

                    {/* Actions */}
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-indigo-600 hover:text-indigo-800"
                        onClick={() => handleEditTransaction(transaction)}
                      >
                        Modifier
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="text-red-600 hover:text-red-800"
                        onClick={() =>
                          handleDeleteTransaction(
                            transaction.id,
                            companyId,
                            journalId
                          )
                        }
                      >
                        Supprimer
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="text-center text-gray-600 py-4"
                  >
                    Aucune transaction trouvée.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>

        <CardFooter></CardFooter>
      </Card>

      <ExportModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onExport={handleExportFile}
      />
    </div>
  );
};

export default Transactions;
