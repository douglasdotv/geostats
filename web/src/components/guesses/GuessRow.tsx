import { Guess } from '@/types/guess';
import { DistanceCell } from '@/components/guesses/DistanceCell';
import { CountryFlag } from '@/components/shared/CountryFlag';
import {
  formatRelativeTime,
  formatMovementRestrictions,
  getTimeToGuess,
} from '@/lib/utils';
import lookup from 'country-code-lookup';

interface GuessRowProps {
  readonly guess: Guess;
  readonly isExpandable?: boolean;
  readonly isExpanded?: boolean;
  readonly onToggle?: () => void;
  readonly isSubRow?: boolean;
  readonly isLoading?: boolean;
  readonly onShowMap?: () => void;
}

export function GuessRow({
  guess,
  isExpandable = false,
  isExpanded = false,
  onToggle,
  isSubRow = false,
  isLoading = false,
  onShowMap,
}: GuessRowProps) {
  const rowClass = isSubRow
    ? 'bg-gray-50/50 dark:bg-gray-800/50'
    : 'hover:bg-gray-50/50 dark:hover:bg-gray-800/50';

  function getCountryCode(countryName: string | null) {
    if (!countryName) return null;
    try {
      const country = lookup.byCountry(countryName);
      return country?.iso2 ?? null;
    } catch {
      return null;
    }
  }

  function renderLocation(
    displayName: string | null,
    countryName: string | null,
  ) {
    const code = getCountryCode(countryName);
    return (
      <div
        className='flex items-center gap-2'
        data-tooltip-id='guess-row-tooltip'
        data-tooltip-content={displayName ?? 'Unknown'}
      >
        {code && <CountryFlag countryCode={code} countryName={countryName} />}
        <span className='truncate max-w-[200px]'>
          {displayName ?? 'Unknown'}
        </span>
      </div>
    );
  }

  function getButtonText() {
    if (isLoading) return '...';
    return isExpanded ? '-' : '+';
  }

  const hasActualLocation = Boolean(guess.actual_lat && guess.actual_lng);
  const hasGuessLocation = Boolean(guess.guess_lat && guess.guess_lng);
  const canShowMap = hasActualLocation && hasGuessLocation;

  let brTooltipContent: string;
  if (isLoading) {
    brTooltipContent = 'Loading...';
  } else if (isExpanded) {
    brTooltipContent = 'Hide additional guesses';
  } else {
    brTooltipContent = 'Show additional guesses for this round';
  }

  const gameTypeContent = `${guess.game_type}/${formatMovementRestrictions(guess.movement_restrictions)}`;

  return (
    <tr className={`transition-all duration-200 ${rowClass}`}>
      <td className='px-4 py-3'>
        <div className='flex items-center justify-center gap-2'>
          {isExpandable && (
            <button
              onClick={onToggle}
              className='px-2 py-0.5 text-xs bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors'
              disabled={isLoading}
              data-tooltip-id='guess-row-tooltip'
              data-tooltip-content={brTooltipContent}
            >
              {getButtonText()}
            </button>
          )}
          <span className='truncate text-gray-600 dark:text-gray-300'>
            {gameTypeContent}
          </span>
        </div>
      </td>
      <td className='px-4 py-3'>
        {renderLocation(guess.guess_display_name, guess.guess_country)}
      </td>
      <td className='px-4 py-3'>
        {renderLocation(guess.actual_display_name, guess.actual_country)}
      </td>
      <td className='px-4 py-3 text-center'>
        <DistanceCell distance={guess.distance} />
      </td>
      <td className='px-4 py-3 text-center whitespace-nowrap text-gray-600 dark:text-gray-300'>
        {formatRelativeTime(guess.guess_time)}
      </td>
      <td className='px-4 py-3 text-center whitespace-nowrap text-gray-600 dark:text-gray-300'>
        {getTimeToGuess(guess.guess_time, guess.round_start_time)}
      </td>
      <td className='px-4 py-3'>
        <div className='flex justify-center gap-2'>
          {canShowMap && (
            <button
              onClick={onShowMap}
              className='text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300 transition-colors'
              data-tooltip-id='guess-row-tooltip'
              data-tooltip-content='Display guess and actual location on an interactive map'
            >
              🗺️
            </button>
          )}
          {hasActualLocation && (
            <a
              href={`https://www.google.com/maps/@?api=1&map_action=pano&viewpoint=${guess.actual_lat},${guess.actual_lng}`}
              target='_blank'
              rel='noopener noreferrer'
              className='text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300 transition-colors'
              data-tooltip-id='guess-row-tooltip'
              data-tooltip-content='Open actual location in Google Street View'
            >
              🌐
            </a>
          )}
        </div>
      </td>
    </tr>
  );
}
