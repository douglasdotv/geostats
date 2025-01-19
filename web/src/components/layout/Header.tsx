'use client';

import { useState, useEffect, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { Audiowide } from 'next/font/google';
import { ThemeToggle } from '@/components/shared/ThemeToggle';
import { AboutModal } from '@/components/about/AboutModal';
import { CountryStatsButton } from '@/components/stats/CountryStatsButton';
import { getCountryStats } from '@/app/actions';
import { CountryStats } from '@/types/stats';
import { Spinner } from '@/components/shared/Spinner';

const audiowide = Audiowide({
  weight: '400',
  subsets: ['latin'],
});

export function Header() {
  const [showAbout, setShowAbout] = useState(false);
  const [countryStats, setCountryStats] = useState<CountryStats[]>([]);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  useEffect(() => {
    const fetchCountryStats = async () => {
      try {
        const stats = await getCountryStats();
        setCountryStats(stats);
      } catch (error) {
        console.error('Failed to fetch country stats:', error);
      }
    };
    fetchCountryStats();
  }, []);

  const handleHomeClick = () => {
    startTransition(() => {
      router.push('/');
    });
  };

  return (
    <>
      <header className='border-b border-gray-300 dark:border-gray-800'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='flex justify-between items-center h-16'>
            <div className='flex items-center'>
              <button
                onClick={handleHomeClick}
                className={`text-xl font-bold ${audiowide.className} cursor-pointer flex items-center gap-2`}
                aria-label='Navigate to home page'
              >
                GeoStats
                {isPending && <Spinner />}
              </button>
              <ThemeToggle />
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
