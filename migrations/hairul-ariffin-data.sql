-- Hairul Ariffin Data Entry Migration
-- Run this in Supabase SQL Editor
--
-- Hairul Ariffin Enterprise - Car rental (Perodua Bezza) since Sep 2023
-- 20 disbursements totaling RM28,000:
--   20x RM1,400 monthly rental (Jul 2024 - Feb 2026)
-- 0 payments

DO $$
DECLARE
  v_user_id uuid := 'e6b9dab8-147d-4727-83a8-edba4ac90955';
  v_creditor_id uuid;
  v_loan_id uuid;
BEGIN

  -- ============================================
  -- 1. Create Creditor: Hairul Ariffin
  -- ============================================
  INSERT INTO creditors (id, user_id, name, notes)
  VALUES (
    gen_random_uuid(),
    v_user_id,
    'Hairul Ariffin',
    'Hairul Ariffin Enterprise. Car rental - Perodua Bezza RM1,400/month since Sep 2023. Payments stopped after Jun 2024.'
  )
  RETURNING id INTO v_creditor_id;

  -- ============================================
  -- 2. Loan — Car Rental Arrears (principal = 0, tracked via disbursements)
  -- ============================================
  INSERT INTO loans (id, user_id, creditor_id, principal, interest_rate, interest_type, accrual_frequency, loan_date, status, notes)
  VALUES (
    gen_random_uuid(),
    v_user_id,
    v_creditor_id,
    0,
    0,
    'simple',
    'monthly',
    '2024-07-01',
    'active',
    'Unpaid car rental (Perodua Bezza) from Jul 2024 onwards. See disbursements for breakdown.'
  )
  RETURNING id INTO v_loan_id;

  -- ============================================
  -- 3. Disbursements (Amounts owed TO Hairul Ariffin)
  --    20x monthly rental @ RM1,400 (Jul 2024 - Feb 2026)
  -- ============================================
  INSERT INTO disbursements (user_id, loan_id, amount, disbursement_date, notes) VALUES
    (v_user_id, v_loan_id, 1400.00, '2024-07-01', 'Monthly rental - July 2024'),
    (v_user_id, v_loan_id, 1400.00, '2024-08-01', 'Monthly rental - August 2024'),
    (v_user_id, v_loan_id, 1400.00, '2024-09-01', 'Monthly rental - September 2024'),
    (v_user_id, v_loan_id, 1400.00, '2024-10-01', 'Monthly rental - October 2024'),
    (v_user_id, v_loan_id, 1400.00, '2024-11-01', 'Monthly rental - November 2024'),
    (v_user_id, v_loan_id, 1400.00, '2024-12-01', 'Monthly rental - December 2024'),
    (v_user_id, v_loan_id, 1400.00, '2025-01-01', 'Monthly rental - January 2025'),
    (v_user_id, v_loan_id, 1400.00, '2025-02-01', 'Monthly rental - February 2025'),
    (v_user_id, v_loan_id, 1400.00, '2025-03-01', 'Monthly rental - March 2025'),
    (v_user_id, v_loan_id, 1400.00, '2025-04-01', 'Monthly rental - April 2025'),
    (v_user_id, v_loan_id, 1400.00, '2025-05-01', 'Monthly rental - May 2025'),
    (v_user_id, v_loan_id, 1400.00, '2025-06-01', 'Monthly rental - June 2025'),
    (v_user_id, v_loan_id, 1400.00, '2025-07-01', 'Monthly rental - July 2025'),
    (v_user_id, v_loan_id, 1400.00, '2025-08-01', 'Monthly rental - August 2025'),
    (v_user_id, v_loan_id, 1400.00, '2025-09-01', 'Monthly rental - September 2025'),
    (v_user_id, v_loan_id, 1400.00, '2025-10-01', 'Monthly rental - October 2025'),
    (v_user_id, v_loan_id, 1400.00, '2025-11-01', 'Monthly rental - November 2025'),
    (v_user_id, v_loan_id, 1400.00, '2025-12-01', 'Monthly rental - December 2025'),
    (v_user_id, v_loan_id, 1400.00, '2026-01-01', 'Monthly rental - January 2026'),
    (v_user_id, v_loan_id, 1400.00, '2026-02-01', 'Monthly rental - February 2026');

  -- ============================================
  -- 4. Payments (none yet)
  -- ============================================
  -- No payments recorded

  RAISE NOTICE 'Hairul Ariffin data inserted successfully.';
  RAISE NOTICE 'Creditor ID: %', v_creditor_id;
  RAISE NOTICE 'Loan ID: %', v_loan_id;

END $$;
