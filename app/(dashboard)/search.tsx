import { Suspense } from 'react';
import { SearchInput } from './search-input';

export default function Page() {
  return (
    <div>
      <h1>Search Page</h1>
      <Suspense fallback={<div>Loading search...</div>}>
        <SearchInput />
      </Suspense>
    </div>
  );
}
