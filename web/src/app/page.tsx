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
      <div className='min-h-screen p-8'>
        <h1>GeoStats</h1>
        <p>{error.message}</p>
      </div>
    );
  }

  return (
    <div className='min-h-screen p-8'>
      <h1 className='mb-8 text-2xl font-bold'>GeoStats</h1>
      <GuessesTable guesses={guesses} />
    </div>
  );
}
