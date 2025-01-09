export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json }
  | Json[];

export interface Database {
  public: {
    Tables: {
      guesses: {
        Row: {
          id: string;
          timestamp: string;
          game_id: string;
          game_type: string;
          map: string | null;
          map_name: string | null;
          movement_restrictions: Json | null;
          guess_lat: number;
          guess_lng: number;
          guess_display_name: string | null;
          guess_city: string | null;
          guess_state: string | null;
          guess_country: string | null;
          actual_lat: number;
          actual_lng: number;
          actual_display_name: string | null;
          actual_city: string | null;
          actual_state: string | null;
          actual_country: string | null;
          heading: number | null;
          pitch: number | null;
          zoom: number | null;
          distance: number | null;
          score: number | null;
          round_number: number;
          round_start_time: string;
          guess_time: string;
          steps_count: number | null;
          pano_id: string | null;
          created_at: string | null;
        };
      };
    };
    Views: never;
    Functions: never;
    Enums: never;
    CompositeTypes: never;
  };
}