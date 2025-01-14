'use client';

import { useTransition } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Spinner } from '@/components/shared/Spinner';

interface SortControlsProps {
  readonly currentOption: string;
}

export function SortControls({ currentOption }: SortControlsProps) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentCountry = searchParams.get('country');

  const sorts = [
    { label: 'Latest', value: 'latest' },
    { label: 'Best', value: 'best' },
    { label: 'Worst', value: 'worst' },
  ];

  const handleSort = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('sort', value);
    params.set('page', '1');
    if (currentCountry) {
      params.set('country', currentCountry);
    }
    startTransition(() => {
      router.push(`?${params.toString()}`);
    });
  };

  return (
    <div className='flex items-center gap-2'>
      {sorts.map(({ label, value }) => (
        <button
          key={value}
          onClick={() => handleSort(value)}
          className={`px-4 py-2 rounded-md border transition-colors ${
            currentOption === value
              ? 'bg-blue-600 text-white border-blue-600'
              : 'border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800'
          }`}
        >
          {label}
        </button>
      ))}
      {isPending && <Spinner />}
    </div>
  );
}
