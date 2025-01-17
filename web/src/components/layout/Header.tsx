'use client';

import { useState, useEffect } from 'react';
import { AboutModal } from '@/components/about/AboutModal';
import { CountryStatsButton } from '@/components/stats/CountryStatsButton';
import { getCountryStats } from '@/app/actions';
import { CountryStats } from '@/types/stats';

export function Header() {
  const [showAbout, setShowAbout] = useState(false);
  const [countryStats, setCountryStats] = useState<CountryStats[]>([]);

  useEffect(() => {
    const fetchCountryStats = async () => {
      const stats = await getCountryStats();
      setCountryStats(stats);
    };
    fetchCountryStats();
  }, []);

  return (
    <>
      <header className='border-b border-gray-200 dark:border-gray-800'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='flex justify-between items-center h-16'>
            <div className='flex items-center'>
              <span className='text-xl font-bold'>GeoStats</span>
            </div>
            <div className='flex items-center gap-4'>
              <CountryStatsButton stats={countryStats} />
              <button
                onClick={() => setShowAbout(true)}
                className='px-4 py-2 rounded-md border border-gray-400 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors'
              >
                About
              </button>
            </div>
          </div>
        </div>
      </header>

      <AboutModal isOpen={showAbout} onClose={() => setShowAbout(false)} />
    </>
  );
}
