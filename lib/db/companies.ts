//lib/db/companies.ts
'use server';
import { count, eq, ilike } from 'drizzle-orm';
import {
  Company,
  companyInsertSchema,
  UpdateCompanyArgs
} from 'types/companies-types';
import { redirect } from 'next/navigation';

import { companies, db } from './schema';

export type SelectCompany = typeof companies.$inferSelect;

// Function to filter companies by status and split them into two categories
export async function getCompaniesByStatus(): Promise<{
  actif: SelectCompany[];
  archives: SelectCompany[];
}> {
  // Fetch active companies
  const actifCompanies = await db
    .select()
    .from(companies)
    .where(eq(companies.status, 'active'));

  // Fetch inactive companies (archived)
  const archivesCompanies = await db
    .select()
    .from(companies)
    .where(eq(companies.status, 'inactive'));

  return {
    actif: actifCompanies,
    archives: archivesCompanies
  };
}

// Function to get company details by ID
// This function fetches a company from the database using its unique ID.
export async function getCompanyById(id: number): Promise<Company | null> {
  // Query the database
  let company = await db.select().from(companies).where(eq(companies.id, id));

  // If no company found, return null
  if (!company[0]) {
    return null;
  }

  // Map the result to the Company interface
  const selectedCompany = company[0];
  const mappedCompany: Company = {
    id: selectedCompany.id,
    name: selectedCompany.name,
    imageUrl: selectedCompany.imageUrl,
    capital: selectedCompany.capital ?? 0,
    employees: selectedCompany.employees,
    foundedOn: selectedCompany.foundedOn,
    status: selectedCompany.status as 'active' | 'inactive',
    activity: selectedCompany.activity ?? '',
    legalForm: selectedCompany.legalForm as
      | 'SARL'
      | 'SA'
      | 'SNC'
      | 'SCS'
      | 'Autres',
    address: selectedCompany.address || '',
    additionalInfo: selectedCompany.additionalInfo || '',
    phone:
      selectedCompany.phone !== null ? selectedCompany.phone.toString() : '',
    email: selectedCompany.email ?? '',
    website: selectedCompany.website ?? '',
    vatIdentifier: selectedCompany.vatIdentifier ?? '',
    cnss: selectedCompany.cnss ?? 0,
    declarationRegime: selectedCompany.declarationRegime ?? '',
    paymentMode: selectedCompany.paymentMode ?? '',
    debutEncaissement: selectedCompany.debutEncaissement ?? '',
    createdAt: selectedCompany.createdAt ?? new Date(),
    updatedAt: selectedCompany.updatedAt ?? new Date(),
    ifId: selectedCompany.ifId ?? 0,
    ice: selectedCompany.ice ?? 0,
    rc: selectedCompany.rc ?? 0
  };

  return mappedCompany;
}

// Function to get a list of companies with search functionality and pagination
// This function fetches a list of companies from the database, with optional search and pagination.
export async function getCompanies(
  search: string,
  offset: number
): Promise<{
  companies: SelectCompany[];
  newOffset: number | null;
  totalCompanies: number;
}> {
  if (search) {
    return {
      companies: await db
        .select()
        .from(companies)
        .where(ilike(companies.name, `%${search}%`))
        .limit(1000),
      newOffset: null,
      totalCompanies: 0
    };
  }

  if (offset === null) {
    return { companies: [], newOffset: null, totalCompanies: 0 };
  }

  let totalCompanies = await db.select({ count: count() }).from(companies);
  let moreCompanies = await db.select().from(companies).limit(5).offset(offset);
  let newOffset = moreCompanies.length >= 5 ? offset + 5 : null;

  return {
    companies: moreCompanies,
    newOffset,
    totalCompanies: totalCompanies[0].count
  };
}

export async function deleteCompanyById(id: number) {
  await db.delete(companies).where(eq(companies.id, id));
}

export async function addNewCompany(company: Company): Promise<void> {
  try {
    const validatedData = companyInsertSchema.parse(company);

    await db.insert(companies).values(validatedData);

    redirect('/');
  } catch (error) {}
}

// Function to update an existing company
// This function updates the details of an existing company in the database.
export async function updateExistingCompany(
  updateArgs: UpdateCompanyArgs
): Promise<void> {
  try {
    // Validate the input data using a schema
    const validatedData = companyInsertSchema.parse({
      ...updateArgs,
      updatedAt: new Date() // Add the `updatedAt` field during validation
    });

    // Check if id is provided, if not throw an error
    if (!validatedData.id) {
      throw new Error('Company ID is required to update.');
    }

    // Perform the database update
    await db
      .update(companies)
      .set(validatedData)
      .where(eq(companies.id, validatedData.id)); // Ensure companyId is validated

    redirect('/');
  } catch (error) {
    throw error;
  }
}
