'use client';

import { useTransition } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Spinner } from '@/components/shared/Spinner';

interface PaginationControlsProps {
  readonly currentPage: number;
  readonly totalPages: number;
  readonly currentSort: string;
  readonly currentCountry: string | null;
}

export function PaginationControls({
  currentPage,
  totalPages,
  currentSort,
  currentCountry,
}: PaginationControlsProps) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const searchParams = useSearchParams();

  const getQueryParams = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', page.toString());
    params.set('sort', currentSort);
    if (currentCountry) {
      params.set('country', currentCountry);
    }
    return params;
  };

  const goToPage = (page: number) => {
    startTransition(() => {
      router.push(`?${getQueryParams(page).toString()}`);
    });
  };

  const renderPageButtons = () => {
    const buttons = [];
    const showEllipsis = totalPages > 7;
    const pageWindow = 2;

    for (let i = 1; i <= totalPages; i++) {
      if (
        i === 1 ||
        i === totalPages ||
        (i >= currentPage - pageWindow && i <= currentPage + pageWindow)
      ) {
        buttons.push(
          <button
            key={i}
            onClick={() => goToPage(i)}
            className={`px-3 py-1 mx-1 rounded-md ${
              currentPage === i
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700'
            }`}
            aria-current={currentPage === i ? 'page' : undefined}
          >
            {i}
          </button>,
        );
      } else if (
        showEllipsis &&
        (i === currentPage - pageWindow - 1 ||
          i === currentPage + pageWindow + 1)
      ) {
        buttons.push(
          <span key={i} className='px-3 py-1'>
            ...
          </span>,
        );
      }
    }
    return buttons;
  };

  return (
    <div className='flex justify-center items-center space-x-2 my-6'>
      <button
        onClick={() => goToPage(currentPage - 1)}
        disabled={currentPage === 1}
        className={`px-3 py-1 rounded-md bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 ${
          currentPage === 1 ? 'opacity-50' : ''
        }`}
        aria-disabled={currentPage === 1}
      >
        Previous
      </button>
      {renderPageButtons()}
      <button
        onClick={() => goToPage(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={`px-3 py-1 rounded-md bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 ${
          currentPage === totalPages ? 'opacity-50' : ''
        }`}
        aria-disabled={currentPage === totalPages}
      >
        Next
      </button>
      {isPending && <Spinner />}
    </div>
  );
}
