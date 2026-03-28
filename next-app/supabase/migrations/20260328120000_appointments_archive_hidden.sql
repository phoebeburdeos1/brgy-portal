-- Archived completed appointments; hidden = soft-delete (row kept in DB, hidden from UI)
ALTER TABLE appointments ADD COLUMN IF NOT EXISTS archived BOOLEAN NOT NULL DEFAULT FALSE;
ALTER TABLE appointments ADD COLUMN IF NOT EXISTS hidden BOOLEAN NOT NULL DEFAULT FALSE;
