import { getSortedAccounts } from 'services/AccountService'; // Adjust path
import { Account } from 'types/accounts-type'; // Adjust path
import SortingControls from 'app/(dashboard)/general-components/SortingControls';

type Props = {
  searchParams: Promise<{ [key: string]: string | undefined }>;
};

export default async function AccountsPage({ searchParams }: Props) {
  const resolvedSearchParams = await searchParams;

  // Extract query parameters
  const searchQuery = resolvedSearchParams?.q?.toLowerCase() || '';
  const sortField =
    (resolvedSearchParams?.sortField as keyof Account) || 'code';
  const sortOrder = resolvedSearchParams?.sortOrder === 'desc' ? 'desc' : 'asc';

  // Fetch sorted accounts
  const sortedAccounts: Account[] = await getSortedAccounts(
    sortField,
    sortOrder
  );

  // Filter accounts by the search query
  const filteredAccounts = sortedAccounts.filter((account) =>
    account.libelle.toLowerCase().includes(searchQuery)
  );

  return (
    <div className="min-h-screen bg-muted/40 py-8 ">
      <div className="max-w-5xl mx-auto bg-white shadow-md rounded-lg p-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">
          Plan comptable
        </h1>

        {/* Client-side Sorting Controls */}
        <SortingControls
          initialSortField="code"
          initialSortOrder="asc"
          options={[
            { value: 'code', label: 'Code' },
            { value: 'libelle', label: 'Libellé' },
            { value: 'class', label: 'Class' }
          ]}
        />
        {/* Display Sorted and Filtered Accounts */}
        {filteredAccounts.length > 0 ? (
          <div className="overflow-x-auto mt-4">
            <table className="w-full table-auto border-collapse border border-gray-300 rounded-lg shadow-sm">
              <thead>
                <tr className="bg-gray-200 text-gray-700">
                  <th className="px-6 py-3 text-left text-sm font-semibold">
                    Code
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">
                    Libellé
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">
                    Class
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredAccounts.map((account, index) => (
                  <tr
                    key={account.id}
                    className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}
                  >
                    <td className="px-6 py-4 text-gray-800">{account.code}</td>
                    <td className="px-6 py-4 text-gray-800">
                      {account.libelle}
                    </td>
                    <td className="px-6 py-4 text-gray-800">{account.class}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-600">
            Aucun account trouvé pour "{searchQuery}".
          </p>
        )}
      </div>
    </div>
  );
}
