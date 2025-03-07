import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { Download, Loader2 } from 'lucide-react';
import { getGrandLivre } from 'services/CustomService';
import { GrandLivreContent } from 'types';
import { exportToPDF } from 'services/ExportToPDF';
import { Button } from './ui/button';
import DateFilter from './DateFilter';
import ExportModal from 'app/(dashboard)/ExportModal';
import {
  calculateTVADetails,
  calculateTVASummary // Added missing import
} from 'services/TvaCalculation';

const TVACalculationView: React.FC<{ companyId: number }> = ({ companyId }) => {
  const [transactions, setTransactions] = useState<GrandLivreContent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Date filter state
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
    const fetchTransactions = async () => {
      try {
        const fetchedTransactions = await getGrandLivre(
          companyId,
          dateFilter,
          selectedMonth,
          selectedQuarter,
          selectedYear,
          customStartDate ?? undefined,
          customEndDate ?? undefined
        );
        setTransactions(fetchedTransactions);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching transactions', error);
        setError('Failed to fetch transactions');
        setLoading(false);
      }
    };

    fetchTransactions();
  }, [
    companyId,
    dateFilter,
    selectedMonth,
    selectedQuarter,
    selectedYear,
    customStartDate,
    customEndDate
  ]);

  // Calculate TVA summary
  const summary = calculateTVASummary(transactions);
  const { tvaCollectee, tvaDeductible, tvaAPayer } = summary;

  // Add debug logging
  useEffect(() => {
    if (transactions.length > 0) {
      console.log('Transactions:', transactions);
      console.log('TVA Summary:', summary);
    }
  }, [transactions, summary]);

  const handleExport = (title: string) => {
    const columns = [
      { title: 'Compte', dataKey: 'accountLibelle' },
      { title: 'Type', dataKey: 'type' },
      { title: 'Montant', dataKey: 'amount' },
      { title: 'TVA', dataKey: 'tvaAmount' },
      { title: 'Taux', dataKey: 'tvaRate' } // Added TVA rate column
    ];

    const data = transactions
      .map((transaction) => calculateTVADetails(transaction))
      .filter((detail) => detail.type !== 'Non soumis')
      .map((detail) => ({
        accountLibelle: detail.accountLibelle,
        type: detail.type,

        tvaAmount: detail.tvaAmount.toLocaleString()
      }));
    exportToPDF(title, columns, data);
  };

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <div className="w-full flex flex-col gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex justify-center">TVA Calculation</CardTitle>
          <div className="flex justify-between items-center w-full">
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
              Exporter en PDF <Download className="ml-2 w-4 h-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center py-10">
              <Loader2 className="animate-spin text-gray-500 w-8 h-8" />
            </div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Compte</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead className="text-right">Montant</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {transactions
                    .map((transaction, index) =>
                      calculateTVADetails(transaction)
                    )
                    .filter((detail) => detail.type !== 'Non soumis')
                    .map((detail, index) => (
                      <TableRow key={index}>
                        <TableCell>{detail.accountLibelle}</TableCell>
                        <TableCell>{detail.type}</TableCell>

                        <TableCell className="text-right">
                          {detail.tvaAmount.toLocaleString()} DH
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
              <div className="mt-4 grid grid-cols-3 gap-4">
                <Card>
                  <CardContent className="p-4 text-center">
                    <div className="text-sm text-muted-foreground">
                      TVA Collectée
                    </div>
                    <div className="text-2xl font-bold text-green-600">
                      {tvaCollectee.toLocaleString()} DH
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <div className="text-sm text-muted-foreground">
                      TVA Déductible
                    </div>
                    <div className="text-2xl font-bold text-blue-600">
                      {tvaDeductible.toLocaleString()} DH
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <div className="text-sm text-muted-foreground">
                      TVA Total
                    </div>
                    <div className="text-2xl font-bold text-red-600">
                      {tvaAPayer.toLocaleString()} DH
                    </div>
                  </CardContent>
                </Card>
              </div>
            </>
          )}
        </CardContent>
      </Card>
      <ExportModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onExport={handleExport}
      />
    </div>
  );
};

export default TVACalculationView;
