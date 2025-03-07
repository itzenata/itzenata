'use client';

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { Company } from 'types/companies-types';

export default function AccountingDetails({ company }: { company: Company }) {
  const router = useRouter();

  const handleNavigateToTransactions = () => {
    router.push(`/companies/${company.id}/details/transactions`);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 bg-gray-50">
      <Card className="shadow-lg border border-gray-200">
        <CardHeader className="bg-gray-100 p-4 rounded-t">
          <CardTitle className="text-center text-lg font-semibold text-gray-800">
            {company.name}
          </CardTitle>
        </CardHeader>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-6">
          <CardContent>
            <p className="mb-2">
              <strong className="text-gray-700">Statut:</strong>{' '}
              {company.status}
            </p>
            <p className="mb-2">
              <strong className="text-gray-700">Capital:</strong>{' '}
              {company.capital} MAD
            </p>
            <p className="mb-2">
              <strong className="text-gray-700">Date de création:</strong>{' '}
              {company.foundedOn}
            </p>
            <p className="mb-2">
              <strong className="text-gray-700">Activité:</strong>{' '}
              {company.activity}
            </p>
            <p className="mb-2">
              <strong className="text-gray-700">Forme juridique:</strong>{' '}
              {company.legalForm}
            </p>
            <p className="mb-2">
              <strong className="text-gray-700">Adresse:</strong>{' '}
              {company.address}
            </p>
          </CardContent>

          <CardContent>
            <p className="mb-2">
              <strong className="text-gray-700">Téléphone:</strong>{' '}
              {company.phone}
            </p>
            <p className="mb-2">
              <strong className="text-gray-700">Email:</strong> {company.email}
            </p>
            <p className="mb-2">
              <strong className="text-gray-700">Numéro IF:</strong>{' '}
              {company.ifId}
            </p>
            <p className="mb-2">
              <strong className="text-gray-700">Numéro ICE:</strong>{' '}
              {company.ice}
            </p>
            <p className="mb-2">
              <strong className="text-gray-700">Numéro RC:</strong> {company.rc}
            </p>
            <p className="mb-2">
              <strong className="text-gray-700">Numéro CNSS:</strong>{' '}
              {company.cnss}
            </p>
          </CardContent>
        </div>
      </Card>

      <Card className="shadow-lg border border-gray-200">
        <CardHeader className="bg-gray-100 p-4 rounded-t">
          <CardTitle className="text-center text-lg font-semibold text-gray-800">
            Transactions
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 text-center text-gray-700">
          <p>Aucune transaction disponible pour l'instant.</p>
        </CardContent>
        <CardFooter className="p-4">
          <div className="text-center w-full">
            <Button
              onClick={handleNavigateToTransactions}
              className="bg-indigo-600 text-white hover:bg-indigo-700 border border-indigo-700 rounded-lg px-4 py-2 font-medium"
            >
              Voir toutes les Transactions
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
