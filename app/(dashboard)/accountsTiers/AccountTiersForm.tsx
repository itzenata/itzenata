'use client';

import { useState } from 'react';
import { createTiers } from 'services/TiersService';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/hooks/use-toast';

const defaultFormState = {
  code: '',
  libelle: '',
  class: '',
  compteCollectif: ''
};

export default function AccountTiersForm({}: {}) {
  const [formData, setFormData] = useState(defaultFormState);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createTiers({
        ...formData,
        code: Number(formData.code),
        compteCollectif: Number(formData.compteCollectif)
      });
      toast({
        title: 'Tiers ajouté',
        description: 'Le tiers a été ajouté avec succès.',
        variant: 'default'
      });
      setFormData(defaultFormState);
    } catch (error) {
      toast({
        title: 'Erreur',
        description: 'Une erreur est survenue lors de l’ajout du tiers.',
        variant: 'destructive'
      });
      console.error('Erreur lors de l’ajout du tiers :', error);
    }
  };

  return (
    <div className="bg-gray-100 p-4">
      <form
        onSubmit={handleSubmit}
        className="w-full p-6 border rounded-md bg-white shadow-lg"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <label className="block">
            Code
            <input
              type="number"
              name="code"
              value={formData.code}
              onChange={(e) =>
                setFormData({ ...formData, code: e.target.value })
              }
              required
              className="input mt-1 w-full border border-gray-300 rounded-md p-2"
            />
          </label>
          <label className="block">
            Libellé
            <input
              type="text"
              name="libelle"
              value={formData.libelle}
              onChange={(e) =>
                setFormData({ ...formData, libelle: e.target.value })
              }
              required
              className="input mt-1 w-full border border-gray-300 rounded-md p-2"
            />
          </label>
          <label className="block">
            Classe
            <input
              type="text"
              name="class"
              value={formData.class}
              onChange={(e) =>
                setFormData({ ...formData, class: e.target.value })
              }
              required
              className="input mt-1 w-full border border-gray-300 rounded-md p-2"
            />
          </label>

          <label className="block">
            Compte Collectif
            <input
              type="number"
              name="accountId"
              value={formData.compteCollectif}
              onChange={(e) =>
                setFormData({ ...formData, compteCollectif: e.target.value })
              }
              required
              className="input mt-1 w-full border border-gray-300 rounded-md p-2"
            />
          </label>
        </div>
        <div className="mt-8 flex gap-4">
          <Button type="submit" className="w-full sm:w-auto">
            Ajouter
          </Button>
          <Button type="button" variant="outline" className="w-full sm:w-auto">
            Annuler
          </Button>
        </div>
      </form>
    </div>
  );
}
