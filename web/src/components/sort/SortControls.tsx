import Link from 'next/link';

interface SortControlsProps {
  readonly currentOption: string;
}

export function SortControls({ currentOption }: SortControlsProps) {
  const options = [
    { label: 'Latest', value: 'latest' },
    { label: 'Best', value: 'best' },
    { label: 'Worst', value: 'worst' },
  ];

  return (
    <div className='mb-6 flex gap-2'>
      {options.map(({ label, value }) => (
        <Link
          key={value}
          href={{ query: { sort: value, page: 1 } }}
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
