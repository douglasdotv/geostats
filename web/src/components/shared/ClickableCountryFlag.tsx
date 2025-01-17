import { useTransition } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { CountryFlag } from '@/components/shared/CountryFlag';
import { Spinner } from '@/components/shared/Spinner';

interface ClickableCountryFlagProps {
  readonly countryCode: string;
  readonly countryName: string | null;
  readonly className?: string;
}

export function ClickableCountryFlag({
  countryCode,
  countryName,
  className = '',
}: ClickableCountryFlagProps) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleClick = () => {
    if (!countryName) return;

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
        disabled={isPending}
        className={`p-0 border-0 bg-transparent cursor-pointer hover:opacity-80 transition-opacity disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
        aria-label={`Filter by ${countryName ?? 'country'}`}
      >
        <CountryFlag countryCode={countryCode} countryName={countryName} />
      </button>
      {isPending && <Spinner />}
    </div>
  );
}

export default ClickableCountryFlag;
