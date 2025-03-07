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
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, Loader2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Pagination from 'app/(dashboard)/general-components/Pagination';
import { exportToPDF } from 'services/ExportToPDF';
import PDFExportModal from 'app/(dashboard)/ExportModal';
import { BalanceGeneraleContent } from 'types/general-types';
import { getBalanceGenerale } from 'services/CustomService';
import DateFilter from './DateFilter';
import Link from 'next/link';
import ExportModal from 'app/(dashboard)/ExportModal';
import { exportToXLSX } from 'services/ExportToXLSX';

const BalanceGenerale: React.FC<{ companyId: number }> = ({ companyId }) => {
  const [balances, setBalances] = useState<BalanceGeneraleContent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [pdfTitle] = useState('Balance Générale');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Date filtering state
  const [dateFilter, setDateFilter] = useState<
    'mois' | 'trimestre' | 'année' | 'personnalisé'
  >('année');
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedQuarter, setSelectedQuarter] = useState(
    Math.floor(new Date().getMonth() / 3)
  );
  const [customStartDate, setCustomStartDate] = useState<string | null>(null);
  const [customEndDate, setCustomEndDate] = useState<string | null>(null);

  const searchParams = useSearchParams();
  const searchValue = searchParams.get('q') || '';

  useEffect(() => {
    const fetchBalances = async () => {
      try {
        setLoading(true);
        const response = await getBalanceGenerale(
          companyId,
          dateFilter,
          selectedMonth,
          selectedQuarter,
          selectedYear,
          customStartDate ?? undefined,
          customEndDate ?? undefined
        );
        setTimeout(() => {
          setBalances(response);
          setLoading(false);
        }, 800);
      } catch (err) {
        setError('Erreur lors du chargement de la balance générale.');
        setLoading(false);
      }
    };
    fetchBalances();
  }, [
    companyId,
    dateFilter,
    selectedMonth,
    selectedQuarter,
    selectedYear,
    customStartDate,
    customEndDate
  ]);

  // Filter balances and remove rows with all zeros
  const filteredBalances = balances
    .filter((balance) =>
      balance.accountLibelle.toLowerCase().includes(searchValue.toLowerCase())
    )
    .filter(
      (balance) =>
        balance.mouvementsDebit !== 0 ||
        balance.mouvementsCredit !== 0 ||
        balance.soldeFinal !== 0
    );
  const handleExportFile = (title: string, format: 'pdf' | 'xlsx') => {
    if (format === 'pdf') {
      exportToPDF(title, pdfColumns, pdfData);
    } else {
      exportToXLSX(title, pdfColumns, pdfData);
    }
  };

  // Define PDF export columns
  const pdfColumns = [
    { header: 'Compte', dataKey: 'accountCode' },
    { header: 'Libellé', dataKey: 'accountLibelle' },
    { header: 'Débit Total', dataKey: 'mouvementsDebit' },
    { header: 'Crédit Total', dataKey: 'mouvementsCredit' }
  ];

  // Prepare table data for PDF export
  const pdfData = filteredBalances.map((balance) => ({
    accountCode: balance.accountCode,
    accountLibelle: balance.accountLibelle,
    mouvementsDebit: balance.mouvementsDebit,
    mouvementsCredit: balance.mouvementsCredit
  }));

  return (
    <div className="w-full flex flex-col gap-6">
      <Card>
        {/* Header Section */}
        <CardHeader className="flex justify-between items-center">
          <CardTitle>Balance Générale</CardTitle>
          <div className="flex items-center gap-4 w-full justify-between">
            <DateFilter
              dateFilter={dateFilter}
              setDateFilter={setDateFilter}
              selectedYear={selectedYear}
              setSelectedYear={setSelectedYear}
              selectedMonth={selectedMonth}
              setSelectedMonth={setSelectedMonth}
              selectedQuarter={selectedQuarter}
              setSelectedQuarter={setSelectedQuarter}
              customStartDate={customStartDate}
              setCustomStartDate={setCustomStartDate}
              customEndDate={customEndDate}
              setCustomEndDate={setCustomEndDate}
            />
            <Button onClick={() => setIsModalOpen(true)} className="ml-auto">
              <Download className="w-4 h-4" /> Exporter
            </Button>
          </div>
        </CardHeader>

        {/* Table Content */}
        {loading ? (
          <div className="flex justify-center py-10">
            <Loader2 className="animate-spin text-gray-500 w-8 h-8" />
          </div>
        ) : error ? (
          <p className="text-center text-red-500">{error}</p>
        ) : (
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Compte</TableHead>
                  <TableHead>Libellé</TableHead>
                  <TableHead className="text-right">Débit Total</TableHead>
                  <TableHead className="text-right">Crédit Total</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredBalances.length > 0 ? (
                  filteredBalances.map((balance) => (
                    <TableRow key={balance.transactionId} className="relative">
                      <TableCell className="hidden">
                        {balance.transactionId}
                      </TableCell>{' '}
                      {/* Hidden column */}
                      <TableCell>{balance.accountCode}</TableCell>
                      <TableCell>{balance.accountLibelle}</TableCell>
                      <TableCell className="text-right text-green-600">
                        {balance.mouvementsDebit !== 0
                          ? `${balance.mouvementsDebit.toLocaleString()} DH`
                          : ''}
                      </TableCell>
                      <TableCell className="text-right text-red-600">
                        {balance.mouvementsCredit !== 0
                          ? `${balance.mouvementsCredit.toLocaleString()} DH`
                          : ''}
                      </TableCell>
                      <Link
                        href={`/companies/${companyId}/details/journals/${balance.journalId}/transactions/?operationId=${encodeURIComponent(balance.transactionId)}`}
                        className="absolute inset-0 w-full h-full"
                      />
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={6}
                      className="text-center text-gray-600 py-4"
                    >
                      Aucune donnée trouvée.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        )}

        {/* Pagination */}
        <CardFooter>
          <Pagination
            currentPage={currentPage}
            totalItems={filteredBalances.length}
            itemsPerPage={itemsPerPage}
            onPageChange={setCurrentPage}
          />
        </CardFooter>
      </Card>

      <ExportModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onExport={handleExportFile}
      />
    </div>
  );
};

export default BalanceGenerale;
