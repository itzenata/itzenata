'use client';
import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Account, TransactionAccount } from 'types/accounts-type'; // Adjust the path if necessary
import { getAccountByCode } from 'services/AccountService';
import { useToast } from '@/components/hooks/use-toast';

interface AccountSelectorProps {
  selectedAccounts: TransactionAccount[];
  onAddAccount: (account: TransactionAccount) => void;
  onRemoveAccount: (index: number) => void;
}

interface ExtendedAccount extends TransactionAccount {
  montantDebit: number;
  montantCredit: number;
  customLibelleAccount: string;
}

export default function AccountSelector({
  selectedAccounts,
  onAddAccount,
  onRemoveAccount
}: AccountSelectorProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<Account[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [montantDebit, setmontantDebit] = useState<number | ''>('');
  const [montantCredit, setmontantCredit] = useState<number | ''>('');
  const [customLibelleAccount] = useState('');
  const { toast } = useToast();

  const resetForm = () => {
    setSearchTerm('');
    setSearchResults([]);
    setShowSuggestions(false);
    setmontantDebit('');
    setmontantCredit('');
  };
  useEffect(() => {
    if (searchTerm.trim().length < 1) {
      setSearchResults([]);
      return;
    }

    getAccountByCode(searchTerm, 'code', 'asc').then((data) => {
      return setSearchResults(data);
    });
  }, [searchTerm]);

  const handleSelectAccount = (account: Account) => {
    if (montantDebit === '' && montantCredit === '') {
      toast({
        title: 'Champs obligatoires manquants',
        description:
          'Veuillez remplir le libellé, et soit le débit soit le crédit avant de sauvegarder.',
        variant: 'destructive'
      });
      return;
    }

    if (montantDebit !== '' && montantCredit !== '') {
      toast({
        title: 'Débit ou Crédit',
        description:
          'Veuillez renseigner soit le débit, soit le crédit, mais pas les deux.',
        variant: 'destructive'
      });

      return;
    }

    const extendedAccount: ExtendedAccount = {
      ...account,
      montantDebit: montantDebit || 0,
      montantCredit: montantCredit || 0,
      customLibelleAccount
    };

    onAddAccount(extendedAccount);
    resetForm();
    toast({
      title: 'Compte ajouté',
      description: `Le compte ${account.code} - ${account.libelle} a été ajouté avec succès.`,
      variant: 'default'
    });
  };

  const handleRemoveAccount = (index: number) => {
    onRemoveAccount(index);
    toast({
      title: 'Compte supprimé',
      description: 'Le compte a été retiré de la liste.',
      variant: 'default'
    });
  };

  const handlemontantDebitChange = (value: number | '') => {
    setmontantDebit(value);
    if (value !== '') setmontantCredit('');
  };

  const handlemontantCreditChange = (value: number | '') => {
    setmontantCredit(value);
    if (value !== '') setmontantDebit('');
  };

  return (
    <div className="mt-6">
      <h3 className="text-lg font-semibold">Comptes Associés</h3>

      <div className="space-y-4 mt-4">
        {selectedAccounts.map((account, index) => (
          <div
            key={index}
            className="p-4 bg-gray-50 rounded-md border shadow-sm"
          >
            <div className="flex justify-between items-center mb-2">
              <span className="font-semibold text-gray-800">
                {account.code} - {account.libelle}
              </span>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => handleRemoveAccount(index)}
                className="text-red-600 hover:text-red-800"
              >
                Supprimer
              </Button>
            </div>
            <div className="grid grid-cols-3 gap-4 text-sm text-gray-600">
              <div>
                <strong>Débit:</strong> {account.montantDebit}
              </div>
              <div>
                <strong>Crédit:</strong> {account.montantCredit}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="relative flex flex-col mt-4 gap-4">
        <div className="flex gap-4">
          <input
            type="number"
            value={montantDebit}
            onChange={(e) =>
              handlemontantDebitChange(
                e.target.value ? Number(e.target.value) : ''
              )
            }
            placeholder="Débit"
            className="input w-full border border-gray-300 rounded-md p-2"
          />
          <input
            type="number"
            value={montantCredit}
            onChange={(e) =>
              handlemontantCreditChange(
                e.target.value ? Number(e.target.value) : ''
              )
            }
            placeholder="Crédit"
            className="input w-full border border-gray-300 rounded-md p-2"
          />
        </div>
        <div>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setShowSuggestions(true);
            }}
            placeholder="Rechercher un compte"
            className="input w-full border border-gray-300 rounded-md p-2"
          />
          {showSuggestions && searchResults.length > 0 && (
            <ul className="absolute top-[7rem] left-0 right-0 z-10 bg-white border border-gray-300 rounded-md shadow-md max-h-60 overflow-y-auto">
              {searchResults.map((account) => (
                <li
                  key={account.id}
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                  onClick={() => handleSelectAccount(account)}
                >
                  {account.code} - {account.libelle}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
