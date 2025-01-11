import { supabase } from '@/lib/supabaseClient';
import { GuessesTable } from '@/components/guesses/GuessesTable';
import { PaginationControls } from '@/components/pagination/PaginationControls';
import { ITEMS_PER_PAGE } from '@/lib/constants';

type QueryParams = Promise<{
  [key: string]: string | string[] | undefined;
}>;

interface PageProps {
  readonly searchParams: QueryParams;
}

export default async function Home({ searchParams }: PageProps) {
  const sp = await searchParams;
  const page = Number(sp.page) || 1;
  const from = (page - 1) * ITEMS_PER_PAGE;
  const to = from + ITEMS_PER_PAGE - 1;

  const { count } = await supabase
    .from('guesses')
    .select('*', { count: 'exact', head: true });

  const { data: guesses, error } = await supabase
    .from('guesses')
    .select('*')
    .order('created_at', { ascending: false })
    .range(from, to);

  if (error) {
    return (
      <main className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
        <p className='text-red-600'>{error.message}</p>
      </main>
    );
  }

  const totalPages = Math.ceil((count ?? 0) / ITEMS_PER_PAGE);

  return (
    <main className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
      <GuessesTable guesses={guesses} />
      <PaginationControls currentPage={page} totalPages={totalPages} />
    </main>
  );
}
