import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { File, PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

import { handlerActiveInactiveCompanies } from 'services/CompanyService';
import Link from 'next/link';
import { SearchParamsTypes } from 'types/general-types';
import { getCompanies, getCompanyById } from '@/lib/db/companies';
import { Companies } from './companies/[companyId]/components/companies';

export default async function CompaniesPage({
  searchParams: rawSearchParams
}: {
  searchParams: Promise<SearchParamsTypes>;
}) {
  const searchParams = await rawSearchParams;

  // Destructure search params with defaults
  const { q = '', offset = 0, showForm = 'false', companyId } = searchParams;

  // Fetch data
  const { companies, newOffset, totalCompanies } = await getCompanies(
    q,
    Number(offset)
  );
  const { actif, archives } = await handlerActiveInactiveCompanies();
  const companyData = companyId
    ? await getCompanyById(Number(companyId))
    : null;

  const urlToAdd = `/companies/123?isEditing=false`;

  return (
    <Tabs defaultValue="all" className="mt-10">
      {/* Header */}
      <div className="flex items-center justify-between">
        <TabsList>
          <TabsTrigger value="all">Tout</TabsTrigger>
          <TabsTrigger value="active">Actif</TabsTrigger>
          <TabsTrigger value="archived" className="hidden sm:flex">
            Archivés
          </TabsTrigger>
        </TabsList>
      </div>

      {/* Tabs Content */}
      <TabsContent value="all">
        {companies?.length ? (
          <Companies
            companies={companies}
            offset={newOffset ?? 0}
            totalCompanies={totalCompanies}
          />
        ) : (
          <p className="text-center text-gray-600">
            Aucune entreprise trouvée.
          </p>
        )}
      </TabsContent>

      <TabsContent value="active">
        {actif?.length ? (
          <Companies
            companies={actif}
            offset={0}
            totalCompanies={actif.length}
          />
        ) : (
          <p className="text-center text-gray-600">Aucune entreprise active.</p>
        )}
      </TabsContent>

      <TabsContent value="archived">
        {archives?.length ? (
          <Companies
            companies={archives}
            offset={0}
            totalCompanies={archives.length}
          />
        ) : (
          <p className="text-center text-gray-600">
            Aucune entreprise archivée.
          </p>
        )}
      </TabsContent>
    </Tabs>
  );
}
