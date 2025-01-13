'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

interface SortControlsProps {
  readonly currentOption: string;
}

export function SortControls({ currentOption }: SortControlsProps) {
  const searchParams = useSearchParams();
  const currentCountry = searchParams.get('country');

  const sorts = [
    { label: 'Latest', value: 'latest' },
    { label: 'Best', value: 'best' },
    { label: 'Worst', value: 'worst' },
  ];

  const getQueryParams = (sort: string) => {
    const params: Record<string, string> = { sort, page: '1' };
    if (currentCountry) {
      params.country = currentCountry;
    }
    return params;
  };

  return (
    <div className='flex gap-2'>
      {sorts.map(({ label, value }) => (
        <Link
          key={value}
          href={{ query: getQueryParams(value) }}
          className={`px-4 py-2 rounded-md border ${
            currentOption === value
              ? 'bg-blue-600 text-white border-blue-600'
              : 'border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800'
          } transition-colors`}
        >
          {label}
        </Link>
      ))}
    </div>
  );
}
