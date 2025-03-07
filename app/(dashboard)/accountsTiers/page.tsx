// app/accountsTiers/page.tsx (Main Page)

import AccountTiers from './AccountTiers';
import AccountTiersForm from './AccountTiersForm';

export default function AccountTiersPage() {
  return (
    <div>
      <AccountTiersForm />
      <AccountTiers />
    </div>
  );
}
