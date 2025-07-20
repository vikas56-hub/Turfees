-- Function to automatically release slots for expired bookings
CREATE OR REPLACE FUNCTION release_expired_bookings()
RETURNS TRIGGER AS $$
BEGIN
  -- Find bookings that are pending and older than 15 minutes
  UPDATE bookings
  SET status = 'cancelled'
  WHERE status = 'pending'
    AND created_at < NOW() - INTERVAL '15 minutes';
  
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Create a trigger that runs every minute to check for expired bookings
DROP TRIGGER IF EXISTS check_expired_bookings ON bookings;
CREATE TRIGGER check_expired_bookings
AFTER INSERT ON bookings
EXECUTE FUNCTION release_expired_bookings();