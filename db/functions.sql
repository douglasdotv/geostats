-- Get total count of unique rounds (each duels/challenge guess + each BR round) with country/movement filters
CREATE OR REPLACE FUNCTION get_total_rounds_count(
  country_filter TEXT DEFAULT NULL,
  movement_type TEXT DEFAULT NULL
)
RETURNS INTEGER AS $$
  WITH unique_rounds AS (
    SELECT DISTINCT game_id, round_number, game_type
    FROM guesses g1
    WHERE (g1.game_type IN ('duels', 'challenge')
    AND (country_filter IS NULL OR g1.actual_country = country_filter)
    AND (movement_type IS NULL 
      OR (
        CASE movement_type
          WHEN 'moving' THEN NOT (g1.movement_restrictions->>'forbidMoving')::boolean
          WHEN 'no_move' THEN (g1.movement_restrictions->>'forbidMoving')::boolean 
            AND NOT ((g1.movement_restrictions->>'forbidZooming')::boolean 
              AND (g1.movement_restrictions->>'forbidRotating')::boolean)
          WHEN 'nmpz' THEN (g1.movement_restrictions->>'forbidMoving')::boolean 
            AND (g1.movement_restrictions->>'forbidZooming')::boolean 
            AND (g1.movement_restrictions->>'forbidRotating')::boolean
        END
      )
    ))
    UNION ALL
    SELECT DISTINCT game_id, round_number, game_type
    FROM guesses g2
    WHERE g2.game_type = 'br'
    AND (country_filter IS NULL OR g2.actual_country = country_filter)
    AND (movement_type IS NULL 
      OR (
        CASE movement_type
          WHEN 'moving' THEN NOT (g2.movement_restrictions->>'forbidMoving')::boolean
          WHEN 'no_move' THEN (g2.movement_restrictions->>'forbidMoving')::boolean 
            AND NOT ((g2.movement_restrictions->>'forbidZooming')::boolean 
              AND (g2.movement_restrictions->>'forbidRotating')::boolean)
          WHEN 'nmpz' THEN (g2.movement_restrictions->>'forbidMoving')::boolean 
            AND (g2.movement_restrictions->>'forbidZooming')::boolean 
            AND (g2.movement_restrictions->>'forbidRotating')::boolean
        END
      )
    )
    AND g2.distance = (
      SELECT MIN(g3.distance)
      FROM guesses g3
      WHERE g3.game_id = g2.game_id
      AND g3.round_number = g2.round_number
    )
  )
  SELECT COUNT(*) FROM unique_rounds;
$$ LANGUAGE SQL;

-- Type to include the has_additional_guesses flag
CREATE TYPE guess_with_has_additional_guesses_flag AS (
  id UUID,
  game_id TEXT,
  game_type TEXT,
  map TEXT,
  map_name TEXT,
  movement_restrictions JSONB,
  guess_lat DOUBLE PRECISION,
  guess_lng DOUBLE PRECISION,
  guess_display_name TEXT,
  guess_city TEXT,
  guess_state TEXT,
  guess_country TEXT,
  actual_lat DOUBLE PRECISION,
  actual_lng DOUBLE PRECISION,
  actual_display_name TEXT,
  actual_city TEXT,
  actual_state TEXT,
  actual_country TEXT,
  heading DOUBLE PRECISION,
  pitch DOUBLE PRECISION,
  zoom DOUBLE PRECISION,
  distance DOUBLE PRECISION,
  score INTEGER,
  round_number INTEGER,
  round_start_time TIMESTAMPTZ,
  guess_time TIMESTAMPTZ,
  steps_count INTEGER,
  pano_id TEXT,
  created_at TIMESTAMPTZ,
  has_additional_guesses BOOLEAN
);

-- Get unique countries from actual locations
CREATE OR REPLACE FUNCTION get_unique_countries()
RETURNS SETOF TEXT AS $$
  SELECT DISTINCT actual_country
  FROM guesses
  WHERE actual_country IS NOT NULL
  ORDER BY actual_country;
$$ LANGUAGE SQL;

