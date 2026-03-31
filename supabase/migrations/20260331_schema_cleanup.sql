-- Schema Cleanup: Drop tags column, migrate categories
-- Run this migration AFTER backing up the skills table:
-- CREATE TABLE skills_backup_20260330 AS SELECT * FROM skills;

-- 1. Drop tags column (no longer used in code)
ALTER TABLE skills DROP COLUMN IF EXISTS tags;

-- 2. Migrate categories (map old to new)
-- WARNING: Review these mappings against your actual data before running.
-- Check with: SELECT DISTINCT category FROM skills;

UPDATE skills SET category = 'Web Design' WHERE category IN ('Paper', 'Minimal SaaS', 'Brutalist');
UPDATE skills SET category = 'Product Design' WHERE category IN ('Soft Dashboard', 'Bento Product');
UPDATE skills SET category = 'Typography' WHERE category IN ('Editorial', 'Docs-Focused');
UPDATE skills SET category = 'Branding' WHERE category IN ('Enterprise', 'Pricing-Page-Focused');
UPDATE skills SET category = 'Illustration' WHERE category = 'Premium Dark';

-- 3. Verify no unmapped categories remain
-- Run: SELECT DISTINCT category FROM skills;
-- Should return only: Branding, Illustration, Mobile, Product Design, Typography, Web Design

-- 4. Add index on category for filtering performance
CREATE INDEX IF NOT EXISTS idx_skills_category ON skills(category) WHERE status = 'published';
