//services/CompanyServices.ts
'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { Company, UpdateCompanyArgs } from 'types/companies-types';

import {
  addNewCompany,
  deleteCompanyById,
  getCompaniesByStatus,
  updateExistingCompany
} from '@/lib/db/companies';

export async function deleteCompany(id: number) {
  await deleteCompanyById(id);
  revalidatePath('/');
}

export async function handleAddCompany(formData: FormData) {
  try {
    const rawData = Object.fromEntries(formData);

    const company: Company = {
      id: rawData.id ? parseInt(rawData.id as string) : 0,
      name: rawData.name as string,
      imageUrl: rawData.imageUrl as string,
      capital: parseInt(rawData.capital as string),
      employees: parseInt(rawData.employees as string),
      foundedOn: rawData.foundedOn as string,
      status: rawData.status as 'active' | 'inactive',
      activity: rawData.activity as string,
      legalForm: rawData.legalForm as 'SARL' | 'SA' | 'SNC' | 'SCS' | 'Autres',
      address: rawData.address as string,
      additionalInfo: rawData.additionalInfo as string,
      phone: rawData.phone as string,
      email: rawData.email as string,
      website: rawData.website as string,
      vatIdentifier: rawData.vatId as string,
      cnss: rawData.cnss ? parseInt(rawData.cnss as string) : undefined,
      declarationRegime: rawData.declarationRegime as string,
      paymentMode: rawData.paymentMode as string,
      debutEncaissement: rawData.debutEncaissement as string,
      ifId: rawData.if ? parseInt(rawData.if as string) : undefined,
      ice: rawData.ice ? parseInt(rawData.ice as string) : undefined,
      rc: rawData.rc ? parseInt(rawData.rc as string) : undefined
    };

    await addNewCompany(company);

    redirect('/');
  } catch (error) {
    console.error('Error handling add company:');
  }
}

export async function handlerActiveInactiveCompanies() {
  const { actif, archives } = await getCompaniesByStatus();
  return { actif, archives };
}
// CompanyService.ts
export async function handleEditCompany(formData: FormData) {
  try {
    const rawData = Object.fromEntries(formData);

    // Ensure we have an ID for updating
    if (!rawData.id) {
      throw new Error('Company ID is required for updating');
    }

    const company: Company = {
      id: parseInt(rawData.id as string),
      name: rawData.name as string,
      imageUrl: rawData.imageUrl as string,
      capital: parseInt(rawData.capital as string),
      employees: parseInt(rawData.employees as string),
      foundedOn: rawData.foundedOn as string,
      status: rawData.status as 'active' | 'inactive',
      activity: rawData.activity as string,
      legalForm: rawData.legalForm as 'SARL' | 'SA' | 'SNC' | 'SCS' | 'Autres',
      address: rawData.address as string,
      additionalInfo: rawData.additionalInfo as string,
      phone: rawData.phone as string,
      email: rawData.email as string,
      website: rawData.website as string,
      vatIdentifier: rawData.vatId as string,
      cnss: rawData.cnss ? parseInt(rawData.cnss as string) : undefined,
      declarationRegime: rawData.declarationRegime as string,
      paymentMode: rawData.paymentMode as string,
      debutEncaissement: rawData.debutEncaissement as string,
      ifId: rawData.if ? parseInt(rawData.if as string) : undefined,
      ice: rawData.ice ? parseInt(rawData.ice as string) : undefined,
      rc: rawData.rc ? parseInt(rawData.rc as string) : undefined,
      updatedAt: new Date()
    };

    await updateExistingCompany({
      companyId: company.id,
      ...company
    } as UpdateCompanyArgs);

    redirect('/');
  } catch (error) {
    console.error('Error handling edit company:', error);
    throw error;
  }
}
