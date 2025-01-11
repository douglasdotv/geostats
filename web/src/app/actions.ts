'use server';

import { supabase } from '@/lib/supabaseClient';

export async function getAdditionalGuesses(
  gameId: string,
  roundNumber: number,
) {
  const { data, error } = await supabase.rpc('get_additional_guesses', {
    game_id_param: gameId,
    round_number_param: roundNumber,
  });

  if (error) throw error;
  return data;
}
