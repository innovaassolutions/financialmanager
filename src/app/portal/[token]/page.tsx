import { createAdminClient } from '@/lib/supabase/admin';
import { notFound } from 'next/navigation';
import { PortalHeader } from '@/components/portal/portal-header';
import { LoanSummary } from '@/components/portal/loan-summary';
import { PortalPaymentHistory } from '@/components/portal/payment-history';

interface Props {
  params: Promise<{ token: string }>;
}

export default async function PortalPage({ params }: Props) {
  const { token } = await params;
  const supabase = createAdminClient();

  // Look up creditor by access token
  const { data: creditor } = await supabase
    .from('creditors')
    .select('*')
    .eq('access_token', token)
    .single();

  if (!creditor) notFound();

  // Get all loans for this creditor
  const { data: loans } = await supabase
    .from('loans')
    .select('*')
    .eq('creditor_id', creditor.id)
    .order('loan_date', { ascending: false });

  const loanList = loans ?? [];

  // Get payments and interest for each loan
  const loanIds = loanList.map((l) => l.id);

  const [paymentsRes, interestRes] = await Promise.all([
    supabase
      .from('payments')
      .select('*')
      .in('loan_id', loanIds.length > 0 ? loanIds : ['_none_'])
      .order('payment_date', { ascending: false }),
    supabase
      .from('interest_accruals')
      .select('*')
      .in('loan_id', loanIds.length > 0 ? loanIds : ['_none_']),
  ]);

  const payments = paymentsRes.data ?? [];
  const interestAccruals = interestRes.data ?? [];

  // Calculate totals per loan
  const loansWithTotals = loanList.map((loan) => {
    const loanPayments = payments.filter((p) => p.loan_id === loan.id);
    const loanInterest = interestAccruals.filter((i) => i.loan_id === loan.id);
    const totalPaid = loanPayments.reduce((sum, p) => sum + Number(p.amount), 0);
    const totalInterest = loanInterest.reduce((sum, i) => sum + Number(i.amount), 0);
    const balance = Number(loan.principal) + totalInterest - totalPaid;

    return {
      ...loan,
      totalPaid,
      totalInterest,
      balance: Math.max(0, balance),
      payments: loanPayments,
    };
  });

  return (
    <div className="min-h-screen bg-muted">
      <PortalHeader creditorName={creditor.name} />
      <div className="mx-auto max-w-3xl space-y-6 px-4 py-8">
        {loansWithTotals.length === 0 ? (
          <p className="py-12 text-center text-sm text-muted-foreground">
            No loans found.
          </p>
        ) : (
          loansWithTotals.map((loan) => (
            <div key={loan.id} className="space-y-4">
              <LoanSummary
                principal={Number(loan.principal)}
                totalInterest={loan.totalInterest}
                totalPaid={loan.totalPaid}
                balance={loan.balance}
                loanDate={loan.loan_date}
                dueDate={loan.due_date}
                status={loan.status}
                interestRate={Number(loan.interest_rate)}
                interestType={loan.interest_type}
              />
              <PortalPaymentHistory payments={loan.payments} />
            </div>
          ))
        )}
      </div>
    </div>
  );
}
