'use client';
import { useParams } from 'next/navigation'; // Use useParams to get dynamic route parameters
import JournalList from './components/JournalList'; // Adjust the import path as necessary

export default function JournalsPage() {
  const { companyId } = useParams(); // Extract companiesId directly from parameters

  // Handle loading state while companiesId is undefined
  if (!companyId) return <p>Loading...</p>;

  return (
    <div className="p-6 ">
      {/* Pass companiesId to JournalList */}
      <JournalList companyId={Number(companyId)} />
    </div>
  );
}
