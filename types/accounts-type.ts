export type Account = {
  id: number;
  code: string;
  libelle: string;
  class: string;
};

export type TransactionAccount = {
  id: number;
  code: string;
  libelle: string;
  montantDebit: number;
  montantCredit: number;
  customLibelleAccount?: string;
};

export type TransactionWithAccount = {
  id: number;
  companyId: number;
  journalId: number;
  montantDebit: number;
  montantCredit: number;
  libelle: string;
  transactionDate: string | null;
  accounts: TransactionAccount[];
};
