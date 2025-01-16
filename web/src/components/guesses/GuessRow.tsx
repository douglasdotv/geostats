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
  const subRowClass = isSubRow ? 'bg-gray-100 dark:bg-gray-800' : '';

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
      <div className='inline-flex items-center space-x-2'>
        {code && <CountryFlag countryCode={code} countryName={countryName} />}
        <span>{displayName ?? 'Unknown'}</span>
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

  return (
    <tr
      className={`border-b hover:bg-gray-50 dark:hover:bg-gray-900 ${subRowClass}`}
    >
      <td className='py-2 pr-4'>
        {isExpandable && (
          <button
            onClick={onToggle}
            className='mr-2 px-1 text-xs border rounded'
            disabled={isLoading}
            data-tooltip-id='guess-row-tooltip'
            data-tooltip-content={brTooltipContent}
          >
            {getButtonText()}
          </button>
        )}
        {guess.game_type}/
        {formatMovementRestrictions(guess.movement_restrictions)}
      </td>
      <td className='py-2 pr-4'>
        {renderLocation(guess.guess_display_name, guess.guess_country)}
      </td>
      <td className='py-2 pr-4'>
        {renderLocation(guess.actual_display_name, guess.actual_country)}
      </td>
      <td className='py-2 pr-4'>
        <DistanceCell distance={guess.distance} />
      </td>
      <td className='py-2 pr-4'>{formatRelativeTime(guess.guess_time)}</td>
      <td className='py-2 pr-4'>
        {getTimeToGuess(guess.guess_time, guess.round_start_time)}
      </td>
      <td className='py-2 pr-4'>
        <div className='flex gap-2'>
          {hasActualLocation && (
            <a
              href={`https://www.google.com/maps/@?api=1&map_action=pano&viewpoint=${guess.actual_lat},${guess.actual_lng}`}
              target='_blank'
              rel='noopener noreferrer'
              className='text-blue-600 hover:text-blue-800'
              data-tooltip-id='guess-row-tooltip'
              data-tooltip-content='Open actual location in Google Street View'
            >
              🌐
            </a>
          )}
          {canShowMap && (
            <button
              onClick={onShowMap}
              className='text-blue-600 hover:text-blue-800 cursor-pointer transition-colors'
              data-tooltip-id='guess-row-tooltip'
              data-tooltip-content='Display guess and actual location on an interactive map'
            >
              🗺️
            </button>
          )}
        </div>
      </td>
    </tr>
  );
}
