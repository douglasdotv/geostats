'use client';

import { useTransition } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Spinner } from '@/components/shared/Spinner';

export function RefreshTableButton() {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleRefresh = () => {
    const currentParams = new URLSearchParams(searchParams.toString());
    startTransition(() => {
      router.push(`?${currentParams.toString()}`);
    });
  };

  return (
    <div className='flex items-center gap-2'>
      <button
        onClick={handleRefresh}
        className='flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-md border border-gray-300 dark:border-gray-700 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors'
        aria-label='Refresh table data'
      >
        <span>Refresh</span>
        <svg
          xmlns='http://www.w3.org/2000/svg'
          className='w-4 h-4'
          fill='none'
          viewBox='0 0 24 24'
          stroke='currentColor'
        >
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth={2}
            d='M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15'
          />
        </svg>
      </button>
      {isPending && <Spinner />}
    </div>
  );
}
