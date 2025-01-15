'use client';

import { useTransition } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Spinner } from '@/components/shared/Spinner';
import { MovementRestrictionType } from '@/types/movement';
import { isValidMovementRestriction } from '@/lib/validation';

interface MovementRestrictionFilterProps {
  readonly currentMovementRestriction: MovementRestrictionType | null;
}

export function MovementRestrictionFilter({
  currentMovementRestriction,
}: MovementRestrictionFilterProps) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const params = new URLSearchParams(searchParams.toString());
    const movement = event.target.value;

    if (!isValidMovementRestriction(movement)) {
      return;
    }

    if (movement === 'all') {
      params.delete('movement');
    } else {
      params.set('movement', movement);
    }

    params.set('page', '1');

    startTransition(() => {
      router.push(`?${params.toString()}`);
    });
  };

  return (
    <div className='flex items-center gap-2'>
      <select
        value={currentMovementRestriction ?? 'all'}
        onChange={handleChange}
        className='px-4 py-2 rounded-md border border-gray-300 dark:border-gray-700 bg-transparent hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors'
      >
        <option value='all'>All Movement Restrictions</option>
        <option value='moving'>Moving</option>
        <option value='no_move'>No Move</option>
        <option value='nmpz'>NMPZ</option>
      </select>
      {isPending && <Spinner />}
    </div>
  );
}
