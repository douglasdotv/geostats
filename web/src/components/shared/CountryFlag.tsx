import ReactCountryFlag from 'react-country-flag';

interface CountryFlagProps {
  readonly countryCode: string;
  readonly countryName: string | null;
  readonly className?: string;
}

export function CountryFlag({
  countryCode,
  countryName,
  className = '',
}: CountryFlagProps) {
  return (
    <div className={`flex items-center justify-center ${className}`}>
      <ReactCountryFlag
        countryCode={countryCode}
        svg
        className='aspect-square w-[1.5em] sm:w-[2em] md:w-[3em]'
        style={{
          border: '1px solid black',
          borderRadius: '50%',
          objectFit: 'cover',
        }}
        aria-label={countryName ?? 'Unknown country'}
      />
    </div>
  );
}
