import { createAdminClient } from '@/lib/supabase/admin';
import { notFound } from 'next/navigation';
import { PortalHeader } from '@/components/portal/portal-header';
import { TokenTracker } from '@/components/portal/token-tracker';
import { LoanSummary } from '@/components/portal/loan-summary';
import { PortalPaymentHistory } from '@/components/portal/payment-history';
import { PortalDisbursementHistory } from '@/components/portal/disbursement-history';
import { PortalDocuments } from '@/components/portal/portal-documents';
import type { TokenArrangement } from '@/types/database';

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
    .order('loan_date', { ascending: true });

  const loanList = loans ?? [];

  // Get payments and interest for each loan
  const loanIds = loanList.map((l) => l.id);

  const [paymentsRes, interestRes, docsRes, disbursementsRes] = await Promise.all([
    supabase
      .from('payments')
      .select('*')
      .in('loan_id', loanIds.length > 0 ? loanIds : ['_none_'])
      .order('payment_date', { ascending: false }),
    supabase
      .from('interest_accruals')
      .select('*')
      .in('loan_id', loanIds.length > 0 ? loanIds : ['_none_']),
    supabase
      .from('loan_documents')
      .select('*')
      .in('loan_id', loanIds.length > 0 ? loanIds : ['_none_'])
      .order('created_at', { ascending: false }),
    supabase
      .from('disbursements')
      .select('*')
      .in('loan_id', loanIds.length > 0 ? loanIds : ['_none_'])
      .order('disbursement_date', { ascending: true }),
  ]);

  const payments = paymentsRes.data ?? [];
  const interestAccruals = interestRes.data ?? [];
  const allDocs = docsRes.data ?? [];
  const allDisbursements = disbursementsRes.data ?? [];

  // Generate signed URLs for documents
  const docsWithUrls = await Promise.all(
    allDocs.map(async (doc) => {
      const { data: signed } = await supabase.storage
        .from('loan-document')
        .createSignedUrl(doc.file_path, 3600);
      return { ...doc, url: signed?.signedUrl };
    }),
  );

  // Calculate totals per loan
  const loansWithTotals = loanList.map((loan) => {
    const loanPayments = payments.filter((p) => p.loan_id === loan.id);
    const loanInterest = interestAccruals.filter((i) => i.loan_id === loan.id);
    const loanDisbursements = allDisbursements.filter((d) => d.loan_id === loan.id);
    const totalPaid = loanPayments.reduce((sum, p) => sum + Number(p.amount), 0);
    const totalInterest = loanInterest.reduce((sum, i) => sum + Number(i.amount), 0);
    const totalDisbursed = loanDisbursements.reduce((sum, d) => sum + Number(d.amount), 0);

    // Use disbursement total as principal if loan has disbursements, otherwise use loan.principal
    const effectivePrincipal = loanDisbursements.length > 0 ? totalDisbursed : Number(loan.principal);
    const balance = effectivePrincipal + totalInterest - totalPaid;

    const loanDocs = docsWithUrls.filter((d) => d.loan_id === loan.id);

    return {
      ...loan,
      principal: effectivePrincipal,
      totalPaid,
      totalInterest,
      balance: Math.max(0, balance),
      payments: loanPayments,
      disbursements: loanDisbursements,
      documents: loanDocs,
      disbursementCount: loanDisbursements.length,
    };
  });

  const tokenArrangement = creditor.token_arrangement as TokenArrangement | null;

  return (
    <div className="min-h-screen bg-muted">
      <PortalHeader creditorName={creditor.name} />
      <div className="mx-auto max-w-3xl space-y-6 px-4 py-8">
        {tokenArrangement && (
          <TokenTracker
            symbol={tokenArrangement.symbol}
            amount={tokenArrangement.amount}
            label={tokenArrangement.label}
            apiSlug={tokenArrangement.cmc_slug}
          />
        )}
        {loansWithTotals.length === 0 ? (
          <p className="py-12 text-center text-sm text-muted-foreground">
            No loans found.
          </p>
        ) : (
          loansWithTotals.map((loan) => (
            <div key={loan.id} className="space-y-4">
              <LoanSummary
                principal={loan.principal}
                totalInterest={loan.totalInterest}
                totalPaid={loan.totalPaid}
                balance={loan.balance}
                loanDate={loan.loan_date}
                dueDate={loan.due_date}
                status={loan.status}
                interestRate={Number(loan.interest_rate)}
                interestType={loan.interest_type}
                disbursementCount={loan.disbursementCount}
                notes={loan.notes}
              />
              {loan.disbursements.length > 0 && (
                <PortalDisbursementHistory disbursements={loan.disbursements} />
              )}
              <PortalDocuments
                documentUrl={loan.document_url}
                documents={loan.documents}
              />
              <PortalPaymentHistory payments={loan.payments} />
            </div>
          ))
        )}
      </div>
    </div>
  );
}
