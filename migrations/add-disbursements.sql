-- Migration: Add disbursements table
-- Run this in Supabase SQL Editor

-- 1. Create disbursements table
create table disbursements (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  loan_id uuid not null references loans(id) on delete cascade,
  amount numeric(12,2) not null,
  disbursement_date date not null default current_date,
  notes text,
  created_at timestamptz not null default now()
);

-- 2. Enable RLS
alter table disbursements enable row level security;

-- 3. RLS policy
create policy "Users can manage their own disbursements"
  on disbursements for all using (auth.uid() = user_id);

-- 4. Index
create index idx_disbursements_loan on disbursements(loan_id);

-- 5. Backfill: create a disbursement record for every existing loan
insert into disbursements (user_id, loan_id, amount, disbursement_date, notes)
select user_id, id, principal, loan_date, 'Initial disbursement (backfill)'
from loans;
