import { notFound } from 'next/navigation';
import AddCompanyForm from 'app/(dashboard)/companies/[companyId]/components/company-form';
import { Company } from 'types/companies-types';
import { getCompanyById } from '@/lib/db/companies';

const CompanyDetail = async ({
  params
}: {
  params: Promise<{ companyId: string; isEditing?: string }>;
}) => {
  // Resolve params if they are a Promise
  const resolvedParams = await params;
  const { companyId, isEditing } = resolvedParams;

  // Parse and validate company ID
  const parsedCmpanyId = parseInt(companyId, 10);
  if (isNaN(parsedCmpanyId) || parsedCmpanyId <= 0) {
    return notFound();
  }

  // Fetch company details or initialize an empty company
  const company: Company | null = await getCompanyById(parsedCmpanyId);

  return (
    <div className="p-6 bg-white shadow-lg min-h-screen">
      {company ? (
        <AddCompanyForm isEditMode={true} initialData={company} />
      ) : (
        <AddCompanyForm isEditMode={false} />
      )}
    </div>
  );
};

export default CompanyDetail;
