import 'server-only';

import { accounts, db } from '@/lib/db/schema';
import { asc, desc } from 'drizzle-orm'; // Import sorting utilities if needed
import { Account } from 'types/accounts-type'; // Adjust path to your type definition

// Function to fetch and sort accounts from the database
export async function getSortedAccounts(
  sortField: keyof Account = 'code',
  sortOrder: 'asc' | 'desc' = 'asc'
): Promise<Account[]> {
  // Validate sortField
  const validFields: (keyof Account)[] = ['code', 'libelle', 'class'];
  if (!validFields.includes(sortField)) {
    throw new Error(`Invalid sortField: ${sortField}`);
  }

  // Fetch and sort accounts using Drizzle ORM
  const sortedAccounts = await db
    .select()
    .from(accounts)
    .orderBy(
      sortOrder === 'asc' ? asc(accounts[sortField]) : desc(accounts[sortField])
    );

  return sortedAccounts;
}


