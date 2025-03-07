import { GrandLivreContent } from 'types';
import { TVA_ACHATS, TVA_VENTES } from 'utils/Variables';

interface TVACalculation {
  type: 'Vente' | 'Achat' | 'Non soumis';
  tvaAccount?: string;
  tvaAmount: number;
}

const isTVAAccount = (accountCode: string): boolean => {
  return (
    TVA_ACHATS.some((account) => account.code === accountCode) ||
    TVA_VENTES.some((account) => account.code === accountCode)
  );
};

const determineTVADetails = (account: GrandLivreContent): TVACalculation => {
  if (!isTVAAccount(account.accountCode)) {
    return { type: 'Non soumis', tvaAmount: 0 }; // Not a TVA account
  }

  let type: 'Vente' | 'Achat' | 'Non soumis' = 'Non soumis';

  if (
    TVA_VENTES.some((tvaAccount) => tvaAccount.code === account.accountCode)
  ) {
    type = 'Vente';
  } else if (
    TVA_ACHATS.some((tvaAccount) => tvaAccount.code === account.accountCode)
  ) {
    type = 'Achat';
  }

  // Determine TVA amount directly from debit or credit
  const tvaAmount =
    type === 'Vente' ? account.credit : type === 'Achat' ? account.debit : 0;

  return { type, tvaAccount: account.accountCode, tvaAmount: tvaAmount };
};

export const calculateTVADetails = (transaction: GrandLivreContent) => {
  const { type, tvaAmount } = determineTVADetails(transaction);

  return {
    ...transaction,
    type,
    tvaAmount
  };
};

export const calculateTVASummary = (transactions: GrandLivreContent[]) => {
  const processedTransactions = transactions.map(calculateTVADetails);

  const tvaCollectee = processedTransactions
    .filter((detail) => detail.type === 'Vente')
    .reduce((sum, detail) => sum + detail.tvaAmount, 0);

  const tvaDeductible = processedTransactions
    .filter((detail) => detail.type === 'Achat')
    .reduce((sum, detail) => sum + detail.tvaAmount, 0);

  const tvaAPayer = tvaCollectee - tvaDeductible;

  return {
    tvaCollectee,
    tvaDeductible,
    tvaAPayer
  };
};
