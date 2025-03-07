interface AccountMapping {
  tvaCode: string | null;
  fournisseurCode?: string;
  clientCode?: string;
  description: string;
}

// ALL ACCOUNTS LINKED TO TVA (TVA récupérable) - Class 6
export const CLASS_6 = [
  { code: '60', label: 'Achats de marchandises' },
  { code: '61', label: 'Charges d`exploitation' },
  { code: '611', label: 'Achats revendus de marchandises' },
  { code: '612', label: 'Achats consommés de matières et fournitures' },
  { code: '613', label: 'Autres charges externes' },
  { code: '614', label: 'Autres charges externes' },
  { code: '616', label: 'Impôts et taxes' },
  { code: '617', label: 'Charges de personnel' },
  { code: '62', label: 'Autres charges externes' },
  {
    code: '621',
    label: 'Transports de biens et transports collectifs du personnel'
  },
  { code: '622', label: 'Déplacements, missions et réceptions' },
  { code: '623', label: 'Frais postaux et de télécommunications' }
];

// ALL ACCOUNTS LINKED TO TVA (TVA collectée) - Class 7
export const CLASS_7 = [
  { code: '70', label: 'Ventes de marchandises' },
  { code: '71', label: 'Prestations de services' },
  { code: '72', label: 'Travaux et services vendus' },
  { code: '74', label: 'Produits des activités annexes' },
  { code: '741', label: 'Locations diverses' },
  { code: '742', label: 'Redevances pour brevets, licences et marques' }
];

export const COMMERCIAL_SECTOR = [
  { label: 'Wholesale and semi-wholesale trade' },
  { label: 'Retail trade (stores, supermarkets, bazaars)' },
  { label: 'E-commerce and online sales' },
  { label: 'Import-export' },
  { label: 'Sale of professional equipment and supplies' },
  { label: 'Vehicle and spare parts sales' },
  { label: 'Sale of household appliances and high-tech products' }
];

export const INDUSTRIAL_SECTOR = [
  { label: 'Agro-food industry' },
  { label: 'Textile and garment industry' },
  { label: 'Pharmaceutical industry' },
  { label: 'Automotive and aerospace industry' },
  {
    label: 'Manufacturing and processing of materials (plastics, glass, metal)'
  },
  { label: 'Renewable energy production' },
  { label: 'Printing and packaging production' }
];

export const CONSTRUCTION_AND_REAL_ESTATE = [
  { label: 'Building construction' },
  { label: 'Public works and infrastructure' },
  { label: 'Real estate development' },
  { label: 'Architecture and urban planning' },
  { label: 'Property management and leasing' },
  { label: 'Engineering and technical studies' }
];

export const SERVICE_PROVIDERS = [
  { label: 'Consulting and auditing firms' },
  { label: 'Communication and marketing agencies' },
  { label: 'Real estate agencies' },
  { label: 'Cleaning and maintenance services' },
  { label: 'Private security' },
  { label: 'Guarding and surveillance' }
];

export const FREELANCE_AND_INTELLECTUAL_PROFESSIONS = [
  { label: 'Private medical practices and clinics' },
  { label: 'Dentists and medical laboratories' },
  { label: 'Lawyers and law firms' },
  { label: 'Notaries' },
  { label: 'Certified public accountants' },
  { label: 'Architects and engineers' },
  { label: 'Translators and interpreters' },
  { label: 'Independent educators and trainers' }
];

export const TRANSPORT_AND_LOGISTICS = [
  { label: 'Freight transport' },
  { label: 'Passenger transport (taxis, VTC, buses)' },
  { label: 'Customs and transit' },
  { label: 'Warehousing and logistics' },
  { label: 'Vehicle rental (with or without driver)' },
  { label: 'Express transport and home delivery' }
];

export const TOURISM_AND_HOSPITALITY = [
  { label: 'Hotels and guesthouses' },
  { label: 'Restaurants and cafes' },
  { label: 'Travel agencies and tour guides' },
  { label: 'Car rentals for tourists' }
];

export const FINANCIAL_SECTOR = [
  { label: 'Banks' },
  { label: 'Insurance companies' },
  { label: 'Microfinance institutions' },
  { label: 'Currency exchange offices' },
  { label: 'Leasing and credit companies' },
  { label: 'Fintech and electronic payment services' }
];

export const EDUCATION_AND_TRAINING = [
  { label: 'Private schools' },
  { label: 'Universities and institutes' },
  { label: 'Vocational training centers' },
  { label: 'Private tutoring and coaching' },
  { label: 'E-learning and online training platforms' }
];

export const ARTS_AND_CRAFTS = [
  { label: 'Carpentry and woodworking' },
  { label: 'Metalworking and blacksmithing' },
  { label: 'Sewing and textile' },
  { label: 'Jewelry and goldsmithing' },
  { label: 'Upholstery and interior decoration' }
];

export const AGRICULTURE_AND_FISHING = [
  { label: 'Agricultural farms' },
  { label: 'Agricultural cooperatives' },
  { label: 'Fishing and aquaculture' },
  { label: 'Livestock farming and dairy production' }
];

export const TECHNOLOGY_AND_DIGITAL = [
  { label: 'Web and mobile development' },
  { label: 'Cybersecurity agencies' },
  { label: 'Cloud computing and hosting services' },
  { label: 'Tech startups' },
  { label: 'Software and SaaS development' }
];

export const CONTENT_CREATION_AND_WEB_ACTIVITIES = [
  { label: 'YouTubers / Streamers / Video content creators' },
  { label: 'Podcasters' },
  { label: 'Influencers and affiliate marketing' },
  { label: 'Web writing and copywriting' },
  { label: 'Community management and social media management' },
  { label: 'Audiovisual production (video, motion design, editing)' },
  { label: 'Professional photography' },
  { label: 'Selling online courses and training' },
  { label: 'Selling templates, presets, and digital assets' }
];

