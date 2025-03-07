// lib/db/tiers.ts (Database Operations)

import { eq } from 'drizzle-orm';
import { db, tiers } from './schema';

type TiersType = {
  id: number;
  code: number;
  libelle: string;
  class: string;
  compteCollectif?: number;
};
export async function getAllTiers() {
  return await db.select().from(tiers);
}

export async function addTiers(data: {
  code: number;
  libelle: string;
  class: string;
  compteCollectif?: number;
}) {
  return await db.insert(tiers).values(data).returning();
}

export async function updateTier(
  id: number,
  data: Partial<{
    code: number;
    libelle: string;
    class: string;
    compteCollectif?: number;
  }>
) {
  return await db.update(tiers).set(data).where(eq(tiers.id, id)).returning();
}

export async function deleteTier(id: number) {
  return await db.delete(tiers).where(eq(tiers.id, id)).returning();
}
