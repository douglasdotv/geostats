import { supabase } from '@/lib/supabaseClient';
import { formatDistance, formatRelativeTime } from '@/lib/utils';
import { RECENT_GUESSES_LIMIT } from '@/lib/constants';
import { Guess } from '@/types/guess';

export default async function Home() {
  const { data, error } = await supabase
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
      <table className='w-full border-collapse'>
        <thead>
          <tr className='border-b'>
            <th className='py-2 pr-4 text-left'>Game Type</th>
            <th className='py-2 pr-4 text-left'>Guess</th>
            <th className='py-2 pr-4 text-left'>Actual Location</th>
            <th className='py-2 pr-4 text-left'>Distance</th>
            <th className='py-2 pr-4 text-left'>When</th>
          </tr>
        </thead>
        <tbody>
          {data?.map((g: Guess) => (
            <tr
              key={g.id}
              className='border-b hover:bg-gray-50 dark:hover:bg-gray-900'
            >
              <td className='py-2 pr-4'>{g.game_type}</td>
              <td className='py-2 pr-4'>{g.guess_display_name ?? 'Unknown'}</td>
              <td className='py-2 pr-4'>{g.actual_display_name}</td>
              <td className='py-2 pr-4'>{formatDistance(g.distance)}</td>
              <td className='py-2 pr-4'>{formatRelativeTime(g.guess_time)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
