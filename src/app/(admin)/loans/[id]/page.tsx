import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { formatCurrency, formatDate, formatPercent } from '@/lib/utils/format';
import { LOAN_STATUS_LABELS, INTEREST_TYPE_LABELS, ACCRUAL_FREQUENCY_LABELS } from '@/lib/utils/constants';
import { PaymentForm } from '@/components/admin/payment-form';
import { LoanActions } from '@/components/admin/loan-actions';
import { PortalLink } from '@/components/admin/portal-link';
import { DeletePaymentButton } from '@/components/admin/delete-payment-button';
import { LoanDocumentLink } from '@/components/admin/loan-document-link';
import { FileUploadForm } from '@/components/admin/file-upload-form';
import { DeleteDocumentButton } from '@/components/admin/delete-document-button';

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

  const [paymentsRes, interestRes, docsRes] = await Promise.all([
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
    supabase
      .from('loan_documents')
      .select('*')
      .eq('loan_id', id)
      .order('created_at', { ascending: false }),
  ]);

  const rawDocs = docsRes.data ?? [];
  const admin = createAdminClient();
  const documents = await Promise.all(
    rawDocs.map(async (doc) => {
      const { data } = await admin.storage
        .from('loan-document')
        .createSignedUrl(doc.file_path, 3600);
      return { ...doc, url: data?.signedUrl };
    }),
  );

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

      {/* Document Link */}
      <Card>
        <CardHeader>
          <CardTitle>Document Link</CardTitle>
        </CardHeader>
        <CardContent>
          <LoanDocumentLink loanId={loan.id} documentUrl={loan.document_url} />
        </CardContent>
      </Card>

      {/* File Upload */}
      <Card>
        <CardHeader>
          <CardTitle>Uploaded Files</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <FileUploadForm loanId={loan.id} />

          {documents.length === 0 ? (
            <p className="text-sm text-muted-foreground">No files uploaded yet.</p>
          ) : (
            <div className="space-y-2">
              {documents.map((doc) => (
                <div key={doc.id} className="flex items-center justify-between rounded-lg border border-border px-4 py-3">
                  <div className="flex items-center gap-3">
                    <svg className="h-5 w-5 text-muted-foreground" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
                    </svg>
                    <div>
                      {doc.url ? (
                        <a href={doc.url} target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-foreground hover:underline">
                          {doc.file_name}
                        </a>
                      ) : (
                        <p className="text-sm font-medium text-foreground">{doc.file_name}</p>
                      )}
                      <p className="text-xs text-muted-foreground">
                        {doc.file_size < 1024 * 1024
                          ? `${(doc.file_size / 1024).toFixed(1)} KB`
                          : `${(doc.file_size / (1024 * 1024)).toFixed(1)} MB`}
                      </p>
                    </div>
                  </div>
                  <DeleteDocumentButton documentId={doc.id} filePath={doc.file_path} loanId={loan.id} fileName={doc.file_name} />
                </div>
              ))}
            </div>
          )}
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
                  <TableHead></TableHead>
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
                    <TableCell>
                      <DeletePaymentButton paymentId={payment.id} loanId={loan.id} />
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
