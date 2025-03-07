'use client';

import React, { useState } from 'react';
import {
  Info as InfoIcon,
  FileText as JournauxIcon,
  BarChart2 as GraphesIcon,
  Scale as BalanceIcon,
  BookText as GrandLivreIcon,
  PenLine as EcritureIcon
} from 'lucide-react';
import { Company } from 'types/companies-types';

import FinancialDashboard from './FinancialDashboard';
import Journal from './journals/page';
import BalanceGenerale from '@/components/BalanceGenerale';
import GrandLivre from '@/components/GrandLivre';
import EcritureComptable from '@/components/EcritureComptable';
import Tva from '@/components/Tva';

const TabButton = ({
  onClick,
  isActive,
  icon: Icon,
  label
}: {
  onClick: () => void;
  isActive: boolean;
  icon: React.ElementType;
  label: string;
}) => (
  <button
    onClick={onClick}
    className={`
      flex items-center justify-center gap-3 px-6 py-3 rounded-lg transition-all duration-300
      text-sm font-semibold uppercase tracking-wider shadow-md
      ${
        isActive
          ? 'bg-gray-800 text-white'
          : 'bg-gray-200 text-gray-800 hover:bg-gray-300 hover:text-gray-800'
      }
    `}
  >
    <Icon size={20} className="stroke-[2]" />
    <span>{label}</span>
  </button>
);

const AccountingTabs = ({ company }: { company: Company }) => {
  const [activeTab, setActiveTab] = useState('infos');

  const renderTabContent = () => {
    switch (activeTab) {
      case 'infos':
        return (
          <div className="p-8 bg-gray rounded-b-lg shadow-md mt-4 rounded-lg border border-gray ">
            <h2 className="text-2xl font-bold mb-6 text-gray-800 border-b pb-3">
              Informations de l'Entreprise
            </h2>
            <div className="grid grid-cols-2 gap-6">
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="font-semibold text-gray-600 mb-2">Nom:</p>
                <p className="text-gray-900">{company.name}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="font-semibold text-gray-600 mb-2">Statut:</p>
                <p className="text-gray-900">{company.status}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="font-semibold text-gray-600 mb-2">Capital:</p>
                <p className="text-gray-900">{company.capital}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="font-semibold text-gray-600 mb-2">
                  Nombre d'employés:
                </p>
                <p className="text-gray-900">{company.employees}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="font-semibold text-gray-600 mb-2">Activité:</p>
                <p className="text-gray-900">{company.activity}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="font-semibold text-gray-600 mb-2">
                  Forme juridique:
                </p>
                <p className="text-gray-900">{company.legalForm}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="font-semibold text-gray-600 mb-2">Adresse:</p>
                <p className="text-gray-900">{company.address}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="font-semibold text-gray-600 mb-2">
                  Informations supplémentaires:
                </p>
                <p className="text-gray-900">{company.additionalInfo}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="font-semibold text-gray-600 mb-2">Téléphone:</p>
                <p className="text-gray-900">{company.phone}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="font-semibold text-gray-600 mb-2">Email:</p>
                <p className="text-gray-900">{company.email}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="font-semibold text-gray-600 mb-2">Site web:</p>
                <p className="text-gray-900">{company.website}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="font-semibold text-gray-600 mb-2">
                  Numéro de TVA:
                </p>
                <p className="text-gray-900">{company.vatIdentifier}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="font-semibold text-gray-600 mb-2">Numéro IF:</p>
                <p className="text-gray-900">{company.ifId}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="font-semibold text-gray-600 mb-2">Numéro ICE:</p>
                <p className="text-gray-900">{company.ice}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="font-semibold text-gray-600 mb-2">Numéro RC:</p>
                <p className="text-gray-900">{company.rc}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="font-semibold text-gray-600 mb-2">Numéro CNSS:</p>
                <p className="text-gray-900">{company.cnss}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="font-semibold text-gray-600 mb-2">
                  Régime de déclaration:
                </p>
                <p className="text-gray-900">{company.declarationRegime}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="font-semibold text-gray-600 mb-2">
                  Mode de paiement:
                </p>
                <p className="text-gray-900">{company.paymentMode}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="font-semibold text-gray-600 mb-2">
                  Début d'encaissement:
                </p>
                <p className="text-gray-900">{company.debutEncaissement}</p>
              </div>
            </div>
          </div>
        );

      case 'journaux':
        return (
          <div className="p-8 bg-white rounded-b-lg shadow-md mt-4 rounded-lg border border-gray">
            <Journal />
          </div>
        );

      case 'graphes':
        return (
          <div className="p-8 bg-white rounded-b-lg shadow-md mt-4 rounded-lg border border-gray">
            <FinancialDashboard />
          </div>
        );
      case 'BalanceGenerale':
        return (
          <div>
            <BalanceGenerale companyId={company.id} />
          </div>
        );
      case 'GrandLivre':
        return (
          <div>
            <GrandLivre companyId={company.id} />
          </div>
        );
      case 'EcritureComptable':
        return (
          <div>
            <EcritureComptable companyId={company.id} />
          </div>
        );

      case 'Tva':
        return (
          <div>
            <Tva companyId={company.id} />
          </div>
        );
    }
  };

  return (
    <div className="container mx-auto">
      <div className="flex justify-center space-x-8 mb-6">
        <TabButton
          onClick={() => setActiveTab('infos')}
          isActive={activeTab === 'infos'}
          icon={InfoIcon}
          label="Informations"
        />
        <TabButton
          onClick={() => setActiveTab('journaux')}
          isActive={activeTab === 'journaux'}
          icon={JournauxIcon}
          label="Journaux"
        />
        <TabButton
          onClick={() => setActiveTab('graphes')}
          isActive={activeTab === 'graphes'}
          icon={GraphesIcon}
          label="Statistiques"
        />
        <TabButton
          onClick={() => setActiveTab('BalanceGenerale')}
          isActive={activeTab === 'BalanceGenerale'}
          icon={BalanceIcon}
          label="Balance Générale"
        />
      </div>
      <div className="flex justify-center space-x-8 mb-6">
        <TabButton
          onClick={() => setActiveTab('GrandLivre')}
          isActive={activeTab === 'GrandLivre'}
          icon={GrandLivreIcon}
          label="Grand Livre"
        />
        <TabButton
          onClick={() => setActiveTab('EcritureComptable')}
          isActive={activeTab === 'EcritureComptable'}
          icon={EcritureIcon}
          label="Ecriture Comptable"
        />

        <TabButton
          onClick={() => setActiveTab('Tva')}
          isActive={activeTab === 'Tva'}
          icon={BalanceIcon}
          label="TVA"
        />
      </div>

      <div className="transition-all duration-300">{renderTabContent()}</div>
    </div>
  );
};

export default AccountingTabs;
