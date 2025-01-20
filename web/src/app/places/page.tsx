'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FiArrowLeft } from 'react-icons/fi';
import { VisitedPlacesMap } from '@/components/map/VisitedPlacesMap';
import { Spinner } from '@/components/shared/Spinner';

export default function MapPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  return (
    <main className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
      <div className='space-y-6'>
        <button
          onClick={() => router.back()}
          className='inline-flex items-center gap-2 text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300 transition-colors'
        >
          <FiArrowLeft />
          <span>Back</span>
        </button>

        <h1 className='text-2xl font-semibold'>Places I&apos;ve Been</h1>

        <div className='relative bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800'>
          {isLoading && (
            <div className='absolute top-4 right-4 z-10'>
              <Spinner />
            </div>
          )}
          <div className='w-full h-[80vh]'>
            <VisitedPlacesMap onLoadingChange={setIsLoading} />
          </div>
        </div>
      </div>
    </main>
  );
}
