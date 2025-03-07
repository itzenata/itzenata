//company.tsx
import Image from 'next/image';
import Link from 'next/link'; // Importer Link
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { MoreHorizontal } from 'lucide-react';
import { TableCell, TableRow } from '@/components/ui/table';
import { deleteCompany } from 'services/CompanyService';
import { useRouter } from 'next/navigation';
import { SelectCompany } from '@/lib/db/companies';

export function Company({ company }: { company: SelectCompany }) {
  const router = useRouter();
  const urlToComptabiliteDetailes = `/companies/${company.id}/details`;
  const urlToEdit = `/companies/${company.id}&isEditing=true`;

  const handleEditClick = () => {
    router.push(urlToEdit);
  };

  const handleDeleteCompany = () => {
    deleteCompany(company.id);
  };

  const foundedOnDate = company.foundedOn ? new Date(company.foundedOn) : '';

  return (
    <TableRow className="cursor-pointer hover:bg-gray-100">
      <TableCell className="font-medium">
        <Link href={urlToComptabiliteDetailes}>{company.name}</Link>
      </TableCell>
      <TableCell className="hidden sm:table-cell">
        <Link href={urlToComptabiliteDetailes}>
          {company.imageUrl ? (
            <Image
              alt="Image de l'entreprise"
              className="aspect-square rounded-md object-cover"
              height="64"
              src={company.imageUrl}
              width="64"
            />
          ) : (
            <div className="h-16 w-16 bg-gray-200 flex items-center justify-center rounded-md">
              <span className="text-gray-500">Aucune image</span>
            </div>
          )}
        </Link>
      </TableCell>

      <TableCell className="hidden md:table-cell">
        <Link href={urlToComptabiliteDetailes}>
          {company.legalForm || 'Forme juridique non disponible'}
        </Link>
      </TableCell>
      <TableCell>
        <Link href={urlToComptabiliteDetailes}>
          <Badge variant="outline" className="capitalize">
            {company.status || 'Statut non disponible'}
          </Badge>
        </Link>
      </TableCell>
      <TableCell className="hidden md:table-cell">
        <Link href={urlToComptabiliteDetailes}>
          {company.capital
            ? `${company.capital} MAD`
            : 'Informations sur le capital non disponibles'}
        </Link>
      </TableCell>
      <TableCell className="hidden md:table-cell">
        <Link href={urlToComptabiliteDetailes}>
          {company.employees || 'Nombre d’employés non disponible'}
        </Link>
      </TableCell>
      <TableCell className="hidden md:table-cell">
        <Link href={urlToComptabiliteDetailes}>
          {foundedOnDate && !isNaN(foundedOnDate.getTime())
            ? foundedOnDate.toLocaleDateString('fr-FR')
            : 'Date de création non disponible'}
        </Link>
      </TableCell>
      <TableCell className="hidden md:table-cell">
        <Link href={urlToComptabiliteDetailes}>
          {company.activity || 'Activité non disponible'}
        </Link>
      </TableCell>

      <TableCell className="hidden md:table-cell">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button aria-haspopup="true" size="icon" variant="ghost">
              <MoreHorizontal className="h-4 w-4" />
              <span className="sr-only">Basculer le menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem onClick={handleEditClick}>
              Modifier
            </DropdownMenuItem>
            <DropdownMenuItem>
              <button type="button" onClick={handleDeleteCompany}>
                Supprimer
              </button>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
  );
}
