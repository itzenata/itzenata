'use client';

import { useRouter } from 'next/navigation';

type SortingField = {
  value: any;
  label: any;
};

type SortingControlsProps = {
  initialSortField: any;
  initialSortOrder: 'asc' | 'desc';
  options: SortingField[]; // Dynamic sorting options
};

const SortingControls: React.FC<SortingControlsProps> = ({
  initialSortField,
  initialSortOrder,
  options
}) => {
  const router = useRouter();

  const handleSortChange = (field: string, order: 'asc' | 'desc') => {
    const url = new URL(window.location.href);
    url.searchParams.set('sortField', field);
    url.searchParams.set('sortOrder', order);
    router.push(url.toString());
  };

  return (
    <div className="flex space-x-4">
      <label className="text-gray-700">
        Trier par :
        <select
          defaultValue={initialSortField}
          onChange={(e) => handleSortChange(e.target.value, initialSortOrder)}
          className="ml-2 px-2 py-1 border rounded-md"
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </label>
      <label className="text-gray-700">
        Ordre :
        <select
          defaultValue={initialSortOrder}
          onChange={(e) =>
            handleSortChange(initialSortField, e.target.value as 'asc' | 'desc')
          }
          className="ml-2 px-2 py-1 border rounded-md"
        >
          <option value="asc">Ascendant</option>
          <option value="desc">Descendant</option>
        </select>
      </label>
    </div>
  );
};

export default SortingControls;
