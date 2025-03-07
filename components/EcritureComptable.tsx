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
import { Loader2, Download } from 'lucide-react';
import Pagination from 'app/(dashboard)/general-components/Pagination';
import { getEcrituresComptables } from 'services/CustomService';
import { exportToPDF } from 'services/ExportToPDF';
import { EcritureComptableContent } from 'types/general-types';
import DateFilter from './DateFilter';
import PDFExportModal from 'app/(dashboard)/ExportModal';
import { useSearchParams } from 'next/navigation';
import React from 'react';
import Link from 'next/link';

const EcrituresComptables: React.FC<{ companyId: number }> = ({
  companyId
}) => {
  const [ecritures, setEcritures] = useState<EcritureComptableContent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [pdfTitle] = useState('Écritures Comptables');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

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
    const fetchEcritures = async () => {
      try {
        setLoading(true);
        const data = await getEcrituresComptables(
          companyId,
          dateFilter,
          selectedMonth,
          selectedQuarter,
          selectedYear,
          customStartDate ?? undefined,
          customEndDate ?? undefined
        );
        setTimeout(() => {
          setEcritures(data);
          setLoading(false);
        }, 800);
      } catch (err) {
        setError('Erreur lors du chargement des écritures comptables.');
        setLoading(false);
      }
    };
    fetchEcritures();
  }, [
    companyId,
    dateFilter,
    selectedMonth,
    selectedQuarter,
    selectedYear,
    customStartDate,
    customEndDate
  ]);

  // Filter balances
  const filterdEcritures = ecritures.filter((ecriture) =>
    ecriture.journalName.toLowerCase().includes(searchValue.toLowerCase())
  );

  // Define columns for PDF export
  const pdfColumns = [
    { header: 'Date', dataKey: 'date' },
    { header: 'Journal', dataKey: 'journalName' },
    { header: 'Compte', dataKey: 'accountCode' },
    { header: 'Débit', dataKey: 'debit' },
    { header: 'Crédit', dataKey: 'credit' }
  ];

  // Prepare table data for PDF export
  const pdfData = filterdEcritures.map((entry) => ({
    date: entry.date,
    journalName: entry.journalName,
    accountCode: entry.accountCode,
    debit: entry.debit.toLocaleString() + ' DH',
    credit: entry.credit.toLocaleString() + ' DH'
  }));

  return (
    <div className="w-full flex flex-col gap-6">
      <Card>
        {/* Header Section */}
        <CardHeader className="flex justify-between items-center">
          <CardTitle>Écritures Comptables</CardTitle>
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
                  <TableHead>Date</TableHead>
                  <TableHead>Journal Id</TableHead>
                  <TableHead>Journal Name</TableHead>
                  <TableHead>Compte</TableHead>
                  <TableHead className="text-right">Débit</TableHead>
                  <TableHead className="text-right">Crédit</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filterdEcritures.length > 0 ? (
                  filterdEcritures.map((entry, index) => (
                    <React.Fragment key={entry.transactionId}>
                      <TableRow className="relative">
                        <TableCell>{entry.date}</TableCell>
                        <TableCell>{entry.journalId}</TableCell>
                        <TableCell>{entry.journalName}</TableCell>
                        <TableCell>{entry.accountCode}</TableCell>
                        <TableCell className="text-right text-green-600">
                          {entry.debit.toLocaleString()} DH
                        </TableCell>
                        <TableCell className="text-right text-red-600">
                          {entry.credit.toLocaleString()} DH
                        </TableCell>
                        <TableCell className="text-right">
                          <Link
                            href={`/companies/${companyId}/details/journals/${entry.journalId}/transactions/?operationId=${encodeURIComponent(entry.transactionId)}`}
                            className="absolute inset-0 w-full h-full"
                          />
                        </TableCell>
                      </TableRow>
                      {index < filterdEcritures.length - 1 &&
                        filterdEcritures[index].transactionId !==
                          filterdEcritures[index + 1].transactionId && (
                          <TableRow>
                            <TableCell
                              colSpan={7}
                              className="border-b-2 border-blue-300 py-0"
                            ></TableCell>
                          </TableRow>
                        )}
                    </React.Fragment>
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
            totalItems={filterdEcritures.length}
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

export default EcrituresComptables;
