import { getCompanyById } from '@/lib/db/companies';
import AccountingTabs from './AccountingTabs';

interface AccountingDetailsPageProps {
  params: Promise<{ companyId: number }>;
}

export default async function AccountingDetailsPage({
  params
}: AccountingDetailsPageProps) {
  const resolvedParams = await params;
  const parsedCompanyId = Number(resolvedParams.companyId);

  if (isNaN(parsedCompanyId)) {
    return <div>ID d'entreprise invalide</div>;
  }

  const company = await getCompanyById(parsedCompanyId);

  if (!company) {
    return <div>Entreprise introuvable</div>;
  }

  return (
    <div className="p-6 bg-white-50 min-h-screen">
      <AccountingTabs company={company} />
    </div>
  );
}
