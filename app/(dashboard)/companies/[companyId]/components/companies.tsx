'use client';

import {
  TableHead,
  TableRow,
  TableHeader,
  TableBody,
  Table
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
import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'; // Added import
import { PlusCircle } from 'lucide-react'; // Added import
import Link from 'next/link'; // Added import

import { SelectCompany } from '@/lib/db/companies';
import SortingControls from 'app/(dashboard)/general-components/SortingControls';

import { Company } from './company';
import { exportToPDF } from 'services/ExportToPDF';
import ExportModal from 'app/(dashboard)/ExportModal';
import { exportToXLSX } from 'services/ExportToXLSX';

export function Companies({
  companies,
  urlToAdd = `/companies/123?isEditing=false`
}: {
  companies: SelectCompany[];
  offset: number;
  totalCompanies: number;
  urlToAdd?: string; // Added optional prop
}) {
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState('all'); // Added state for tabs

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [pdfTitle, setPdfTitle] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const initialSortField = searchParams.get('sortField') || 'foundedOn';
  const initialSortOrder =
    (searchParams.get('sortOrder') as 'asc' | 'desc') || 'desc';

  const sortOptions = [
    { value: 'name', label: 'Raison Sociale' },
    { value: 'foundedOn', label: 'Date de création' },
    { value: 'employees', label: 'Employés' },
    { value: 'capital', label: 'Capital' }
  ];
  const handleExportFile = (title: string, format: 'pdf' | 'xlsx') => {
    if (format === 'pdf') {
      exportToPDF(title, pdfColumns, pdfData);
    } else {
      exportToXLSX(title, pdfColumns, pdfData);
    }
  };
  // Modified sorting to include filtering by tab
  const sortedCompanies = [...companies]
    .filter((company) => {
      if (activeTab === 'all') return true;
      if (activeTab === 'active') return company.status === 'active';
      if (activeTab === 'inactive') return company.status === 'inactive';
      return true;
    })
    .sort((a, b) => {
      const aField = a[initialSortField as keyof SelectCompany];
      const bField = b[initialSortField as keyof SelectCompany];

      if (aField == null && bField == null) return 0;
      if (aField == null) return initialSortOrder === 'asc' ? -1 : 1;
      if (bField == null) return initialSortOrder === 'asc' ? 1 : -1;

      if (aField < bField) return initialSortOrder === 'asc' ? -1 : 1;
      if (aField > bField) return initialSortOrder === 'asc' ? 1 : -1;
      return 0;
    });

  const pdfColumns = [
    { header: 'Raison Sociale', dataKey: 'name' },
    { header: 'Forme Juridique', dataKey: 'legalForm' },
    { header: 'Statut', dataKey: 'status' },
    { header: 'Capital', dataKey: 'capital' },
    { header: 'Employés', dataKey: 'employees' },
    { header: 'Date de création', dataKey: 'foundedOn' },
    { header: 'Activité', dataKey: 'activity' }
  ];

  const pdfData = sortedCompanies.map((company) => ({
    name: company.name || 'N/A',
    status: company.status || 'N/A',
    capital: company.capital ? `${company.capital} MAD` : 'N/A',
    employees: company.employees || 'N/A',
    foundedOn: company.foundedOn
      ? new Date(company.foundedOn).toLocaleDateString('fr-FR')
      : 'N/A',
    activity: company.activity || 'N/A',
    legalForm: company.legalForm || 'N/A'
  }));

  return (
    <>
      <Card className="mt-5">
        <div className="flex items-center justify-between px-6 py-4">
          <CardHeader>
            {/* TODO put to entreprises */}
            <CardTitle>Companies</CardTitle>
            <CardDescription>
              Gérez vos entreprises et suivez leur performance.
            </CardDescription>
          </CardHeader>

          <div className="flex justify-between items-center mt-4 ">
            <div className="flex items-center gap-2 mr-4">
              <SortingControls
                initialSortField={initialSortField}
                initialSortOrder={initialSortOrder}
                options={sortOptions}
              />
            </div>

            <div className="flex items-center gap-4">
              <Link href={urlToAdd}>
                <Button
                  size="sm"
                  className="h-8 gap-1 bg-indigo-600 text-white border-indigo-700 hover:bg-indigo-700"
                >
                  <PlusCircle className="h-3.5 w-3.5" />
                  <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                    Ajouter une entreprise
                  </span>
                </Button>
              </Link>

              <Button
                onClick={() => setIsModalOpen(true)}
                className="bg-blue-500 text-white px-4 py-2 rounded-md"
              >
                Exporter
              </Button>
            </div>
          </div>
        </div>

        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Raison Sociale</TableHead>
                <TableHead>Image</TableHead>
                <TableHead className="hidden md:table-cell">
                  Forme Juridique
                </TableHead>
                <TableHead>Statut</TableHead>
                <TableHead className="hidden md:table-cell">Capital</TableHead>
                <TableHead className="hidden md:table-cell">Employés</TableHead>
                <TableHead className="hidden md:table-cell">
                  Date de creation
                </TableHead>
                <TableHead className="hidden md:table-cell">Activité</TableHead>

                <TableHead className="hidden md:table-cell">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedCompanies?.length ? (
                sortedCompanies.map((company) => (
                  <Company key={company.id} company={company} />
                ))
              ) : (
                <TableRow>
                  <td colSpan={9} className="text-center py-4">
                    Aucune entreprise trouvée.
                  </td>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
        <CardFooter />
      </Card>

      <ExportModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onExport={handleExportFile}
      />
    </>
  );
}
