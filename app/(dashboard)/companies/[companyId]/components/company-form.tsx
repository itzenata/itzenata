// components/addCompany.tsx
import { Button } from '@/components/ui/button';
import { handleAddCompany, handleEditCompany } from 'services/CompanyService';
import { Company } from 'types/companies-types';
import {
  AGRICULTURE_AND_FISHING,
  ARTS_AND_CRAFTS,
  COMMERCIAL_SECTOR,
  CONSTRUCTION_AND_REAL_ESTATE,
  CONTENT_CREATION_AND_WEB_ACTIVITIES,
  EDUCATION_AND_TRAINING,
  FINANCIAL_SECTOR,
  FREELANCE_AND_INTELLECTUAL_PROFESSIONS,
  HEALTH_AND_WELLNESS,
  INDUSTRIAL_SECTOR,
  SERVICE_PROVIDERS,
  TECHNOLOGY_AND_DIGITAL,
  TOURISM_AND_HOSPITALITY,
  TRANSPORT_AND_LOGISTICS
} from 'utils/Variables';

interface CompanyFormProps {
  isEditMode?: boolean;
  initialData?: Company;
}

export default function CompanyForm({
  isEditMode = false,
  initialData = {
    id: 123,
    name: 'Nom de l’entreprise (ex: ITZENATA)',
    imageUrl: 'https://logo.clearbit.com/tesla.com',
    capital: 100000,
    employees: 50,
    foundedOn: '',
    status: 'active',
    activity: 'Activité principale (ex: Développement logiciel)',
    legalForm: 'SARL',
    ifId: 1678,
    ice: 123,
    rc: 125,
    address: 'Adresse complète (ex: 12 Rue de Casablanca, Maroc)',
    additionalInfo: 'Complément d’adresse si nécessaire',
    phone: '+212600000000',
    email: 'contact@exemple.com',
    website: 'https://www.exemple.com',
    vatIdentifier: '1234567890'
  }
}: CompanyFormProps) {
  return (
    <div className="bg-gray-100 p-4">
      <form
        action={isEditMode ? handleEditCompany : handleAddCompany}
        className="w-full p-6 border rounded-md bg-white shadow-lg"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <label className="block">
            Raison Sociale
            <input
              type="text"
              name="name"
              defaultValue={initialData?.name}
              required
              className="input mt-1 w-full border border-gray-300 rounded-md p-2"
            />
          </label>
          <label className="block">
            URL de l'image
            <input
              type="url"
              name="imageUrl"
              defaultValue={initialData?.imageUrl}
              className="input mt-1 w-full border border-gray-300 rounded-md p-2"
            />
          </label>
          <label className="block">
            Capital
            <input
              type="number"
              name="capital"
              defaultValue={initialData?.capital}
              required
              className="input mt-1 w-full border border-gray-300 rounded-md p-2"
            />
          </label>
          <label className="block">
            Employés
            <input
              type="number"
              name="employees"
              defaultValue={initialData?.employees}
              required
              className="input mt-1 w-full border border-gray-300 rounded-md p-2"
            />
          </label>
          <label className="block">
            Date de creation
            <input
              type="date"
              name="foundedOn"
              defaultValue={
                initialData?.foundedOn
                  ? initialData.foundedOn.toString().split('T')[0]
                  : new Date().toISOString().split('T')[0]
              }
              className="input mt-1 w-full border border-gray-300 rounded-md p-2"
              lang="fr"
            />
          </label>
          <label className="block">
            Statut
            <select
              name="status"
              defaultValue={initialData?.status}
              className="input mt-1 w-full border border-gray-300 rounded-md p-2"
            >
              <option value="active">Actif</option>
              <option value="inactive">Inactif</option>
            </select>
          </label>

          {/* New fields */}
          <label className="block">
            Activité
            <select
              name="activity"
              defaultValue={initialData?.activity}
              className="input mt-1 w-full border border-gray-300 rounded-md p-2"
            >
              {[
                ...COMMERCIAL_SECTOR.map((item) => item.label),
                ...INDUSTRIAL_SECTOR.map((item) => item.label),
                ...CONSTRUCTION_AND_REAL_ESTATE.map((item) => item.label),
                ...SERVICE_PROVIDERS.map((item) => item.label),
                ...FREELANCE_AND_INTELLECTUAL_PROFESSIONS.map(
                  (item) => item.label
                ),
                ...TRANSPORT_AND_LOGISTICS.map((item) => item.label),
                ...TOURISM_AND_HOSPITALITY.map((item) => item.label),
                ...FINANCIAL_SECTOR.map((item) => item.label),
                ...EDUCATION_AND_TRAINING.map((item) => item.label),
                ...ARTS_AND_CRAFTS.map((item) => item.label),
                ...AGRICULTURE_AND_FISHING.map((item) => item.label),
                ...TECHNOLOGY_AND_DIGITAL.map((item) => item.label),
                ...CONTENT_CREATION_AND_WEB_ACTIVITIES.map(
                  (item) => item.label
                ),
                ...HEALTH_AND_WELLNESS.map((item) => item.label)
              ].map((label) => (
                <option key={label} value={label}>
                  {label}
                </option>
              ))}
            </select>
          </label>

          <label className="block">
            Forme Juridique
            <select
              name="legalForm"
              defaultValue={initialData?.legalForm}
              className="input mt-1 w-full border border-gray-300 rounded-md p-2"
            >
              <option value="SARL">SARL</option>
              <option value="SA">SA</option>
              <option value="SNC">SNC</option>
              <option value="SCS">SCS</option>
              <option value="Autres">Autres</option>
            </select>
          </label>
          <label className="block">
            IF
            <input
              type="number"
              name="if"
              defaultValue={
                initialData?.ifId !== null && initialData?.ifId !== undefined
                  ? initialData.ifId.toString()
                  : undefined
              }
              className="input mt-1 w-full border border-gray-300 rounded-md p-2"
            />
          </label>

          {/* New ICE field */}
          <label className="block">
            ICE
            <input
              type="number"
              name="ice"
              defaultValue={initialData?.ice ?? undefined}
              className="input mt-1 w-full border border-gray-300 rounded-md p-2"
            />
          </label>

          {/* New RC field */}
          <label className="block">
            RC
            <input
              type="number"
              name="rc"
              defaultValue={initialData?.rc ?? undefined}
              className="input mt-1 w-full border border-gray-300 rounded-md p-2"
            />
          </label>
          <label className="block">
            Adresse
            <input
              type="text"
              name="address"
              defaultValue={initialData?.address}
              className="input mt-1 w-full border border-gray-300 rounded-md p-2"
            />
          </label>
          <label className="block">
            Complément d'adresse
            <input
              type="text"
              name="addressComplement"
              defaultValue={initialData?.address}
              className="input mt-1 w-full border border-gray-300 rounded-md p-2"
            />
          </label>
          <label className="block">
            Téléphone
            <input
              type="tel"
              name="phone"
              defaultValue={initialData?.phone}
              className="input mt-1 w-full border border-gray-300 rounded-md p-2"
            />
          </label>
          <label className="block">
            Email
            <input
              type="email"
              name="email"
              defaultValue={initialData?.email}
              className="input mt-1 w-full border border-gray-300 rounded-md p-2"
            />
          </label>
          <label className="block">
            Site Internet
            <input
              type="url"
              name="website"
              defaultValue={initialData?.website}
              className="input mt-1 w-full border border-gray-300 rounded-md p-2"
            />
          </label>
          <label className="block">
            TVA
            <input
              type="text"
              name="vatId"
              defaultValue={initialData?.vatIdentifier}
              className="input mt-1 w-full border border-gray-300 rounded-md p-2"
            />
          </label>
        </div>
        {isEditMode && (
          <input type="hidden" name="id" value={initialData?.id || ''} />
        )}

        <Button type="submit" className="mt-8 w-full sm:w-auto">
          {isEditMode ? 'Mettre à Jour' : 'Ajouter'}
        </Button>
      </form>
    </div>
  );
}
