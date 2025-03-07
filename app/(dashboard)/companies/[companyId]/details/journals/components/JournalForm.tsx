import React, { useState, useEffect } from 'react';
import { Journal } from 'types/Journal-types';
import { Card, CardContent } from '@/components/ui/card';
import { Save, X } from 'lucide-react';
import { handleAddJournal, handleEditJournal } from 'services/JournalServices';
import { useToast } from '@/components/hooks/use-toast';
import { getAllJournals } from '@/lib/db/journals';

interface JournalFormProps {
  journal?: Journal | null;
  onCancel?: () => void;
  onSuccess?: () => void;
}

const JournalForm: React.FC<JournalFormProps> = ({
  journal,
  onCancel,
  onSuccess
}) => {
  const [formData, setFormData] = useState({
    name: journal?.name || '',
    lastEditDate: journal?.lastEditDate
      ? new Date(journal.lastEditDate).toISOString().split('T')[0]
      : new Date().toISOString().split('T')[0],
    lastEditUser: journal?.lastEditUser || '',
    status: journal?.status || '',
    type: journal?.type || ''
  });

  const { toast } = useToast();

  useEffect(() => {
    if (journal) {
      setFormData({
        name: journal.name,
        lastEditDate: journal.lastEditDate
          ? new Date(journal.lastEditDate).toISOString().split('T')[0]
          : new Date().toISOString().split('T')[0],
        lastEditUser: journal.lastEditUser || '',
        status: journal.status || '',
        type: journal.type || ''
      });
    }
  }, [journal]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const resetForm = () => {
    setFormData({
      name: '',
      lastEditDate: new Date().toISOString().split('T')[0],
      lastEditUser: '',
      status: '',
      type: ''
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const journalData = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (value !== null) {
          journalData.append(key, value.toString());
        }
      });

      if (journal?.id) {
        await handleEditJournal(journal.id, journalData);
        toast({
          title: 'Journal mis à jour',
          description: 'Le journal a été modifié avec succès.',
          variant: 'default'
        });
      } else {
        await handleAddJournal(journalData);
        toast({
          title: 'Journal créé',
          description: 'Le journal a été ajouté avec succès.',
          variant: 'default'
        });
        resetForm();
      }

      onSuccess?.();
    } catch (error) {
      toast({
        title: 'Erreur',
        description:
          'Une erreur est survenue lors de la sauvegarde du journal.',
        variant: 'destructive'
      });
      console.error('Error saving journal:', error);
    }
  };

  const inputClass =
    'mt-1 w-full rounded-md border border-gray-300 bg-gray-50 px-3 py-2 text-sm  focus:border-gray-400 focus:ring-1 focus:ring-gray-400 hover:bg-gray-100 transition-colors';
  const labelClass = 'text-sm font-medium text-gray-600';

  return (
    <Card className="w-full bg-white">
      <CardContent className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className={labelClass}>Nom</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className={inputClass}
                required
                placeholder="Entrez le nom du journal"
              />
            </div>

            <div className="space-y-2">
              <label className={labelClass}>
                Date de dernière modification
              </label>
              <input
                type="date"
                name="lastEditDate"
                value={formData.lastEditDate}
                onChange={handleInputChange}
                className={inputClass}
              />
            </div>

            <div className="space-y-2">
              <label className={labelClass}>
                Dernier utilisateur ayant modifié
              </label>
              <input
                type="text"
                name="lastEditUser"
                value={formData.lastEditUser}
                onChange={handleInputChange}
                className={inputClass}
                placeholder="Entrez le dernier éditeur"
              />
            </div>

            <div className="space-y-2">
              <label className={labelClass}>Statut</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                className={inputClass}
              >
                <option value="">Sélectionnez le statut</option>
                <option value="active">Actif</option>
                <option value="inactive">Inactif</option>
                <option value="pending">En attente</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className={labelClass}>Type</label>
              <select
                name="type"
                value={formData.type}
                onChange={handleInputChange}
                className={inputClass}
              >
                <option value="">Sélectionnez le type</option>
                <option value="standard">Standard</option>
                <option value="special">Spécial</option>
                <option value="recurring">Récurrent</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end space-x-4 pt-4">
            <button
              type="button"
              onClick={() => {
                resetForm();
                onCancel?.();
              }}
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-gray-50 hover:bg-gray-100 focus:outline-none focus:ring-1 focus:ring-gray-400 transition-colors"
            >
              <X className="w-4 h-4 mr-2" />
              Annuler
            </button>

            <button
              type="submit"
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md text-gray-50 bg-gray-800 hover:bg-gray-700 focus:outline-none focus:ring-1 focus:ring-gray-400 transition-colors"
            >
              <Save className="w-4 h-4 mr-2" />
              {journal ? 'Mettre à jour le journal' : 'Ajouter un journal'}
            </button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default JournalForm;
