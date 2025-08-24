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

-- Create course_levels table for standardized course levels
CREATE TABLE course_levels (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  display_order INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert standardized course levels
INSERT INTO course_levels (id, name, description, display_order) VALUES
  ('a1', 'A1', 'Beginner', 1),
  ('a2', 'A2', 'Elementary', 2),
  ('b1', 'B1', 'Intermediate', 3),
  ('b2', 'B2', 'Upper Intermediate', 4);

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
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected', 'enquired')),
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
CREATE INDEX IF NOT EXISTS idx_registrations_status ON registrations(status);
CREATE UNIQUE INDEX IF NOT EXISTS idx_registrations_email_unique ON registrations(email);
CREATE UNIQUE INDEX IF NOT EXISTS idx_registrations_phone_unique ON registrations(phone);

-- 5. Enable Row Level Security (RLS)
ALTER TABLE centers ENABLE ROW LEVEL SECURITY;
ALTER TABLE registrations ENABLE ROW LEVEL SECURITY;

-- 6. Create RLS policies for centers-- Allow public read access to centers
CREATE POLICY "Allow public read access to centers" ON centers
  FOR SELECT USING (true);

-- Enable RLS for course_levels and allow public read access
ALTER TABLE course_levels ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read access to course_levels" ON course_levels
  FOR SELECT USING (true);

-- 7. Create admin_users table for institution admins
CREATE TABLE admin_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL UNIQUE,
  center_id TEXT NOT NULL REFERENCES centers(id),
  role TEXT NOT NULL DEFAULT 'admin' CHECK (role IN ('admin', 'super_admin')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert admin users for each center
INSERT INTO admin_users (email, center_id, role) VALUES
  ('thrissur@sla.com', 'thrissur', 'admin'),
  ('chalakudy@sla.com', 'chalakudy', 'admin'),
  ('peravoor@sla.com', 'peravoor', 'admin'),
  ('superadmin@sla.com', 'thrissur', 'super_admin');

-- Enable RLS for admin_users
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- 8. Create audit_logs table for tracking changes
CREATE TABLE audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  table_name TEXT NOT NULL,
  record_id UUID NOT NULL,
  action TEXT NOT NULL CHECK (action IN ('INSERT', 'UPDATE', 'DELETE')),
  old_data JSONB,
  new_data JSONB,
  admin_email TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- 9. Create RLS policies for registrations
-- Allow admins to see only their center's students
CREATE POLICY "Admin can view own center registrations" ON registrations
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM admin_users 
      WHERE admin_users.email = auth.jwt() ->> 'email' 
      AND (admin_users.center_id = registrations.center OR admin_users.role = 'super_admin')
    )
  );

-- Allow admins to insert registrations for their center
CREATE POLICY "Admin can insert to own center" ON registrations
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM admin_users 
      WHERE admin_users.email = auth.jwt() ->> 'email' 
      AND (admin_users.center_id = registrations.center OR admin_users.role = 'super_admin')
    )
  );

-- Allow admins to update registrations for their center
CREATE POLICY "Admin can update own center registrations" ON registrations
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM admin_users 
      WHERE admin_users.email = auth.jwt() ->> 'email' 
      AND (admin_users.center_id = registrations.center OR admin_users.role = 'super_admin')
    )
  );

-- Allow admins to delete registrations for their center
CREATE POLICY "Admin can delete own center registrations" ON registrations
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM admin_users 
      WHERE admin_users.email = auth.jwt() ->> 'email' 
      AND (admin_users.center_id = registrations.center OR admin_users.role = 'super_admin')
    )
  );

-- Allow public insert to registrations (for student registration form)
CREATE POLICY "Allow public insert to registrations" ON registrations
  FOR INSERT WITH CHECK (true);

-- 10. Create RLS policies for admin_users
CREATE POLICY "Admin can view own record" ON admin_users
  FOR SELECT USING (email = auth.jwt() ->> 'email');

-- 11. Create RLS policies for audit_logs
CREATE POLICY "Admin can view own audit logs" ON audit_logs
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM admin_users 
      WHERE admin_users.email = auth.jwt() ->> 'email' 
      AND (admin_users.center_id IN (
        SELECT center FROM registrations WHERE id = audit_logs.record_id::UUID
      ) OR admin_users.role = 'super_admin')
    )
  );

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
