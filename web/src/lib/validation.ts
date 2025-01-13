import { RawCountryStats } from '@/types/stats';

export const isRawCountryStats = (data: unknown): data is RawCountryStats[] => {
  if (!Array.isArray(data)) return false;
  return data.every(
    (item) =>
      typeof item === 'object' &&
      item !== null &&
      'country' in item &&
      'total_guesses' in item &&
      'correct_guesses' in item &&
      'correct_percentage' in item &&
      'average_distance' in item,
  );
};
