'use server';
import {
  Journal,
  journalInsertSchema,
  UpdateJournalArgs
} from 'types/Journal-types';
import { db, journals } from './schema';
import { eq } from 'drizzle-orm';
import { redirect } from 'next/navigation';

export async function getAllJournals(): Promise<Journal[]> {
  try {
    const result = await db.select().from(journals);
    return result;
  } catch (error) {
    console.error('Error fetching journals from the database:', error);
    return []; // Return an empty array on error
  }
}

export async function getJournalById(
  journalId: number
): Promise<Journal | null> {
  try {
    const result = await db
      .select()
      .from(journals)
      .where(eq(journals.id, journalId))
      .limit(1);
    return result.length ? result[0] : null;
  } catch (error) {
    return null;
  }
}

export async function getJournalsByStatus(): Promise<{
  active: Journal[];
  archived: Journal[];
}> {
  const activeJournals = await db
    .select()
    .from(journals)
    .where(eq(journals.status, 'active'));

  const archivedJournals = await db
    .select()
    .from(journals)
    .where(eq(journals.status, 'archived'));

  return {
    active: activeJournals,
    archived: archivedJournals
  };
}
export async function deleteJournalById(id: number) {
  await db.delete(journals).where(eq(journals.id, id));
}

export async function addNewJournal(journal: Journal): Promise<void> {
  try {
    const validatedData = journalInsertSchema.parse(journal);
    await db.insert(journals).values(validatedData).returning();
  } catch (error) {
    throw error;
  }
}
export async function updateExistingJournal(
  updateArgs: UpdateJournalArgs
): Promise<void> {
  try {
    const { id, ...updateData } = updateArgs;

    const validatedData = journalInsertSchema.parse({
      ...updateData,
      lastEditDate: new Date()
    });

    await db.update(journals).set(validatedData).where(eq(journals.id, id));
  } catch (error) {
    throw error;
  }
}
