import Link from 'next/link';

interface PaginationControlsProps {
  readonly currentPage: number;
  readonly totalPages: number;
}

export function PaginationControls({
  currentPage,
  totalPages,
}: PaginationControlsProps) {
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
          <Link
            key={i}
            href={{ query: { page: i } }}
            className={`px-3 py-1 mx-1 rounded-md ${
              currentPage === i
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700'
            }`}
            aria-current={currentPage === i ? 'page' : undefined}
          >
            {i}
          </Link>,
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
      <Link
        href={{ query: { page: currentPage - 1 } }}
        className={`px-3 py-1 rounded-md bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 ${
          currentPage === 1 ? 'pointer-events-none opacity-50' : ''
        }`}
        aria-disabled={currentPage === 1}
      >
        Previous
      </Link>
      {renderPageButtons()}
      <Link
        href={{ query: { page: currentPage + 1 } }}
        className={`px-3 py-1 rounded-md bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 ${
          currentPage === totalPages ? 'pointer-events-none opacity-50' : ''
        }`}
        aria-disabled={currentPage === totalPages}
      >
        Next
      </Link>
    </div>
  );
}