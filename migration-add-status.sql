-- Migration script to add status column to existing registrations table
-- Run this if you already have a registrations table without the status column

-- Add status column to existing registrations table
ALTER TABLE registrations 
ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'pending' 
CHECK (status IN ('pending', 'accepted', 'rejected', 'enquired'));

-- Create index for status column
CREATE INDEX IF NOT EXISTS idx_registrations_status ON registrations(status);

-- Update existing records to have 'pending' status if they don't have one
UPDATE registrations 
SET status = 'pending' 
WHERE status IS NULL;
