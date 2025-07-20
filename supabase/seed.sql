-- Seed data for Turfees booking platform

-- Insert sample turfs
INSERT INTO turfs (slug, name, description, base_price, amenities, location, open_hours)
VALUES 
  (
    'xyz-turf', 
    'XYZ Turf', 
    'A premium turf for football and cricket enthusiasts.', 
    150000, -- 1500 rupees in paise
    ARRAY['Floodlights', 'Changing Rooms', 'Parking', 'Refreshments'],
    POINT(12.9716, 77.5946),
    '{
      "mon": {"start": "06:00", "end": "22:00"},
      "tue": {"start": "06:00", "end": "22:00"},
      "wed": {"start": "06:00", "end": "22:00"},
      "thu": {"start": "06:00", "end": "22:00"},
      "fri": {"start": "06:00", "end": "22:00"},
      "sat": {"start": "06:00", "end": "22:00"},
      "sun": {"start": "06:00", "end": "22:00"}
    }'::jsonb
  ),
  (
    'abc-sports', 
    'ABC Sports Arena', 
    'Multi-sport facility with high-quality synthetic turf.', 
    200000, -- 2000 rupees in paise
    ARRAY['Floodlights', 'Changing Rooms', 'Parking', 'Refreshments', 'Seating Area', 'Washrooms'],
    POINT(12.9352, 77.6245),
    '{
      "mon": {"start": "05:00", "end": "23:00"},
      "tue": {"start": "05:00", "end": "23:00"},
      "wed": {"start": "05:00", "end": "23:00"},
      "thu": {"start": "05:00", "end": "23:00"},
      "fri": {"start": "05:00", "end": "23:00"},
      "sat": {"start": "05:00", "end": "23:00"},
      "sun": {"start": "05:00", "end": "23:00"}
    }'::jsonb
  ),
  (
    'play-arena', 
    'Play Arena', 
    'Community turf with affordable rates for local teams.', 
    100000, -- 1000 rupees in paise
    ARRAY['Floodlights', 'Parking', 'Washrooms'],
    POINT(13.0159, 77.5912),
    '{
      "mon": {"start": "07:00", "end": "21:00"},
      "tue": {"start": "07:00", "end": "21:00"},
      "wed": {"start": "07:00", "end": "21:00"},
      "thu": {"start": "07:00", "end": "21:00"},
      "fri": {"start": "07:00", "end": "21:00"},
      "sat": {"start": "07:00", "end": "21:00"},
      "sun": {"start": "07:00", "end": "21:00"}
    }'::jsonb
  );

-- Get the IDs of the inserted turfs
DO $$
DECLARE
  xyz_turf_id UUID;
  abc_sports_id UUID;
  play_arena_id UUID;
  current_date TIMESTAMPTZ := '2025-07-18 00:00:00+00'::TIMESTAMPTZ;
  slot_start TIMESTAMPTZ;
  slot_end TIMESTAMPTZ;
BEGIN
  -- Get the turf IDs
  SELECT id INTO xyz_turf_id FROM turfs WHERE slug = 'xyz-turf';
  SELECT id INTO abc_sports_id FROM turfs WHERE slug = 'abc-sports';
  SELECT id INTO play_arena_id FROM turfs WHERE slug = 'play-arena';
  
  -- Insert slots for XYZ Turf (today)
  FOR hour IN 6..21 LOOP
    slot_start := current_date + (hour * interval '1 hour');
    slot_end := slot_start + interval '1 hour';
    
    INSERT INTO slots (turf_id, start_time, end_time, price, status)
    VALUES (
      xyz_turf_id,
      slot_start,
      slot_end,
      150000, -- 1500 rupees in paise
      CASE 
        WHEN hour BETWEEN 18 AND 20 THEN 'booked'
        ELSE 'available'
      END
    );
  END LOOP;
  
  -- Insert slots for ABC Sports (today)
  FOR hour IN 5..22 LOOP
    slot_start := current_date + (hour * interval '1 hour');
    slot_end := slot_start + interval '1 hour';
    
    INSERT INTO slots (turf_id, start_time, end_time, price, status)
    VALUES (
      abc_sports_id,
      slot_start,
      slot_end,
      200000, -- 2000 rupees in paise
      CASE 
        WHEN hour BETWEEN 17 AND 19 THEN 'booked'
        WHEN hour BETWEEN 20 AND 21 THEN 'blocked'
        ELSE 'available'
      END
    );
  END LOOP;
  
  -- Insert slots for Play Arena (today)
  FOR hour IN 7..20 LOOP
    slot_start := current_date + (hour * interval '1 hour');
    slot_end := slot_start + interval '1 hour';
    
    INSERT INTO slots (turf_id, start_time, end_time, price, status)
    VALUES (
      play_arena_id,
      slot_start,
      slot_end,
      100000, -- 1000 rupees in paise
      CASE 
        WHEN hour BETWEEN 16 AND 18 THEN 'booked'
        ELSE 'available'
      END
    );
  END LOOP;
END $$;