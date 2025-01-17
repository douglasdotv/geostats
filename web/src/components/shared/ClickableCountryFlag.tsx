import { useTransition } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { CountryFlag } from '@/components/shared/CountryFlag';
import { Spinner } from '@/components/shared/Spinner';

interface ClickableCountryFlagProps {
  readonly countryCode: string;
  readonly countryName: string | null;
  readonly availableCountries: string[];
  readonly className?: string;
}

export function ClickableCountryFlag({
  countryCode,
  countryName,
  availableCountries,
  className = '',
}: ClickableCountryFlagProps) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const searchParams = useSearchParams();

  const isAvailable = countryName && availableCountries.includes(countryName);

  const handleClick = () => {
    if (!isAvailable) return;

    const params = new URLSearchParams(searchParams.toString());
    const currentCountry = params.get('country');

    if (currentCountry === countryName) {
      params.delete('country');
    } else {
      params.set('country', countryName);
    }

    params.set('page', '1');
    startTransition(() => {
      router.push(`?${params.toString()}`);
    });
  };

  return (
    <div className='flex items-center gap-2'>
      <button
        onClick={handleClick}
        disabled={!isAvailable || isPending}
        className={`relative p-0 border-0 bg-transparent transition-opacity
          ${isAvailable ? 'cursor-pointer hover:opacity-80' : 'cursor-not-allowed opacity-50'} 
          ${className}`}
        aria-label={
          isAvailable
            ? `Filter by ${countryName}`
            : 'Country not available for filtering'
        }
      >
        <CountryFlag
          countryCode={countryCode}
          countryName={countryName}
          className='w-6 h-6 sm:w-[1.5em] sm:h-[1.5em]'
        />
      </button>
      {isPending && <Spinner />}
    </div>
  );
}
