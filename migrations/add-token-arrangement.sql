-- Add token_arrangement column to creditors table
-- Run this in Supabase SQL Editor

ALTER TABLE creditors
ADD COLUMN IF NOT EXISTS token_arrangement jsonb;

-- token_arrangement format:
-- {
--   "cmc_slug": "dignity-gold",
--   "symbol": "DIGau",
--   "amount": 30000,
--   "label": "Offset for $13,000 initial loan"
-- }
