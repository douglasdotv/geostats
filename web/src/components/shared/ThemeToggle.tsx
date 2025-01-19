'use client';

import { useState, useEffect } from 'react';
import { useTheme } from '@/providers/ThemeProvider';

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <button
        className='p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200 ease-in-out ml-2'
        aria-label='Toggle theme'
      ></button>
    );
  }

  return (
    <button
      onClick={toggleTheme}
      className='p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200 ease-in-out ml-2'
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
    >
      {theme === 'light' ? '🌙' : '☀️'}
    </button>
  );
}
