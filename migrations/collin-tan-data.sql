-- Collin Tan Data Entry Migration
-- Run this in Supabase SQL Editor AFTER add-token-arrangement.sql
--
-- IMPORTANT: Replace 'YOUR_USER_ID' with your actual auth.users UUID
-- You can find it in Supabase Dashboard > Authentication > Users

DO $$
DECLARE
  v_user_id uuid := 'e6b9dab8-147d-4727-83a8-edba4ac90955';
  v_creditor_id uuid;
  v_loan_token_id uuid;
  v_loan_macbook_id uuid;
  v_loan_cash_id uuid;
BEGIN

  -- ============================================
  -- 1. Create Creditor: Collin Tan
  -- ============================================
  INSERT INTO creditors (id, user_id, name, notes, token_arrangement)
  VALUES (
    gen_random_uuid(),
    v_user_id,
    'Collin Tan',
    'Business partner. 3 loan categories: token loan ($13k offset by 30k DIGau), MacBook ($2,288.05), and ongoing cash advances.',
    '{"cmc_slug": "dignity-gold", "symbol": "DIGau", "amount": 30000, "label": "Offset for S$13,000 initial loan"}'::jsonb
  )
  RETURNING id INTO v_creditor_id;

  -- ============================================
  -- 2. Loan 1 — Token Loan: S$13,000
  -- ============================================
  INSERT INTO loans (id, user_id, creditor_id, principal, interest_rate, interest_type, accrual_frequency, loan_date, status, notes)
  VALUES (
    gen_random_uuid(),
    v_user_id,
    v_creditor_id,
    13000.00,
    0,
    'simple',
    'monthly',
    '2023-11-01',
    'active',
    'Initial loan converted to 30,000 DIGau tokens. Token value offsets this balance.'
  )
  RETURNING id INTO v_loan_token_id;

  -- ============================================
  -- 3. Loan 2 — MacBook: S$2,288.05
  -- ============================================
  INSERT INTO loans (id, user_id, creditor_id, principal, interest_rate, interest_type, accrual_frequency, loan_date, status, notes)
  VALUES (
    gen_random_uuid(),
    v_user_id,
    v_creditor_id,
    2288.05,
    0,
    'simple',
    'monthly',
    '2023-11-01',
    'active',
    'MacBook company purchase.'
  )
  RETURNING id INTO v_loan_macbook_id;

  -- ============================================
  -- 4. Loan 3 — Cash Advances (principal = sum of all disbursements)
  --    We set principal to 0 and use disbursements table instead
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
    '2024-08-04',
    'active',
    'Ongoing cash advances and loans. See disbursements for individual amounts.'
  )
  RETURNING id INTO v_loan_cash_id;

  -- ============================================
  -- 5. Disbursements for Loan 3 (Cash Advances)
  -- ============================================

  -- 2024 Disbursements
  INSERT INTO disbursements (user_id, loan_id, amount, disbursement_date, notes) VALUES
    (v_user_id, v_loan_cash_id, 500.00,  '2024-08-04', NULL),
    (v_user_id, v_loan_cash_id, 500.00,  '2024-08-09', NULL),
    (v_user_id, v_loan_cash_id, 500.00,  '2024-08-20', NULL),
    (v_user_id, v_loan_cash_id, 500.00,  '2024-08-25', NULL),
    (v_user_id, v_loan_cash_id, 500.00,  '2024-08-30', NULL),
    (v_user_id, v_loan_cash_id, 500.00,  '2024-09-03', NULL),
    (v_user_id, v_loan_cash_id, 1000.00, '2024-09-11', NULL),
    (v_user_id, v_loan_cash_id, 500.00,  '2024-09-22', NULL),
    (v_user_id, v_loan_cash_id, 200.00,  '2024-09-28', NULL),
    (v_user_id, v_loan_cash_id, 300.00,  '2024-10-02', NULL),
    (v_user_id, v_loan_cash_id, 500.00,  '2024-10-08', NULL),
    (v_user_id, v_loan_cash_id, 150.00,  '2024-10-24', NULL),
    (v_user_id, v_loan_cash_id, 350.00,  '2024-10-28', NULL),
    (v_user_id, v_loan_cash_id, 1500.00, '2024-11-06', NULL),
    (v_user_id, v_loan_cash_id, 300.00,  '2024-11-20', NULL),
    (v_user_id, v_loan_cash_id, 1200.00, '2024-11-21', NULL),
    (v_user_id, v_loan_cash_id, 700.00,  '2024-12-03', NULL),
    (v_user_id, v_loan_cash_id, 100.00,  '2024-12-29', NULL),
    (v_user_id, v_loan_cash_id, 400.00,  '2024-12-31', NULL);

  -- 2025 Disbursements
  INSERT INTO disbursements (user_id, loan_id, amount, disbursement_date, notes) VALUES
    (v_user_id, v_loan_cash_id, 1000.00,  '2025-01-09', NULL),
    (v_user_id, v_loan_cash_id, 500.00,   '2025-02-12', NULL),
    (v_user_id, v_loan_cash_id, 500.00,   '2025-02-14', NULL),
    (v_user_id, v_loan_cash_id, 500.00,   '2025-02-24', NULL),
    (v_user_id, v_loan_cash_id, 1000.00,  '2025-03-07', NULL),
    (v_user_id, v_loan_cash_id, 200.00,   '2025-03-26', NULL),
    (v_user_id, v_loan_cash_id, 500.00,   '2025-03-27', NULL),
    (v_user_id, v_loan_cash_id, 10000.00, '2025-03-30', NULL),
    (v_user_id, v_loan_cash_id, 300.00,   '2025-04-23', NULL),
    (v_user_id, v_loan_cash_id, 500.00,   '2025-06-04', NULL),
    (v_user_id, v_loan_cash_id, 3000.00,  '2025-06-08', NULL),
    (v_user_id, v_loan_cash_id, 500.00,   '2025-06-17', NULL),
    (v_user_id, v_loan_cash_id, 1000.00,  '2025-08-12', NULL),
    (v_user_id, v_loan_cash_id, 1000.00,  '2025-09-02', NULL),
    (v_user_id, v_loan_cash_id, 500.00,   '2025-10-02', NULL),
    (v_user_id, v_loan_cash_id, 1000.00,  '2025-10-31', NULL),
    (v_user_id, v_loan_cash_id, 100.00,   '2025-11-15', NULL),
    (v_user_id, v_loan_cash_id, 350.00,   '2025-11-22', NULL),
    (v_user_id, v_loan_cash_id, 500.00,   '2025-12-12', NULL),
    (v_user_id, v_loan_cash_id, 300.00,   '2025-12-22', NULL);

  -- 2026 Disbursements
  INSERT INTO disbursements (user_id, loan_id, amount, disbursement_date, notes) VALUES
    (v_user_id, v_loan_cash_id, 744.00, '2026-01-06', 'Tax payment'),
    (v_user_id, v_loan_cash_id, 500.00, '2026-01-18', NULL);

  -- ============================================
  -- 6. Payments (Repayments) for Loan 3
  -- ============================================
  INSERT INTO payments (user_id, loan_id, amount, payment_date, notes) VALUES
    (v_user_id, v_loan_cash_id, 1200.00, '2024-11-27', 'Repayment received'),
    (v_user_id, v_loan_cash_id, 1500.00, '2025-01-15', 'Repayment received'),
    (v_user_id, v_loan_cash_id, 3450.00, '2025-06-09', 'Repayment received'),
    (v_user_id, v_loan_cash_id, 1000.00, '2025-06-20', 'Repayment received');

  RAISE NOTICE 'Collin Tan data inserted successfully.';
  RAISE NOTICE 'Creditor ID: %', v_creditor_id;
  RAISE NOTICE 'Token Loan ID: %', v_loan_token_id;
  RAISE NOTICE 'MacBook Loan ID: %', v_loan_macbook_id;
  RAISE NOTICE 'Cash Advances Loan ID: %', v_loan_cash_id;

END $$;