export const HEALTH_AND_WELLNESS = [
  { label: 'Pharmacies and parapharmacies' },
  { label: 'Medical laboratories' },
  { label: 'Clinics and healthcare centers' },
  { label: 'Physiotherapists and osteopaths' },
  { label: 'Wellness centers and spas' }
];

export const TVA_ACHATS = [
  { code: '3455', label: 'Etat - TVA récupérable' },
  { code: '34551', label: 'Etat - TVA récupérable sur Immobilisations' },
  { code: '34552', label: 'Etat - TVA récupérable sur charges' },
  { code: '34553', label: 'Etat - TVA récupérable sur achats de services' },
  { code: '34558', label: 'Etat - Autres TVA récupérables' },
  { code: '3456', label: 'Etat - Crédit de TVA (suivant déclarations)' }
];

export const TVA_VENTES = [
  { code: '4455', label: 'Etat - TVA facturée' },
  { code: '44551', label: 'Etat - TVA collectée sur ventes' },
  { code: '44552', label: 'Etat - TVA due intracommunautaire' },
  { code: '44556', label: 'Etat - TVA due sur prestations de services' },
  { code: '44557', label: 'Etat - TVA due sur importations' },
  { code: '44558', label: 'Etat - Autres TVA dues' },
  { code: '4456', label: 'Etat - TVA due (suivant déclarations)' },
  { code: '4457', label: 'Etat - TVA à décaisser' },
  { code: '4458', label: 'Etat - TVA sur opérations diverses' },
  { code: '44571', label: 'Etat - TVA sur importations' },
  { code: '44572', label: 'Etat - TVA autoliquidée' },
  { code: '44573', label: 'Etat - TVA sur opérations exonérées' }
];

export const FOURNISSEUR = [
  { code: '1486', label: 'Fournisseurs d`immobilisations' },
  { code: '341', label: 'Fournisseurs débiteur, avances et acomptes' },
  {
    code: '3411',
    label:
      'Fournisseurs - avances et acomptes versés sur commandes d`exploitation'
  },
  {
    code: '3413',
    label: 'Fournisseurs - créances pour emballages et matériels à rendre'
  },
  { code: '3418', label: 'Autres fournisseurs débiteurs' },
  {
    code: '3491',
    label:
      'Provisions pour dépréciation - fournisseurs débiteurs, avances et acomptes'
  },
  { code: '441', label: 'Fournisseurs et comptes rattachés' },
  { code: '4011', label: 'Fournisseurs' },
  { code: '40111', label: 'Fournisseurs - catégorie A' },
  { code: '40112', label: 'Fournisseurs - catégorie B' },
  { code: '40113', label: 'Fournisseurs - retenues de garantie' },
  { code: '4415', label: 'Fournisseurs - effets à payer' },
  { code: '4417', label: 'Fournisseurs - factures non parvenues' },
  { code: '4418', label: 'Autres fournisseurs et comptes rattachés' }
];
export const CLIENTS = [
  { code: '3421', label: 'Clients' },
  { code: '34211', label: 'Clients (Groupe A)' },
  { code: '34212', label: 'Clients (Groupe B)' },
  { code: '3423', label: 'Clients - retenues de garanties' }
];

export const ACCOUNT_MAPPINGS_FOURNISSEUR: { [key: string]: AccountMapping } = {
  '60': {
    tvaCode: '34552',
    fournisseurCode: '4411',
    description: 'Achats de marchandises'
  },
  '611': {
    tvaCode: '34552',
    fournisseurCode: '4411',
    description: 'Achats revendus de marchandises'
  },
  '612': {
    tvaCode: '34552',
    fournisseurCode: '4411',
    description: 'Achats consommés de matières et fournitures'
  },
  '613': {
    tvaCode: '34553',
    fournisseurCode: '4411',
    description: 'Autres charges externes'
  },
  '614': {
    tvaCode: '34553',
    fournisseurCode: '4411',
    description: 'Autres charges externes'
  },
  '616': {
    tvaCode: '3455',
    fournisseurCode: '4411',
    description: 'Impôts et taxes'
  },
  '617': {
    tvaCode: null,
    fournisseurCode: '4411',
    description: 'Charges de personnel'
  },
  '621': {
    tvaCode: '34553',
    fournisseurCode: '4411',
    description: 'Transports de biens et transports collectifs du personnel'
  },
  '622': {
    tvaCode: '34553',
    fournisseurCode: '4411',
    description: 'Déplacements, missions et réceptions'
  },
  '623': {
    tvaCode: '34553',
    fournisseurCode: '4411',
    description: 'Frais postaux et de télécommunications'
  }
};
export const ACCOUNT_MAPPINGS_CLIENT: { [key: string]: AccountMapping } = {
  '70': {
    tvaCode: '44551',
    clientCode: '3421',
    description: 'Vente de marchandises avec TVA'
  },
  '71': {
    tvaCode: '44556',
    clientCode: '3421',
    description: 'Facturation de services avec TVA'
  },
  '72': {
    tvaCode: '44551',
    clientCode: '3421',
    description: 'Travaux et services facturés avec TVA'
  },
  '74': {
    tvaCode: '44558',
    clientCode: '3421',
    description: 'Autres produits facturés avec TVA'
  },
  '741': {
    tvaCode: '44558',
    clientCode: '3421',
    description: 'Revenus de location avec TVA'
  },
  '742': {
    tvaCode: '44558',
    clientCode: '3421',
    description: 'Revenus de redevances avec TVA'
  }
};
