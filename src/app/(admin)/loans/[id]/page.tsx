import { createClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { formatCurrency, formatDate, formatPercent } from '@/lib/utils/format';
import { LOAN_STATUS_LABELS, INTEREST_TYPE_LABELS, ACCRUAL_FREQUENCY_LABELS } from '@/lib/utils/constants';
import { PaymentForm } from '@/components/admin/payment-form';
import { LoanActions } from '@/components/admin/loan-actions';
import { PortalLink } from '@/components/admin/portal-link';

interface Props {
  params: Promise<{ id: string }>;
}

const statusVariant: Record<string, 'success' | 'warning' | 'destructive'> = {
  active: 'warning',
  paid_off: 'success',
  defaulted: 'destructive',
};

export default async function LoanDetailPage({ params }: Props) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: loan } = await supabase
    .from('loans')
    .select('*, creditor:creditors(*)')
    .eq('id', id)
    .single();

  if (!loan) notFound();

  const [paymentsRes, interestRes] = await Promise.all([
    supabase
      .from('payments')
      .select('*')
      .eq('loan_id', id)
      .order('payment_date', { ascending: false }),
    supabase
      .from('interest_accruals')
      .select('*')
      .eq('loan_id', id)
      .order('accrual_date', { ascending: false }),
  ]);

  const payments = paymentsRes.data ?? [];
  const interestAccruals = interestRes.data ?? [];
  const totalPayments = payments.reduce((sum, p) => sum + Number(p.amount), 0);
  const totalInterest = interestAccruals.reduce((sum, i) => sum + Number(i.amount), 0);
  const balance = Number(loan.principal) + totalInterest - totalPayments;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-semibold">{loan.creditor?.name}</h1>
          <p className="text-sm text-muted-foreground">
            Loan created {formatDate(loan.created_at)}
          </p>
        </div>
        <Badge variant={statusVariant[loan.status]} className="text-sm">
          {LOAN_STATUS_LABELS[loan.status]}
        </Badge>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <SummaryCard label="Principal" value={formatCurrency(Number(loan.principal))} />
        <SummaryCard label="Interest Accrued" value={formatCurrency(totalInterest)} />
        <SummaryCard label="Total Paid" value={formatCurrency(totalPayments)} />
        <SummaryCard
          label="Balance"
          value={formatCurrency(Math.max(0, balance))}
          highlight
        />
      </div>

      {/* Loan Details */}
      <Card>
        <CardHeader>
          <CardTitle>Loan Details</CardTitle>
        </CardHeader>
        <CardContent>
          <dl className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <Detail label="Annual Interest Rate" value={formatPercent(Number(loan.interest_rate))} />
            <Detail label="Interest Type" value={INTEREST_TYPE_LABELS[loan.interest_type]} />
            <Detail label="Accrual Frequency" value={ACCRUAL_FREQUENCY_LABELS[loan.accrual_frequency]} />
            <Detail label="Loan Date" value={formatDate(loan.loan_date)} />
            <Detail label="Due Date" value={loan.due_date ? formatDate(loan.due_date) : 'No due date'} />
            {loan.notes && <Detail label="Notes" value={loan.notes} />}
          </dl>
        </CardContent>
      </Card>

      {/* Portal Link */}
      <Card>
        <CardHeader>
          <CardTitle>Creditor Portal</CardTitle>
        </CardHeader>
        <CardContent>
          <PortalLink
            token={loan.creditor?.access_token}
            creditorId={loan.creditor?.id}
          />
        </CardContent>
      </Card>

      {/* Loan Status Actions */}
      <LoanActions loanId={loan.id} currentStatus={loan.status} />

      {/* Record Payment */}
      {loan.status === 'active' && (
        <Card>
          <CardHeader>
            <CardTitle>Record Payment</CardTitle>
          </CardHeader>
          <CardContent>
            <PaymentForm loanId={loan.id} />
          </CardContent>
        </Card>
      )}

      {/* Payment History */}
      <Card>
        <CardHeader>
          <CardTitle>Payment History</CardTitle>
        </CardHeader>
        <CardContent>
          {payments.length === 0 ? (
            <p className="py-4 text-center text-sm text-muted-foreground">
              No payments recorded yet.
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Notes</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {payments.map((payment) => (
                  <TableRow key={payment.id}>
                    <TableCell>{formatDate(payment.payment_date)}</TableCell>
                    <TableCell>{formatCurrency(Number(payment.amount))}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {payment.notes || '—'}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Interest History */}
      <Card>
        <CardHeader>
          <CardTitle>Interest History</CardTitle>
        </CardHeader>
        <CardContent>
          {interestAccruals.length === 0 ? (
            <p className="py-4 text-center text-sm text-muted-foreground">
              No interest accrued yet.
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Source</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {interestAccruals.map((accrual) => (
                  <TableRow key={accrual.id}>
                    <TableCell>{formatDate(accrual.accrual_date)}</TableCell>
                    <TableCell>{formatCurrency(Number(accrual.amount))}</TableCell>
                    <TableCell>{INTEREST_TYPE_LABELS[accrual.interest_type]}</TableCell>
                    <TableCell>
                      <Badge variant={accrual.is_manual ? 'outline' : 'secondary'}>
                        {accrual.is_manual ? 'Manual' : 'Auto'}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function SummaryCard({
  label,
  value,
  highlight,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <Card>
      <CardContent className="p-4">
        <p className="text-sm text-muted-foreground">{label}</p>
        <p className={`mt-1 text-xl font-semibold ${highlight ? 'text-primary' : 'text-foreground'}`}>
          {value}
        </p>
      </CardContent>
    </Card>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-sm text-muted-foreground">{label}</dt>
      <dd className="mt-0.5 font-medium text-foreground">{value}</dd>
    </div>
  );
}
