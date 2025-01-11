import { supabase } from '@/lib/supabaseClient';
import { RECENT_GUESSES_LIMIT } from '@/lib/constants';
import { GuessesTable } from '@/components/guesses/GuessesTable';

export default async function Home() {
  const { data: guesses, error } = await supabase
    .from('guesses')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(RECENT_GUESSES_LIMIT);

  if (error) {
    return (
      <main className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
        <p className='text-red-600'>{error.message}</p>
      </main>
    );
  }

  return (
    <main className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
      <GuessesTable guesses={guesses} />
    </main>
  );
}
