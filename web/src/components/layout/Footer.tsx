import Link from 'next/link';
import { GEOGUESSR_PROFILE_LINK } from '@/lib/constants';

export function Footer() {
  return (
    <footer className='mt-auto py-6 border-t border-gray-200 dark:border-gray-800'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-center items-center space-x-1'>
        <span className='text-gray-600 dark:text-gray-400'>Made by</span>
        <Link
          href={GEOGUESSR_PROFILE_LINK}
          target='_blank'
          rel='noopener noreferrer'
          className='text-blue-600 dark:text-blue-400 hover:underline'
        >
          Douglas
        </Link>
      </div>
    </footer>
  );
}
