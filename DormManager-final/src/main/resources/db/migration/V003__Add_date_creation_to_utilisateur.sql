-- Add date_creation column to utilisateur table
ALTER TABLE utilisateur ADD COLUMN date_creation DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP;
