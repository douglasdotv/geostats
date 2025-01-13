'use client';

import { useState, Fragment } from 'react';
import { Guess, GuessWithAdditionalGuesses } from '@/types/guess';
import { GuessRow } from '@/components/guesses/GuessRow';
import { LocationMapModal } from '@/components/map/LocationMapModal';
import { getAdditionalGuesses } from '@/app/actions';

interface GuessesTableProps {
  readonly guesses: GuessWithAdditionalGuesses[];
}

export function GuessesTable({ guesses }: GuessesTableProps) {
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
  const [additionalGuesses, setAdditionalGuesses] = useState<
    Record<string, Guess[]>
  >({});
  const [loadingRows, setLoadingRows] = useState<Set<string>>(new Set());
  const [activeMapGuess, setActiveMapGuess] = useState<Guess | null>(null);

  const toggleExpand = async (
    id: string,
    gameId: string,
    roundNumber: number,
  ) => {
    const copy = new Set(expandedRows);
    const isExpanding = !copy.has(id);

    if (isExpanding && !additionalGuesses[id]) {
      setLoadingRows((prev) => new Set(prev).add(id));

      try {
        const data = await getAdditionalGuesses(gameId, roundNumber);
        if (data) {
          setAdditionalGuesses((prev) => ({
            ...prev,
            [id]: data,
          }));
        }
      } catch (error) {
        console.error('Failed to fetch additional guesses:', error);
      }

      setLoadingRows((prev) => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
    }

    if (copy.has(id)) {
      copy.delete(id);
    } else {
      copy.add(id);
    }

    setExpandedRows(copy);
  };

  return (
    <>
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
          {guesses?.map((guess) => {
            const rowKey = `${guess.game_id}-${guess.round_number}`;
            const isExpanded = expandedRows.has(rowKey);
            const isLoading = loadingRows.has(rowKey);
            const otherGuesses = additionalGuesses[rowKey] || [];

            return (
              <Fragment key={rowKey}>
                <GuessRow
                  guess={guess}
                  isExpandable={guess.has_additional_guesses}
                  isExpanded={isExpanded}
                  onToggle={() =>
                    toggleExpand(rowKey, guess.game_id, guess.round_number)
                  }
                  isLoading={isLoading}
                  onShowMap={() => setActiveMapGuess(guess)}
                />
                {isExpanded &&
                  otherGuesses.map((g) => (
                    <GuessRow
                      key={g.id}
                      guess={g}
                      isExpandable={false}
                      isExpanded={false}
                      isSubRow
                      onShowMap={() => setActiveMapGuess(g)}
                    />
                  ))}
              </Fragment>
            );
          })}
        </tbody>
      </table>

      {activeMapGuess &&
        Boolean(activeMapGuess.actual_lat) &&
        Boolean(activeMapGuess.actual_lng) && (
          <LocationMapModal
            isOpen={true}
            onClose={() => setActiveMapGuess(null)}
            guessLat={activeMapGuess.guess_lat}
            guessLng={activeMapGuess.guess_lng}
            actualLat={activeMapGuess.actual_lat}
            actualLng={activeMapGuess.actual_lng}
            guessLocation={activeMapGuess.guess_display_name}
            actualLocation={activeMapGuess.actual_display_name}
          />
        )}
    </>
  );
}
