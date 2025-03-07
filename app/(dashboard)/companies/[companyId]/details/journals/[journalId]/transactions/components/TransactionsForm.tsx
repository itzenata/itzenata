'use client';

import { Button } from '@/components/ui/button';
import {
  handleAddTransaction,
  handleUpdateTransaction
} from 'services/TransactionService';
import { useState, useEffect } from 'react';
import AccountSelector from '../../../../../../../accounts/AccountSelector';
import { useToast } from '@/components/hooks/use-toast';
import {
  TransactionAccount,
  TransactionWithAccount
} from 'types/accounts-type';

interface TransactionFormProps {
  companyId: number;
  journalId: number;
  onClose: () => void;
  transaction?: TransactionWithAccount | null;
  mode: 'edit' | 'add';
}

const defaultFormState = {
  libelle: '',
  transactionDate: new Date().toISOString().split('T')[0]
};

export default function TransactionForm({
  companyId,
  journalId,
  onClose,
  transaction,
  mode
}: TransactionFormProps) {
  const [selectedAccounts, setSelectedAccounts] = useState<
    TransactionAccount[]
  >([]);
  const [formData, setFormData] = useState(defaultFormState);
  const { toast } = useToast();

  // Reset form when switching modes or component mounts
  useEffect(() => {
    if (transaction) {
      // Edit mode
      setFormData({
        libelle: transaction.libelle || '',
        transactionDate:
          transaction.transactionDate || new Date().toISOString().split('T')[0]
      });
      setSelectedAccounts(
        transaction.accounts.map((account) => ({
          ...account,
          customLibelleAccount: account.libelle || account.customLibelleAccount
        }))
      );
    } else {
      // Add mode - reset everything
      setFormData(defaultFormState);
      setSelectedAccounts([]);
    }
  }, [transaction]);

  const validateTransaction = () => {
    const totalDebit = selectedAccounts.reduce(
      (sum, account) => sum + (account.montantDebit || 0),
      0
    );
    const totalCredit = selectedAccounts.reduce(
      (sum, account) => sum + (account.montantCredit || 0),
      0
    );

    if (totalDebit !== totalCredit) {
      toast({
        title: 'Validation échouée',
        description: `Le total des débits (${totalDebit}) doit être égal au total des crédits (${totalCredit}).`,
        variant: 'destructive'
      });
      return false;
    }

    if (totalDebit === 0 && totalCredit === 0) {
      toast({
        title: 'Validation échouée',
        description: 'Les montants ne peuvent pas être tous nuls.',
        variant: 'destructive'
      });
      return false;
    }

    return true;
  };

  const resetForm = () => {
    setFormData(defaultFormState);
    setSelectedAccounts([]);
  };

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    try {
      if (!validateTransaction()) {
        return;
      }

      const formDataObj = new FormData(e.currentTarget as HTMLFormElement);
      const totalDebit = selectedAccounts.reduce(
        (sum, account) => sum + (account.montantDebit || 0),
        0
      );
      const totalCredit = selectedAccounts.reduce(
        (sum, account) => sum + (account.montantCredit || 0),
        0
      );

      const accountsData = selectedAccounts.map((account) => ({
        accountId: account.id,
        customLibelleAccount: account.customLibelleAccount,
        montantDebit: account.montantDebit || 0,
        montantCredit: account.montantCredit || 0
      }));

      const transactionData = {
        ...Object.fromEntries(formDataObj),
        companyId,
        journalId,
        montantDebit: totalDebit,
        montantCredit: totalCredit
      };

      if (transaction) {
        // Update mode
        await handleUpdateTransaction(
          transaction.id,
          transactionData,
          accountsData
        );
        toast({
          title: 'Transaction mise à jour',
          description: 'La transaction a été mise à jour avec succès.',
          variant: 'default'
        });
      } else {
        // Add mode
        await handleAddTransaction(
          transactionData,
          accountsData,
          companyId,
          journalId
        );
        toast({
          title: 'Transaction créée',
          description: 'La transaction a été ajoutée avec succès.',
          variant: 'default'
        });
        resetForm();
      }
      onClose();
    } catch (error) {
      toast({
        title: 'Erreur',
        description: transaction
          ? 'Une erreur est survenue lors de la mise à jour de la transaction.'
          : 'Une erreur est survenue lors de la création de la transaction.',
        variant: 'destructive'
      });
      console.error('Erreur lors de la sauvegarde de la transaction :', error);
    }
  }

  const handleAddAccount = (account: TransactionAccount) => {
    if (!selectedAccounts.find((c) => c.id === account.id)) {
      setSelectedAccounts([...selectedAccounts, account]);
    }
  };

  const handleRemoveAccount = (index: number) => {
    const newAccounts = [...selectedAccounts];
    newAccounts.splice(index, 1);
    setSelectedAccounts(newAccounts);
  };

  return (
    <div className="bg-gray-100 p-4">
      <form
        onSubmit={handleSubmit}
        className="w-full p-6 border rounded-md bg-white shadow-lg"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <label className="block">
            Libellé
            <input
              type="text"
              name="libelle"
              required
              value={formData.libelle}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, libelle: e.target.value }))
              }
              className="input mt-1 w-full border border-gray-300 rounded-md p-2"
            />
          </label>
          <label className="block">
            Date de Transaction
            <input
              type="date"
              name="transactionDate"
              value={formData.transactionDate}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  transactionDate: e.target.value
                }))
              }
              required
              className="input mt-1 w-full border border-gray-300 rounded-md p-2"
            />
          </label>
        </div>

        <AccountSelector
          selectedAccounts={selectedAccounts}
          onAddAccount={handleAddAccount}
          onRemoveAccount={handleRemoveAccount}
        />

        <div className="mt-8 flex gap-4">
          <Button type="submit" className="w-full sm:w-auto">
            {transaction ? 'Mettre à jour' : 'Valider'}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            className="w-full sm:w-auto"
          >
            Annuler
          </Button>
        </div>
      </form>
    </div>
  );
}
