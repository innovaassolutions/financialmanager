-- Dave Acton Data Entry Migration
-- Run this in Supabase SQL Editor
--
-- Data extracted from Wise transaction history (9 Feb 2025 - 9 Feb 2026)
-- 8 disbursements totaling S$11,500 | 1 repayment of S$500
-- Outstanding balance: S$11,000

DO $$
DECLARE
  v_user_id uuid := 'e6b9dab8-147d-4727-83a8-edba4ac90955';
  v_creditor_id uuid;
  v_loan_id uuid;
BEGIN

  -- ============================================
  -- 1. Create Creditor: Dave Acton
  -- ============================================
  INSERT INTO creditors (id, user_id, name, notes)
  VALUES (
    gen_random_uuid(),
    v_user_id,
    'Dave Acton',
    'Personal loans via Wise transfers. Single loan tracked via disbursements.'
  )
  RETURNING id INTO v_creditor_id;

  -- ============================================
  -- 2. Loan — Cash Advances (principal = sum of all disbursements)
  --    Principal set to 0, tracked via disbursements table
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
    '2025-05-04',
    'active',
    'Cash advances via Wise transfers. See disbursements for individual amounts.'
  )
  RETURNING id INTO v_loan_id;

  -- ============================================
  -- 3. Disbursements (Money received FROM Dave Acton)
  -- ============================================
  INSERT INTO disbursements (user_id, loan_id, amount, disbursement_date, notes) VALUES
    (v_user_id, v_loan_id, 1000.00, '2025-05-04', 'TRANSFER-1524464143'),
    (v_user_id, v_loan_id, 500.00,  '2025-05-05', 'TRANSFER-1526367748'),
    (v_user_id, v_loan_id, 3000.00, '2025-05-10', 'TRANSFER-1533474633'),
    (v_user_id, v_loan_id, 1000.00, '2025-05-17', 'TRANSFER-1543241939'),
    (v_user_id, v_loan_id, 4500.00, '2025-05-21', 'TRANSFER-1548061831'),
    (v_user_id, v_loan_id, 500.00,  '2025-09-25', 'TRANSFER-1738157699'),
    (v_user_id, v_loan_id, 500.00,  '2025-11-14', 'TRANSFER-1819850209'),
    (v_user_id, v_loan_id, 500.00,  '2025-11-29', 'TRANSFER-1843332446');

  -- ============================================
  -- 4. Payments (Repayments TO Dave Acton)
  -- ============================================
  INSERT INTO payments (user_id, loan_id, amount, payment_date, notes) VALUES
    (v_user_id, v_loan_id, 500.00, '2025-11-18', 'TRANSFER-1826051680');

  RAISE NOTICE 'Dave Acton data inserted successfully.';
  RAISE NOTICE 'Creditor ID: %', v_creditor_id;
  RAISE NOTICE 'Loan ID: %', v_loan_id;

END $$;
