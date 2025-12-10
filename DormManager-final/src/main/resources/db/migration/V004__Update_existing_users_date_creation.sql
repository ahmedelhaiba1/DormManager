-- Update all existing utilisateur records to have date_creation set to December 1, 2025
UPDATE utilisateur SET date_creation = '2025-12-01 00:00:00' WHERE date_creation IS NULL;
