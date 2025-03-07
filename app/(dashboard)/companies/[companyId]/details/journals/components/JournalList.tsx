'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { getAllJournals } from '@/lib/db/journals';
import { Journal, JournalInsert } from 'types/Journal-types';
import JournalForm from './JournalForm';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Edit, ExternalLink, Loader2, Trash2 } from 'lucide-react';
import { deleteJournal } from 'services/JournalServices';
import DeleteJournalDialog from 'app/(dashboard)/DeleteJournalDialog';

type SortingField = {
  value: keyof Journal;
  label: string;
};

const sortingOptions: SortingField[] = [
  { value: 'id', label: 'Date de création' },
  { value: 'name', label: 'Nom' },
  { value: 'status', label: 'Statut' }
];

interface JournalListProps {
  companyId: number;
}

export default function JournalList({ companyId }: JournalListProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [journals, setJournals] = useState<Journal[]>([]);
  const fetchJournals = async () => {
    const data = await getAllJournals(); // Fetch updated list
    setJournals(data);
  };

  useEffect(() => {
    fetchJournals();
  }, []);

  const handleSuccess = () => {
    fetchJournals(); // Refresh list after adding/editing
  };
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedJournal, setSelectedJournal] = useState<JournalInsert | null>(
    null
  );
  const [showForm, setShowForm] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [journalToDelete, setJournalToDelete] = useState<{
    id: number;
    name: string;
  } | null>(null);

  const [sortField, setSortField] = useState<keyof Journal>(
    (searchParams?.get('sortField') as keyof Journal) || 'id'
  );
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>(
    (searchParams?.get('sortOrder') as 'asc' | 'desc') || 'asc'
  );

  const ITEMS_PER_PAGE = 6;

  useEffect(() => {
    const fetchJournals = async () => {
      try {
        const fetchedJournals = await getAllJournals();
        setJournals(fetchedJournals);
      } catch (err) {
        console.error('Erreur lors de la récupération des journaux :', err);
        setError('Échec du chargement des journaux');
      } finally {
        setLoading(false);
      }
    };

    fetchJournals();
  }, []);

  const getSortedJournals = (journalsToSort: Journal[]) => {
    return [...journalsToSort].sort((a, b) => {
      const aValue =
        a[sortField] instanceof Date
          ? (a[sortField] as Date).getTime()
          : (a[sortField] ?? '');
      const bValue =
        b[sortField] instanceof Date
          ? (b[sortField] as Date).getTime()
          : (b[sortField] ?? '');

      if (aValue === bValue) return 0;

      const comparison = aValue < bValue ? -1 : 1;
      return sortOrder === 'asc' ? comparison : -comparison;
    });
  };

  const handleSortChange = (field: keyof Journal, order: 'asc' | 'desc') => {
    const url = new URL(window.location.href);
    url.searchParams.set('sortField', field);
    url.searchParams.set('sortOrder', order);
    router.push(url.toString());
    setSortField(field);
    setSortOrder(order);
  };

  const resetForm = () => {
    setSelectedJournal(null);
    setShowForm(false);
  };

  const handleDelete = (journal: Journal) => {
    if (journal.id === undefined) {
      console.error('Journal ID is missing');
      return;
    }

    setJournalToDelete({ id: journal.id, name: journal.name });
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (journalToDelete?.id) {
      try {
        await deleteJournal(journalToDelete.id);
        setJournals((prevJournals) =>
          prevJournals.filter((journal) => journal.id !== journalToDelete.id)
        );
        setIsDeleteDialogOpen(false);
        setJournalToDelete(null);
      } catch (err) {
        console.error('Error deleting journal:', err);
      }
    }
  };

  const sortedJournals = getSortedJournals(journals);
  const totalPages = Math.ceil(sortedJournals.length / ITEMS_PER_PAGE);
  const displayedJournals = sortedJournals.slice(
    currentPage * ITEMS_PER_PAGE,
    (currentPage + 1) * ITEMS_PER_PAGE
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen rounded-lg border border-black">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="text-center text-red-600">
              <p className="text-lg font-medium">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Réessayer
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div>
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between space-x-4 mb-8">
          <h1 className="text-2xl  font-bold text-gray-800"></h1>

          <div className="flex items-center space-x-3">
            <span className="text-gray-600 ">Trier par :</span>
            <select
              value={sortField}
              onChange={(e) =>
                handleSortChange(e.target.value as keyof Journal, sortOrder)
              }
              className="px-3 py-2  border border-gray-300 rounded bg-gray-50 hover:bg-gray-100 focus:outline-none focus:ring-1 focus:ring-gray-400"
            >
              {sortingOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>

            <span className="text-gray-600 ">Ordre :</span>
            <select
              value={sortOrder}
              onChange={(e) =>
                handleSortChange(sortField, e.target.value as 'asc' | 'desc')
              }
              className="px-3 py-2 border border-gray-300 rounded bg-gray-50 hover:bg-gray-100 focus:outline-none focus:ring-1 focus:ring-gray-400"
            >
              <option value="asc">Ascendant</option>
              <option value="desc">Descendant</option>
            </select>
          </div>

          {/* Right - Button */}
          {!showForm && (
            <button
              onClick={() => {
                resetForm();
                setShowForm(true);
              }}
              className="inline-flex items-center px-4 py-2 bg-gray-800 text-gray-50 font rounded hover:bg-gray-700 transition-colors shadow-sm"
            >
              <Plus className="h-5 w-5 mr-2" />
              Ajouter Journal
            </button>
          )}
        </div>
      </div>
      {showForm && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>
              {selectedJournal
                ? 'Modifier le journal'
                : 'Ajouter un nouveau journal'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <JournalForm
              journal={selectedJournal}
              onSuccess={handleSuccess}
              onCancel={() => {
                setShowForm(false);
                setSelectedJournal(null);
              }}
            />
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-2 gap-6 mb-6">
        {journals.length === 0 ? (
          <div className="col-span-2">
            <Card>
              <CardContent className="pt-6">
                <div className="text-center text-gray-500">
                  <p className="text-lg font-medium">
                    Aucun journal disponible
                  </p>
                  <p className="mt-1">
                    Cliquez sur le bouton ci-dessus pour ajouter votre premier
                    journal
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        ) : (
          displayedJournals.map((journal) => (
            <Card
              key={journal.id}
              className="group hover:shadow-lg transition-all duration-300"
            >
              <CardHeader>
                <CardTitle className="text-xl">{journal.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-500">
                      Statut
                    </span>
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        journal.status === 'active'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {journal.status || 'N/A'}
                    </span>
                  </div>

                  <div className="flex flex-col gap-3 mt-4">
                    <button
                      onClick={() =>
                        router.push(
                          `/companies/${companyId}/details/journals/${journal.id}/transactions`
                        )
                      }
                      className="inline-flex items-center justify-center px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
                    >
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Voir les transactions
                    </button>
                    <button
                      onClick={() => {
                        setSelectedJournal(journal);
                        setShowForm(true);
                      }}
                      className="inline-flex items-center justify-center px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      Modifier le journal
                    </button>
                    <button
                      onClick={() => handleDelete(journal)}
                      className="inline-flex items-center justify-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Supprimer
                    </button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {journalToDelete && (
        <DeleteJournalDialog
          isOpen={isDeleteDialogOpen}
          onClose={() => setIsDeleteDialogOpen(false)}
          onConfirm={handleDeleteConfirm}
          journalName={journalToDelete.name}
        />
      )}
    </div>
  );
}
