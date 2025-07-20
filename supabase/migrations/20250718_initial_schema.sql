-- Create tables for Turfees booking platform

-- Turfs table
CREATE TABLE turfs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  google_place_id TEXT,
  name TEXT NOT NULL,
  description TEXT,
  photos TEXT[] DEFAULT '{}',
  owner_id UUID REFERENCES auth.users(id),
  base_price INTEGER NOT NULL, -- in paise
  amenities TEXT[] DEFAULT '{}',
  location POINT,
  open_hours JSONB, -- {mon: {start: "06:00", end: "22:00"}, ...}
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Slots table
CREATE TABLE slots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  turf_id UUID REFERENCES turfs(id) ON DELETE CASCADE,
  start_time TIMESTAMPTZ NOT NULL,
  end_time TIMESTAMPTZ NOT NULL,
  price INTEGER NOT NULL, -- in paise
  status TEXT CHECK (status IN ('available', 'booked', 'blocked')) DEFAULT 'available',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(turf_id, start_time)
);

-- Bookings table
CREATE TABLE bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slot_id UUID REFERENCES slots(id),
  user_id UUID REFERENCES auth.users(id),
  stripe_session_id TEXT UNIQUE,
  amount INTEGER NOT NULL, -- in paise
  status TEXT CHECK (status IN ('pending', 'confirmed', 'cancelled')) DEFAULT 'pending',
  qr_secret TEXT UNIQUE DEFAULT gen_random_uuid()::TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Reviews table
CREATE TABLE reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id UUID REFERENCES bookings(id),
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Set up Row Level Security policies

-- Public read access for turfs and slots
ALTER TABLE turfs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Turfs are publicly readable" ON turfs FOR SELECT USING (true);
CREATE POLICY "Owners can manage their turfs" ON turfs FOR ALL USING (auth.uid() = owner_id);

ALTER TABLE slots ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Slots are publicly readable" ON slots FOR SELECT USING (true);
CREATE POLICY "Owners can manage their slots" ON slots FOR ALL USING (
  auth.uid() IN (SELECT owner_id FROM turfs WHERE id = turf_id)
);

-- Bookings require authentication
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their bookings" ON bookings FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create bookings" ON bookings FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Owners can view bookings for their turfs" ON bookings FOR SELECT USING (
  auth.uid() IN (SELECT owner_id FROM turfs WHERE id IN (SELECT turf_id FROM slots WHERE id = slot_id))
);

-- Reviews require authentication
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view all reviews" ON reviews FOR SELECT USING (true);
CREATE POLICY "Users can create reviews for their bookings" ON reviews FOR INSERT WITH CHECK (
  auth.uid() IN (SELECT user_id FROM bookings WHERE id = booking_id)
);

-- Create functions and triggers for real-time updates

-- Function to update slot status when a booking is created or updated
CREATE OR REPLACE FUNCTION update_slot_status()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'confirmed' THEN
    UPDATE slots SET status = 'booked' WHERE id = NEW.slot_id;
  ELSIF NEW.status = 'cancelled' AND OLD.status = 'confirmed' THEN
    UPDATE slots SET status = 'available' WHERE id = NEW.slot_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update slot status when a booking is created or updated
CREATE TRIGGER booking_status_change
AFTER INSERT OR UPDATE OF status ON bookings
FOR EACH ROW
EXECUTE FUNCTION update_slot_status();

-- Function to update turf updated_at when related data changes
CREATE OR REPLACE FUNCTION update_turf_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE turfs SET updated_at = NOW() WHERE id = NEW.turf_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update turf updated_at when a slot is created or updated
CREATE TRIGGER slot_change
AFTER INSERT OR UPDATE ON slots
FOR EACH ROW
EXECUTE FUNCTION update_turf_timestamp();

-- Enable Realtime for slots table
ALTER PUBLICATION supabase_realtime ADD TABLE slots;