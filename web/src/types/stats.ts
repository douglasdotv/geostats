export interface CountryStats {
  country: string;
  totalGuesses: number;
  correctGuesses: number;
  correctPercentage: number;
  averageDistance: number;
}

export interface RawCountryStats {
  country: string;
  total_guesses: number;
  correct_guesses: number;
  correct_percentage: number;
  average_distance: number;
}
