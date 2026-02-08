import { createClient } from '@/lib/supabase/server';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { formatCurrency, formatDate } from '@/lib/utils/format';

export const dynamic = 'force-dynamic';
import Link from 'next/link';

export default async function PaymentsPage() {
  const supabase = await createClient();

  const { data: payments } = await supabase
    .from('payments')
    .select('*, loan:loans(id, creditor:creditors(name))')
    .order('payment_date', { ascending: false });

  const typedPayments = (payments ?? []) as Array<{
    id: string;
    amount: number;
    payment_date: string;
    notes: string | null;
    loan: { id: string; creditor: { name: string } };
  }>;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Payments</h1>

      {typedPayments.length === 0 ? (
        <p className="py-12 text-center text-sm text-muted-foreground">
          No payments recorded yet.
        </p>
      ) : (
        <div className="rounded-xl border border-border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Creditor</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Notes</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {typedPayments.map((payment) => (
                <TableRow key={payment.id}>
                  <TableCell>{formatDate(payment.payment_date)}</TableCell>
                  <TableCell>
                    <Link
                      href={`/loans/${payment.loan?.id}`}
                      className="font-medium text-foreground hover:underline"
                    >
                      {payment.loan?.creditor?.name ?? 'Unknown'}
                    </Link>
                  </TableCell>
                  <TableCell>{formatCurrency(Number(payment.amount))}</TableCell>
                  <TableCell className="text-muted-foreground">
                    {payment.notes || '—'}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
