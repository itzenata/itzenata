'use client';

import { getCompanyById } from '@/lib/db/companies';
import { getJournalById } from '@/lib/db/journals';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

type BreadcrumbItem = {
  name: string;
  path: string;
  isInteractive: boolean;
};

const pathMap: { [key: string]: string } = {
  companies: 'Accueil'
};

export default function Breadcrumb() {
  const pathname = usePathname();
  const [breadcrumbs, setBreadcrumbs] = useState<BreadcrumbItem[] | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const generateBreadcrumbs = async () => {
      const defaultBreadcrumbs: BreadcrumbItem[] = [
        {
          name: 'Accueil',
          path: '/',
          isInteractive: pathname !== '/'
        }
      ];

      const pathSegments = pathname.split('/').filter(Boolean);
      let accumulatedPath = '';

      for (let i = 0; i < pathSegments.length; i++) {
        const segment = pathSegments[i];
        accumulatedPath += `/${segment}`;

        if (segment === 'companies' && pathSegments[i + 1]) {
          try {
            const companyId = parseInt(pathSegments[i + 1], 10);
            if (!isNaN(companyId)) {
              const company = await getCompanyById(companyId);
              defaultBreadcrumbs.push({
                name: company?.name || 'Company',
                path: `/companies/${companyId}/details`,
                isInteractive: pathSegments.length > 2 // Make clickable only if there are more segments (like journals)
              });
              i++; // Skip the company ID segment
            }
          } catch (error) {
            console.error('Error fetching company:', error);
          }
        } else if (segment === 'journals' && pathSegments[i + 1]) {
          try {
            const journalId = parseInt(pathSegments[i + 1], 10);
            const companyId = parseInt(pathSegments[1], 10); // Use the existing company ID from the path
            if (!isNaN(journalId)) {
              const journal = await getJournalById(journalId);
              defaultBreadcrumbs.push({
                name: journal?.name || 'Journal',
                path: `/companies/${companyId}/details/journals/${journalId}/transactions`,
                isInteractive: false // Journal breadcrumb is non-interactive
              });
            }
          } catch (error) {
            console.error('Error fetching journal:', error);
          }
        } else if (
          pathMap[segment] &&
          !defaultBreadcrumbs.some((b) => b.name === pathMap[segment])
        ) {
          defaultBreadcrumbs.push({
            name: pathMap[segment],
            path: accumulatedPath,
            isInteractive: true
          });
        }
      }

      setBreadcrumbs(defaultBreadcrumbs);
    };

    generateBreadcrumbs();
  }, [pathname]);

  if (!breadcrumbs || pathname === '/') {
    return null;
  }

  return (
    <nav aria-label="breadcrumb" className="py-3 px-4">
      <ol className="flex items-center text-sm text-gray-500">
        {breadcrumbs.map((breadcrumb, index) => (
          <li key={breadcrumb.path} className="flex items-center">
            {index > 0 && <span className="mx-2 text-gray-400">/</span>}
            {breadcrumb.isInteractive ? (
              <a
                href={breadcrumb.path}
                className="text-blue-600 hover:text-blue-800"
              >
                {breadcrumb.name}
              </a>
            ) : (
              <span className="text-gray-700 font-medium">
                {breadcrumb.name}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
