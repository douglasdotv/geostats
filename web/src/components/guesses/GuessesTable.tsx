import { Guess } from '@/types/guess';
import { GuessRow } from '@/components/guesses/GuessRow';

interface GuessesTableProps {
  readonly guesses: Guess[];
}

export function GuessesTable({ guesses }: GuessesTableProps) {
  return (
    <table className='w-full border-collapse'>
      <thead>
        <tr className='border-b'>
          <th className='py-2 pr-4 text-left'>Game Type</th>
          <th className='py-2 pr-4 text-left'>Guess</th>
          <th className='py-2 pr-4 text-left'>Actual Location</th>
          <th className='py-2 pr-4 text-left'>Distance</th>
          <th className='py-2 pr-4 text-left'>When</th>
          <th className='py-2 pr-4 text-left'>Time to Guess</th>
          <th className='py-2 pr-4 text-left'>View</th>
        </tr>
      </thead>
      <tbody>
        {guesses.map((guess) => (
          <GuessRow key={guess.id} guess={guess} />
        ))}
      </tbody>
    </table>
  );
}
