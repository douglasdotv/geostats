'use client';

import { useState, Fragment } from 'react';
import { Guess, GroupedGuess } from '@/types/guess';
import { GuessRow } from '@/components/guesses/GuessRow';

interface GuessesTableProps {
  readonly guesses: Guess[];
}

function groupBrGuesses(guesses: Guess[]): GroupedGuess[] {
  const brGroups = new Map<string, Guess[]>();
  const result: GroupedGuess[] = [];
  const nonBr: Guess[] = [];

  guesses.forEach((g) => {
    if (g.game_type === 'br') {
      const key = `${g.game_id}-${g.round_number}`;
      if (!brGroups.has(key)) brGroups.set(key, []);
      brGroups.get(key)?.push(g);
    } else {
      nonBr.push(g);
    }
  });

  brGroups.forEach((group) => {
    if (group.length === 1) {
      result.push({ bestGuess: group[0], otherGuesses: [] });
    } else {
      const sorted = [...group].sort((a, b) => {
        const distA = a.distance ?? Infinity;
        const distB = b.distance ?? Infinity;
        return distA - distB;
      });
      result.push({ bestGuess: sorted[0], otherGuesses: sorted.slice(1) });
    }
  });

  const singleRows = nonBr.map((g) => ({ bestGuess: g, otherGuesses: [] }));
  return [...singleRows, ...result];
}

export function GuessesTable({ guesses }: GuessesTableProps) {
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
  const grouped = groupBrGuesses(guesses);

  const toggleExpand = (id: string) => {
    const copy = new Set(expandedRows);

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
        {grouped.map(({ bestGuess, otherGuesses }) => {
          const rowKey = `${bestGuess.game_id}-${bestGuess.round_number}`;
          const hasOthers = otherGuesses.length > 0;
          const isExpanded = expandedRows.has(rowKey);
          return (
            <Fragment key={rowKey}>
              <GuessRow
                key={bestGuess.id}
                guess={bestGuess}
                isExpandable={hasOthers}
                isExpanded={isExpanded}
                onToggle={() => toggleExpand(rowKey)}
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
