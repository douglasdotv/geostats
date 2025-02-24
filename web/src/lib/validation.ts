import { RawCountryStats } from '@/types/stats';
import {
  MovementRestrictionType,
  MOVEMENT_RESTRICTION_TYPES,
} from '@/types/movement';
import { GameType, GAME_TYPES } from '@/types/gametype';

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

export const isValidMovementRestriction = (
  value: unknown,
): value is MovementRestrictionType => {
  if (typeof value !== 'string') {
    return false;
  }
  return MOVEMENT_RESTRICTION_TYPES.includes(value);
};

export const isValidGameType = (value: unknown): value is GameType => {
  if (typeof value !== 'string') {
    return false;
  }
  return GAME_TYPES.includes(value);
};
