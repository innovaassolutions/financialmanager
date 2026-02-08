import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { calculateInterestAccrual, shouldAccrueToday } from '@/lib/utils/interest';
import type { InterestType, AccrualFrequency } from '@/types/database';

export async function GET(request: Request) {
  // Verify cron secret
  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const supabase = createAdminClient();
  const today = new Date();

  // Fetch all active loans
  const { data: loans, error: loansError } = await supabase
    .from('loans')
    .select('*')
    .eq('status', 'active')
    .gt('interest_rate', 0);

  if (loansError) {
    return NextResponse.json({ error: loansError.message }, { status: 500 });
  }

  if (!loans || loans.length === 0) {
    return NextResponse.json({ message: 'No active loans with interest' });
  }

  let accrued = 0;

  for (const loan of loans) {
    // Check last accrual date for this loan
    const { data: lastAccrual } = await supabase
      .from('interest_accruals')
      .select('accrual_date')
      .eq('loan_id', loan.id)
      .order('accrual_date', { ascending: false })
      .limit(1)
      .single();

    const shouldAccrue = shouldAccrueToday(
      loan.accrual_frequency as AccrualFrequency,
      lastAccrual?.accrual_date ?? null,
      today,
    );

    if (!shouldAccrue) continue;

    // Calculate outstanding balance for compound interest
    const [paymentsRes, interestRes] = await Promise.all([
      supabase
        .from('payments')
        .select('amount')
        .eq('loan_id', loan.id),
      supabase
        .from('interest_accruals')
        .select('amount')
        .eq('loan_id', loan.id),
    ]);

    const totalPayments = (paymentsRes.data ?? []).reduce(
      (sum, p) => sum + Number(p.amount),
      0,
    );
    const totalInterest = (interestRes.data ?? []).reduce(
      (sum, i) => sum + Number(i.amount),
      0,
    );
    const outstandingBalance = Number(loan.principal) + totalInterest - totalPayments;

    if (outstandingBalance <= 0) continue;

    const amount = calculateInterestAccrual({
      principal: Number(loan.principal),
      rate: Number(loan.interest_rate),
      interestType: loan.interest_type as InterestType,
      frequency: loan.accrual_frequency as AccrualFrequency,
      outstandingBalance,
    });

    if (amount <= 0) continue;

    await supabase.from('interest_accruals').insert({
      user_id: loan.user_id,
      loan_id: loan.id,
      amount,
      accrual_date: today.toISOString().split('T')[0],
      interest_type: loan.interest_type,
      is_manual: false,
    });

    accrued++;
  }

  return NextResponse.json({
    message: `Interest accrued for ${accrued} loan(s)`,
    date: today.toISOString().split('T')[0],
  });
}
