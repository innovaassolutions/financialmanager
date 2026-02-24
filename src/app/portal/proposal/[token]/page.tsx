import type { Metadata } from 'next';
import { createAdminClient } from '@/lib/supabase/admin';
import { notFound } from 'next/navigation';
import { ProposalHeader } from '@/components/portal/proposal/proposal-header';
import { PersonalLetter } from '@/components/portal/proposal/personal-letter';
import { RelationshipTimeline } from '@/components/portal/proposal/relationship-timeline';
import { FinancialSummary } from '@/components/portal/proposal/financial-summary';
import { IncomePipeline } from '@/components/portal/proposal/income-pipeline';
import { RepaymentProposal } from '@/components/portal/proposal/repayment-proposal';
import { CommitmentStatement } from '@/components/portal/proposal/commitment-statement';

export const metadata: Metadata = {
  title: 'Repayment Proposal — Todd Abraham',
  description:
    'A formal repayment proposal with full transparency and commitment.',
  openGraph: {
    title: 'Repayment Proposal — Todd Abraham',
    description:
      'A formal repayment proposal with full transparency and commitment.',
  },
};

interface Props {
  params: Promise<{ token: string }>;
}

export default async function ProposalPage({ params }: Props) {
  const { token } = await params;
  const supabase = createAdminClient();

  // Look up creditor by access token
  const { data: creditor } = await supabase
    .from('creditors')
    .select('*')
    .eq('access_token', token)
    .single();

  if (!creditor) notFound();

  // Get loans for this creditor
  const { data: loans } = await supabase
    .from('loans')
    .select('*')
    .eq('creditor_id', creditor.id)
    .order('loan_date', { ascending: true });

  const loanList = loans ?? [];
  const loanIds = loanList.map((l) => l.id);

  // Get disbursements
  const { data: disbursementsData } = await supabase
    .from('disbursements')
    .select('*')
    .in('loan_id', loanIds.length > 0 ? loanIds : ['_none_'])
    .order('disbursement_date', { ascending: true });

  const disbursements = (disbursementsData ?? []).map((d) => ({
    ...d,
    amount: Number(d.amount),
  }));

  const totalDisbursed = disbursements.reduce((sum, d) => sum + d.amount, 0);
  const patiencePremium = totalDisbursed * 0.15;
  const totalCommitment = totalDisbursed + patiencePremium;

  return (
    <div className="min-h-screen bg-muted">
      <ProposalHeader creditorName={creditor.name} />
      <div className="mx-auto max-w-2xl space-y-6 px-4 py-8">
        <PersonalLetter />
        <RelationshipTimeline />
        <FinancialSummary
          disbursements={disbursements}
          totalDisbursed={totalDisbursed}
        />
        <IncomePipeline />
        <RepaymentProposal totalCommitment={totalCommitment} />
        <CommitmentStatement />
      </div>
    </div>
  );
}
