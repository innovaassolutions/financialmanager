-- Financial Manager Database Schema
-- Run this in Supabase SQL Editor

-- Enable UUID generation
create extension if not exists "pgcrypto";

-- Creditors table
create table creditors (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  email text,
  phone text,
  notes text,
  access_token text not null unique default encode(gen_random_bytes(32), 'hex'),
  telegram_chat_id text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Loans table
create table loans (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  creditor_id uuid not null references creditors(id) on delete cascade,
  principal numeric(12,2) not null,
  interest_rate numeric(5,2) not null default 0,
  interest_type text not null default 'simple' check (interest_type in ('simple', 'compound')),
  accrual_frequency text not null default 'monthly' check (accrual_frequency in ('daily', 'monthly')),
  loan_date date not null default current_date,
  due_date date,
  status text not null default 'active' check (status in ('active', 'paid_off', 'defaulted')),
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Payments table
create table payments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  loan_id uuid not null references loans(id) on delete cascade,
  amount numeric(12,2) not null,
  payment_date date not null default current_date,
  notes text,
  created_at timestamptz not null default now()
);

-- Interest accruals table
create table interest_accruals (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  loan_id uuid not null references loans(id) on delete cascade,
  amount numeric(12,2) not null,
  accrual_date date not null default current_date,
  interest_type text not null check (interest_type in ('simple', 'compound')),
  is_manual boolean not null default false,
  created_at timestamptz not null default now()
);

-- Chat history table
create table chat_history (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  role text not null check (role in ('user', 'assistant')),
  content text not null,
  metadata jsonb,
  created_at timestamptz not null default now()
);

-- Helper function: get loan balance
create or replace function get_loan_balance(p_loan_id uuid)
returns numeric as $$
declare
  v_principal numeric;
  v_total_interest numeric;
  v_total_payments numeric;
begin
  select principal into v_principal from loans where id = p_loan_id;

  select coalesce(sum(amount), 0) into v_total_interest
  from interest_accruals where loan_id = p_loan_id;

  select coalesce(sum(amount), 0) into v_total_payments
  from payments where loan_id = p_loan_id;

  return v_principal + v_total_interest - v_total_payments;
end;
$$ language plpgsql security definer;

-- Row Level Security
alter table creditors enable row level security;
alter table loans enable row level security;
alter table payments enable row level security;
alter table interest_accruals enable row level security;
alter table chat_history enable row level security;

-- RLS policies
create policy "Users can manage their own creditors"
  on creditors for all using (auth.uid() = user_id);

create policy "Users can manage their own loans"
  on loans for all using (auth.uid() = user_id);

create policy "Users can manage their own payments"
  on payments for all using (auth.uid() = user_id);

create policy "Users can manage their own interest accruals"
  on interest_accruals for all using (auth.uid() = user_id);

create policy "Users can manage their own chat history"
  on chat_history for all using (auth.uid() = user_id);

-- Indexes
create index idx_loans_creditor on loans(creditor_id);
create index idx_loans_status on loans(status);
create index idx_payments_loan on payments(loan_id);
create index idx_interest_accruals_loan on interest_accruals(loan_id);
create index idx_creditors_access_token on creditors(access_token);
create index idx_chat_history_user on chat_history(user_id, created_at);

-- Updated_at trigger
create or replace function update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger update_creditors_updated_at
  before update on creditors
  for each row execute function update_updated_at_column();

create trigger update_loans_updated_at
  before update on loans
  for each row execute function update_updated_at_column();
