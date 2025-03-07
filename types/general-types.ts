import BalanceGenerale from '../components/BalanceGenerale';
// in App/(dashboard)/page.tsx :
export type SearchParamsTypes = {
  q?: string;
  offset?: string | number;
  showForm?: string;
  companyId?: string;
};

export type BalanceGeneraleContent = {
  transactionId: number;
  accountCode: string;
  accountLibelle: string;
  soldeInitial: number;
  mouvementsDebit: number;
  mouvementsCredit: number;
  soldeFinal: number;
  journalId: number;
  journalName: string;
};

export type EcritureComptableContent = {
  transactionId: number;
  journalId: number;
  journalName: string;
  date: string;
  accountCode: string;
  debit: number;
  credit: number;
};

export type GrandLivreContent = {
  id: number;
  journalId: number;
  accountCode: string;
  accountLibelle: string;
  date: string;
  description: string;
  debit: number;
  credit: number;
};
