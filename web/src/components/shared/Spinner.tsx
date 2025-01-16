export function Spinner() {
  return (
    <output
      className='inline-block h-4 w-4 animate-spin rounded-full border-4 border-current border-t-transparent text-blue-600'
      aria-label='Loading'
    />
  );
}
