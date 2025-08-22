-- Recreate the centers table with explicit schema
CREATE TABLE centers (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert sample centers data
INSERT INTO centers (id, name, email) VALUES
  ('thrissur', 'SLA-Thrissur Center', 'thrissur@sla.com'),
  ('chalakudy', 'SLA-Chalakudy Center', 'chalakudy@sla.com'),
  ('peravoor', 'SLA-Peravoor Center', 'peravoor@sla.com');

-- Verify centers data
SELECT * FROM centers;

-- Create registrations table with explicit references
CREATE TABLE registrations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  date_of_birth DATE NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  address TEXT NOT NULL,
  parent_name TEXT NOT NULL,
  parent_contact TEXT NOT NULL,
  aadhaar_number TEXT NOT NULL,
  center TEXT NOT NULL REFERENCES centers(id),
  course_level TEXT NOT NULL,
  photo_path TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Test inserting a registration to verify foreign key constraint
INSERT INTO registrations (
  first_name, last_name, date_of_birth, email, phone, 
  address, parent_name, parent_contact, aadhaar_number, 
  center, course_level, photo_path
) VALUES (
  'John', 'Doe', '2000-01-01', 'john@example.com', '1234567890',
  '123 Test Street', 'Jane Doe', '9876543210', '123456789012',
  'thrissur', 'Beginner', '/path/to/photo.jpg'
);

-- 4. Create indexes and unique constraints for better performance and data integrity
CREATE INDEX IF NOT EXISTS idx_registrations_center ON registrations(center);
CREATE INDEX IF NOT EXISTS idx_registrations_created_at ON registrations(created_at);
CREATE UNIQUE INDEX IF NOT EXISTS idx_registrations_email_unique ON registrations(email);
CREATE UNIQUE INDEX IF NOT EXISTS idx_registrations_phone_unique ON registrations(phone);

-- 5. Enable Row Level Security (RLS)
ALTER TABLE centers ENABLE ROW LEVEL SECURITY;
ALTER TABLE registrations ENABLE ROW LEVEL SECURITY;

-- 6. Create RLS policies for centers (allow read access)
CREATE POLICY "Allow public read access to centers" ON centers
  FOR SELECT USING (true);

-- 7. Create RLS policies for registrations (allow insert only)
CREATE POLICY "Allow public insert to registrations" ON registrations
  FOR INSERT WITH CHECK (true);

-- 8. Create storage bucket for photos (run this separately in Supabase dashboard)
-- Go to Storage > Create Bucket
-- Name: photos
-- Public: false (private)
-- File size limit: 5MB
-- Allowed MIME types: image/jpeg, image/jpg, image/png, image/webp

-- 9. Create storage policy for photos
-- Go to Storage > photos bucket > Policies
-- Create policy: "Allow authenticated uploads"
-- Operation: INSERT
-- Policy: (auth.role() = 'service_role' OR auth.role() = 'authenticated')

-- Verification queries (run these to check setup)
-- SELECT * FROM centers;
-- SELECT COUNT(*) FROM registrations;
-- \d registrations  -- Shows table structure
