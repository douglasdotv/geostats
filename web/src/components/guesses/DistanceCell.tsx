import { GuessQuality } from '@/types/guess';
import { getGuessQuality, formatDistance } from '@/lib/utils';

const bulletColors: Record<GuessQuality, string> = {
  [GuessQuality.Good]: 'bg-green-400',
  [GuessQuality.Average]: 'bg-yellow-400',
  [GuessQuality.Bad]: 'bg-red-400',
};

interface DistanceCellProps {
  readonly distance: number | null;
}

export function DistanceCell({ distance }: DistanceCellProps) {
  const quality = getGuessQuality(distance);
  return (
    <div className='inline-flex items-center space-x-2'>
      <span className={`block w-2 h-2 rounded-full ${bulletColors[quality]}`} />
      <span>{formatDistance(distance)}</span>
    </div>
  );
}
