'use client';

import { useState, useEffect } from 'react';
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
import { getTransactionsByJournalAndCompany } from '@/lib/db/transactions';
import { Download, Search, Loader2 } from 'lucide-react';
import { useParams, useSearchParams } from 'next/navigation';
import Pagination from 'app/(dashboard)/general-components/Pagination';
import { exportToPDF } from 'services/ExportToPDF';
import { GrandLivreContent } from 'types/general-types';
import { getGrandLivre } from 'services/CustomService';
import DateFilter from './DateFilter';
import PDFExportModal from 'app/(dashboard)/ExportModal';
import Link from 'next/link';

const GrandLivre: React.FC<{ companyId: number }> = ({ companyId }) => {
  const [grandLivre, setGrandLivre] = useState<GrandLivreContent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [pdfTitle] = useState('Grand Livre');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const params = useParams();
  const journalId = params.journalId ? Number(params.journalId) : undefined;

  const searchParams = useSearchParams();
  const searchValue = searchParams.get('q') || '';

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

  useEffect(() => {
    const fetchGrandLivre = async () => {
      try {
        setLoading(true);
        const data = await getGrandLivre(
          companyId,

          dateFilter,
          selectedMonth,
          selectedQuarter,
          selectedYear,
          customStartDate ?? undefined,
          customEndDate ?? undefined
        );
        setTimeout(() => {
          setGrandLivre(data);
          setLoading(false);
        }, 800);
      } catch (err) {
        setError('Erreur lors du chargement du Grand Livre.');
        setLoading(false);
      }
    };
    fetchGrandLivre();
  }, [
    companyId,

    dateFilter,
    selectedMonth,
    selectedQuarter,
    selectedYear,
    customStartDate,
    customEndDate
  ]);

  // Filter data
  const filteredData = grandLivre.filter(
    (entry) =>
      entry.accountLibelle.toLowerCase().includes(searchValue.toLowerCase()) ||
      entry.description.toLowerCase().includes(searchValue.toLowerCase())
  );

  // Define columns for PDF export
  const pdfColumns = [
    { header: 'Date', dataKey: 'date' },
    { header: 'Compte', dataKey: 'accountCode' },
    { header: 'Libellé', dataKey: 'accountLibelle' },
    { header: 'Description', dataKey: 'description' },
    { header: 'Débit', dataKey: 'debit' },
    { header: 'Crédit', dataKey: 'credit' }
  ];

  // Prepare table data for PDF export
  const pdfData = filteredData.map((entry) => ({
    date: entry.date,
    accountCode: entry.accountCode,
    accountLibelle: entry.accountLibelle,
    description: entry.description,
    debit: entry.debit.toLocaleString() + ' DH',
    credit: entry.credit.toLocaleString() + ' DH'
  }));

  return (
    <div className="w-full flex flex-col gap-6">
      <Card>
        {/* Header Section */}
        <CardHeader className="flex justify-between items-center">
          <CardTitle>Grand Livre</CardTitle>
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
            <div className="ml-auto">
              <Button onClick={() => setIsModalOpen(true)}>
                <Download className="w-4 h-4" /> Exporter
              </Button>
            </div>
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
                  <TableHead>Date</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead className="text-right">Débit</TableHead>
                  <TableHead className="text-right">Crédit</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredData.length > 0 ? (
                  filteredData.map((entry) => (
                    <TableRow key={entry.id} className="relative">
                      <TableCell className="hidden">{entry.id}</TableCell>{' '}
                      {/* Hidden column */}
                      <TableCell>{entry.accountCode}</TableCell>
                      <TableCell>{entry.accountLibelle}</TableCell>
                      <TableCell>{entry.date}</TableCell>
                      <TableCell>{entry.description}</TableCell>
                      <TableCell className="text-right text-green-600">
                        {entry.debit.toLocaleString()} DH
                      </TableCell>
                      <TableCell className="text-right text-red-600">
                        {entry.credit.toLocaleString()} DH
                      </TableCell>
                      <Link
                        href={`/companies/${companyId}/details/journals/${entry.journalId}/transactions/?operationId=${encodeURIComponent(entry.id)}`}
                        className="absolute inset-0 w-full h-full text-transparent hover:text-indigo-600"
                      />
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={7}
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
            totalItems={filteredData.length}
            itemsPerPage={itemsPerPage}
            onPageChange={setCurrentPage}
          />
        </CardFooter>
      </Card>

      {/* PDF Export Modal */}
      <PDFExportModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onExport={() => exportToPDF(pdfTitle, pdfColumns, pdfData)}
      />
    </div>
  );
};

export default GrandLivre;
