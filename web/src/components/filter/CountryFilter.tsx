'use client';

import { useRouter, useSearchParams } from 'next/navigation';

interface CountryFilterProps {
  readonly countries: string[];
  readonly currentCountry: string | null;
}

export function CountryFilter({
  countries,
  currentCountry,
}: CountryFilterProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const params = new URLSearchParams(searchParams.toString());
    const country = event.target.value;

    if (country === '') {
      params.delete('country');
    } else {
      params.set('country', country);
    }

    params.set('page', '1');
    router.push(`?${params.toString()}`);
  };

  return (
    <select
      value={currentCountry ?? ''}
      onChange={handleChange}
      className='px-4 py-2 rounded-md border border-gray-300 dark:border-gray-700 bg-transparent hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors'
    >
      <option value=''>All Countries</option>
      {countries.map((country) => (
        <option key={country} value={country}>
          {country}
        </option>
      ))}
    </select>
  );
}
