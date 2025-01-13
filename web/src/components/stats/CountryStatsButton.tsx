'use client';

import { useState } from 'react';
import { CountryStatsModal } from '@/components/stats/CountryStatsModal';
import { CountryStats } from '@/types/stats';

interface CountryStatsButtonProps {
  readonly stats: CountryStats[];
}

export function CountryStatsButton({ stats }: CountryStatsButtonProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsDialogOpen(true)}
        className='px-4 py-2 rounded-md border border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors'
      >
        Country Stats
      </button>

      <CountryStatsModal
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        stats={stats}
      />
    </>
  );
}
