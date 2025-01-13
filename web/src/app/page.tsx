import { supabase } from '@/lib/supabaseClient';
import { GuessesTable } from '@/components/guesses/GuessesTable';
import { PaginationControls } from '@/components/pagination/PaginationControls';
import { SortControls } from '@/components/sort/SortControls';
import { CountryFilter } from '@/components/filter/CountryFilter';
import { CountryStatsButton } from '@/components/stats/CountryStatsButton';
import { getCountryStats } from '@/app/actions';
import { ITEMS_PER_PAGE } from '@/lib/constants';

type SearchParamsContent = {
  page?: string;
  sort?: 'latest' | 'best' | 'worst';
  country?: string;
};

type SearchParams = Promise<SearchParamsContent>;

interface PageProps {
  readonly searchParams: SearchParams;
}

export default async function Home({ searchParams }: PageProps) {
  const sp = await searchParams;
  const page = Number(sp.page) || 1;
  const sort = sp.sort ?? 'latest';
  const country = sp.country ?? null;
  const from = (page - 1) * ITEMS_PER_PAGE;
  const to = from + ITEMS_PER_PAGE - 1;

  const { data: countResult } = await supabase.rpc('get_total_rounds_count', {
    country_filter: country,
  });
  const count = countResult || 0;

  const { data: guesses, error } = await supabase.rpc(
    'get_sorted_guesses_paginated',
    {
      page_start: from,
      page_end: to,
      sort_order: sort,
      country_filter: country,
    },
  );

  const { data: countries } = await supabase.rpc('get_unique_countries');
  const countryStats = await getCountryStats();

  if (error) {
    return (
      <main className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
        <p className='text-red-600'>{error.message}</p>
      </main>
    );
  }

  const totalPages = Math.ceil(count / ITEMS_PER_PAGE);

  return (
    <main className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
      <div className='flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6'>
        <SortControls currentOption={sort} />
        <CountryStatsButton stats={countryStats} />
        <CountryFilter countries={countries} currentCountry={country} />
      </div>
      <GuessesTable guesses={guesses} />
      <PaginationControls
        currentPage={page}
        totalPages={totalPages}
        currentSort={sort}
        currentCountry={country}
      />
    </main>
  );
}
