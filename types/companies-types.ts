import { z } from 'zod';

// selected option type
type legalFroms = 'SARL' | 'SA' | 'SNC' | 'SCS' | 'Autres';
type status = 'active' | 'inactive';
type declarationRegimes = 'Trimistiel' | 'Monsieul';
type paymentModes = 'Encaissement' | 'Debut';
type debutEncaissements = 'immediate' | 'deferred';

//interface Company :
export interface Company {
  id: number;
  name: string;
  imageUrl: string;
  capital: number;
  employees: number;
  foundedOn?: string | null;
  status: status;
  activity: string;
  legalForm: legalFroms;
  address?: string;
  additionalInfo?: string;
  phone?: string;
  email?: string;
  website?: string;
  vatIdentifier?: string;
  cnss?: number;
  declarationRegime?: string;
  paymentMode?: string | null;
  debutEncaissement?: string | null;
  createdAt?: Date | null;
  updatedAt?: Date | null;
  ifId?: number | null;
  ice?: number | null;
  rc?: number | null;
}

//interface UpdateCompanyArgs
export interface UpdateCompanyArgs {
  companyId: number;
  name: string;
  imageUrl: string;
  capital: number;
  employees: number;
  foundedOn: string;
  status: status;
  activity: string;
  legalForm: legalFroms;
  address: string;
  additionalInfo: string;
  phone: string;
  email: string;
  website: string;
  vatIdentifier: string;
  cnss: number;
  declarationRegime: declarationRegimes;
  paymentMode: paymentModes;
  debutEncaissement: debutEncaissements;
}

// in db.ts the shema types :

const StatusEnum = z.enum(['active', 'inactive']);

const MyLegalFormEnum = z.enum(['SARL', 'SA', 'SNC', 'SCS', 'Autres']);

export const companyInsertSchema = z.object({
  id: z.number().optional(),
  name: z.string(),
  imageUrl: z.string().url(),
  capital: z.number(),
  employees: z.number(),
  foundedOn: z.string().optional(),
  status: StatusEnum,
  activity: z.string().optional(),
  legalForm: MyLegalFormEnum,
  address: z.string(),
  additionalInfo: z.string().optional(),
  phone: z.string(),
  email: z.string().email(),
  website: z.string().url().optional(),
  vatIdentifier: z.string(),
  cnss: z.number().optional(),
  declarationRegime: z.string().optional(),
  paymentMode: z.string().optional(),
  debutEncaissement: z.string().optional(),
  ifId: z.number().optional(),
  ice: z.number().optional(),
  rc: z.number().optional()
});
