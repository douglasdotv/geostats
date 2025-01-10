import { Guess } from '@/types/guess';
import {
  formatDistance,
  formatRelativeTime,
  formatMovementRestrictions,
  getTimeToGuess,
} from '@/lib/utils';

interface GuessRowProps {
  readonly guess: Guess;
}

export function GuessRow({ guess }: GuessRowProps) {
  return (
    <tr className='border-b hover:bg-gray-50 dark:hover:bg-gray-900'>
      <td className='py-2 pr-4'>
        {guess.game_type}/
        {formatMovementRestrictions(guess.movement_restrictions)}
      </td>
      <td className='py-2 pr-4'>{guess.guess_display_name ?? 'Unknown'}</td>
      <td className='py-2 pr-4'>{guess.actual_display_name}</td>
      <td className='py-2 pr-4'>{formatDistance(guess.distance)}</td>
      <td className='py-2 pr-4'>{formatRelativeTime(guess.guess_time)}</td>
      <td className='py-2 pr-4'>
        {getTimeToGuess(guess.guess_time, guess.round_start_time)}
      </td>
      <td className='py-2 pr-4'>
        {guess.actual_lat && guess.actual_lng ? (
          <a
            href={`https://www.google.com/maps/@?api=1&map_action=pano&viewpoint=${guess.actual_lat},${guess.actual_lng}`}
            target='_blank'
            rel='noopener noreferrer'
            className='underline text-blue-600'
          >
            🌐
          </a>
        ) : (
          'N/A'
        )}
      </td>
    </tr>
  );
}
