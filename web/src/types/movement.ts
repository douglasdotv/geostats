export const MOVEMENT_RESTRICTION_TYPES = ['all', 'moving', 'no_move', 'nmpz'];

export type MovementRestrictionType =
  (typeof MOVEMENT_RESTRICTION_TYPES)[number];
