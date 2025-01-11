'use client';

import { useState, Fragment } from 'react';
import { Guess, GuessWithAdditionalGuesses } from '@/types/guess';
import { GuessRow } from '@/components/guesses/GuessRow';
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
              />
              {isExpanded &&
                otherGuesses.map((g) => (
                  <GuessRow
                    key={g.id}
                    guess={g}
                    isExpandable={false}
                    isExpanded={false}
                    isSubRow
                  />
                ))}
            </Fragment>
          );
        })}
      </tbody>
    </table>
  );
}
