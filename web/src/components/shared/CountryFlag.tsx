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
    <ReactCountryFlag
      countryCode={countryCode}
      svg
      className={`align-middle ${className}`}
      style={{
        width: '1.5em',
        height: '1.5em',
        border: '1px solid black',
        borderRadius: '50%',
        objectFit: 'cover',
      }}
      aria-label={countryName ?? 'Unknown country'}
    />
  );
}