-- Get guesses for pagination with has_additional_guesses flag and country/movement filters
CREATE OR REPLACE FUNCTION get_sorted_guesses_paginated(
  page_start INTEGER,
  page_end INTEGER,
  sort_order TEXT DEFAULT 'latest',
  country_filter TEXT DEFAULT NULL,
  movement_type TEXT DEFAULT NULL
)
RETURNS SETOF guess_with_has_additional_guesses_flag AS $$
  WITH ranked_guesses AS (
    SELECT DISTINCT ON (g.game_id, g.round_number) 
      g.id,
      g.game_id,
      g.game_type,
      g.map,
      g.map_name,
      g.movement_restrictions,
      g.guess_lat,
      g.guess_lng,
      g.guess_display_name,
      g.guess_city,
      g.guess_state,
      g.guess_country,
      g.actual_lat,
      g.actual_lng,
      g.actual_display_name,
      g.actual_city,
      g.actual_state,
      g.actual_country,
      g.heading,
      g.pitch,
      g.zoom,
      g.distance,
      g.score,
      g.round_number,
      g.round_start_time,
      g.guess_time,
      g.steps_count,
      g.pano_id,
      g.created_at,
      EXISTS (
        SELECT 1
        FROM guesses g2
        WHERE g2.game_id = g.game_id
        AND g2.round_number = g.round_number
        AND g2.distance > g.distance
      ) as has_additional_guesses
    FROM guesses g
    WHERE (g.game_type IN ('duels', 'challenge')
    OR (g.game_type = 'br' AND g.distance = (
      SELECT MIN(g2.distance)
      FROM guesses g2
      WHERE g2.game_id = g.game_id
      AND g2.round_number = g.round_number
    )))
    AND (country_filter IS NULL OR g.actual_country = country_filter)
    AND (movement_type IS NULL 
      OR (
        CASE movement_type
          WHEN 'moving' THEN NOT (g.movement_restrictions->>'forbidMoving')::boolean
          WHEN 'no_move' THEN (g.movement_restrictions->>'forbidMoving')::boolean 
            AND NOT ((g.movement_restrictions->>'forbidZooming')::boolean 
              AND (g.movement_restrictions->>'forbidRotating')::boolean)
          WHEN 'nmpz' THEN (g.movement_restrictions->>'forbidMoving')::boolean 
            AND (g.movement_restrictions->>'forbidZooming')::boolean 
            AND (g.movement_restrictions->>'forbidRotating')::boolean
        END
      )
    )
    ORDER BY g.game_id, g.round_number, g.created_at DESC
  )
  SELECT * FROM ranked_guesses
  ORDER BY 
    CASE sort_order
      WHEN 'best' THEN distance
      WHEN 'worst' THEN -distance
      ELSE NULL
    END NULLS LAST,
    CASE 
      WHEN sort_order = 'latest' THEN created_at
      ELSE NULL
    END DESC NULLS LAST
  OFFSET page_start
  LIMIT (page_end - page_start + 1);
$$ LANGUAGE SQL;

-- Get additional guesses for a BR round
CREATE OR REPLACE FUNCTION get_additional_guesses(game_id_param TEXT, round_number_param INTEGER)
RETURNS SETOF guesses AS $$
  WITH best_guess AS (
    SELECT MIN(distance) as min_distance
    FROM guesses
    WHERE game_id = game_id_param
    AND round_number = round_number_param
  )
  SELECT g.*
  FROM guesses g, best_guess bg
  WHERE g.game_id = game_id_param
  AND g.round_number = round_number_param
  AND g.distance > bg.min_distance
  ORDER BY g.distance;
$$ LANGUAGE SQL;

-- Get country stats
CREATE OR REPLACE FUNCTION get_country_stats()
RETURNS TABLE (
  country TEXT,
  total_guesses BIGINT,
  correct_guesses BIGINT,
  correct_percentage DECIMAL,
  average_distance DECIMAL
) AS $$
  WITH country_metrics AS (
    SELECT 
      actual_country,
      COUNT(*) as total,
      COUNT(CASE WHEN actual_country = guess_country THEN 1 END) as correct,
      AVG(distance) as avg_distance
    FROM guesses
    WHERE actual_country IS NOT NULL
    GROUP BY actual_country
  )
  SELECT
    actual_country as country,
    total as total_guesses,
    correct as correct_guesses,
    ROUND((correct::DECIMAL / total::DECIMAL) * 100, 2) as correct_percentage,
    ROUND(avg_distance::DECIMAL, 2) as average_distance
  FROM country_metrics
  ORDER BY correct_percentage DESC;
$$ LANGUAGE SQL;
