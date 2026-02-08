import { createClient } from '@/lib/supabase/server';
import { Badge } from '@/components/ui/badge';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { formatCurrency, formatDate } from '@/lib/utils/format';
import { LOAN_STATUS_LABELS } from '@/lib/utils/constants';

export const dynamic = 'force-dynamic';
import Link from 'next/link';
import type { Loan } from '@/types/database';
import { LoansFilter } from '@/components/admin/loans-filter';

interface Props {
  searchParams: Promise<{ status?: string }>;
}

const statusVariant: Record<string, 'success' | 'warning' | 'destructive'> = {
  active: 'success',
  paid_off: 'success',
  defaulted: 'destructive',
};

export default async function LoansPage({ searchParams }: Props) {
  const params = await searchParams;
  const supabase = await createClient();

  let query = supabase
    .from('loans')
    .select('*, creditor:creditors(name)')
    .order('created_at', { ascending: false });

  if (params.status && params.status !== 'all') {
    query = query.eq('status', params.status);
  }

  const { data: loans } = await query;
  const typedLoans = (loans ?? []) as (Loan & { creditor: { name: string } })[];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Loans</h1>
        <Link
          href="/loans/new"
          className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
        >
          New Loan
        </Link>
      </div>

      <LoansFilter currentStatus={params.status ?? 'all'} />

      {typedLoans.length === 0 ? (
        <p className="py-12 text-center text-sm text-muted-foreground">
          No loans found.
        </p>
      ) : (
        <div className="rounded-xl border border-border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Creditor</TableHead>
                <TableHead>Principal</TableHead>
                <TableHead>Rate</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {typedLoans.map((loan) => (
                <TableRow key={loan.id}>
                  <TableCell>
                    <Link href={`/loans/${loan.id}`} className="font-medium text-foreground hover:underline">
                      {loan.creditor?.name ?? 'Unknown'}
                    </Link>
                  </TableCell>
                  <TableCell>{formatCurrency(Number(loan.principal))}</TableCell>
                  <TableCell>{loan.interest_rate}%</TableCell>
                  <TableCell>{formatDate(loan.loan_date)}</TableCell>
                  <TableCell>
                    <Badge variant={statusVariant[loan.status]}>
                      {LOAN_STATUS_LABELS[loan.status]}
                    </Badge>
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
