//services/JournalServices/JournalsServices.ts
import { getAllJournals } from '@/lib/db/journals';

import { Journal, UpdateJournalArgs } from 'types/Journal-types';
import {
  addNewJournal,
  deleteJournalById,
  getJournalsByStatus,
  updateExistingJournal
} from '@/lib/db/journals';

export async function displayJournals() {
  try {
    const journals = await getAllJournals();

    // Render the journals in your UI here
  } catch (error) {}
}
export async function deleteJournal(id: number) {
  await deleteJournalById(id);
}

export async function handleAddJournal(formData: FormData) {
  try {
    const rawData = Object.fromEntries(formData);
    const journal: Journal = {
      name: rawData.name as string,
      lastEditDate: new Date(),
      lastEditUser: rawData.lastEditUser as string,
      status: rawData.status as string,
      type: rawData.type as string
    };

    await addNewJournal(journal);
    console.log('the id of journal is : ', rawData.id);
  } catch (error) {
    console.log('');
  }
}

export async function handleActiveArchivedJournals() {
  const { active, archived } = await getJournalsByStatus();
  return { active, archived };
}

export async function handleEditJournal(id: number, formData: FormData) {
  try {
    if (!id || isNaN(id)) {
      console.error('Invalid or missing journal ID');
      return;
    }

    const rawData = Object.fromEntries(formData);

    const journal: UpdateJournalArgs = {
      id,
      name: rawData.name as string,
      lastEditDate: new Date(),
      lastEditUser: rawData.lastEditUser as string,
      status: rawData.status as string,
      type: rawData.type as string
    };

    await updateExistingJournal(journal);
  } catch (error) {}
}
