// app/companies/[id]/edit/page.tsx
import { getCompanyById } from '@/lib/db/companies';
import CompanyForm from '../company-form';

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function EditCompanyPage({ params }: PageProps) {
  const resolvedParams = await params; // Await the promise to resolve `params`
  const company = await getCompanyById(parseInt(resolvedParams.id, 10)); // Use the resolved id

  if (!company) {
    return <div>Company not found</div>;
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Edit Company</h1>
      <CompanyForm isEditMode={true} initialData={company} />
    </div>
  );
}
