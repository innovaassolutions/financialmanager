import { createClient } from '@/lib/supabase/server';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export const dynamic = 'force-dynamic';
import { Badge } from '@/components/ui/badge';
import { formatCurrency, formatDate } from '@/lib/utils/format';
import { LOAN_STATUS_LABELS } from '@/lib/utils/constants';
import Link from 'next/link';
import type { Loan } from '@/types/database';

async function getDashboardData() {
  const supabase = await createClient();

  const [loansRes, paymentsRes, interestRes] = await Promise.all([
    supabase
      .from('loans')
      .select('*, creditor:creditors(name)')
      .order('created_at', { ascending: false }),
    supabase
      .from('payments')
      .select('amount'),
    supabase
      .from('interest_accruals')
      .select('amount'),
  ]);

  const loans = (loansRes.data ?? []) as (Loan & { creditor: { name: string } })[];
  const totalPayments = (paymentsRes.data ?? []).reduce((sum, p) => sum + Number(p.amount), 0);
  const totalInterest = (interestRes.data ?? []).reduce((sum, i) => sum + Number(i.amount), 0);
  const totalPrincipal = loans.reduce((sum, l) => sum + Number(l.principal), 0);
  const activeLoans = loans.filter((l) => l.status === 'active');
  const paidLoans = loans.filter((l) => l.status === 'paid_off');
  const outstanding = totalPrincipal + totalInterest - totalPayments;

  return {
    loans,
    stats: {
      totalLoans: loans.length,
      activeLoans: activeLoans.length,
      paidLoans: paidLoans.length,
      totalPrincipal,
      totalInterest,
      totalPayments,
      outstanding: Math.max(0, outstanding),
    },
  };
}

const statusVariant: Record<string, 'success' | 'warning' | 'destructive'> = {
  active: 'warning',
  paid_off: 'success',
  defaulted: 'destructive',
};

export default async function DashboardPage() {
  const { loans, stats } = await getDashboardData();

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Dashboard</h1>

      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Total Loans" value={String(stats.totalLoans)} />
        <StatCard title="Outstanding" value={formatCurrency(stats.outstanding)} />
        <StatCard title="Total Paid" value={formatCurrency(stats.totalPayments)} />
        <StatCard title="Interest Accrued" value={formatCurrency(stats.totalInterest)} />
      </div>

      {/* Recent Loans */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Recent Loans</CardTitle>
            <Link
              href="/loans/new"
              className="rounded-lg bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
            >
              New Loan
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          {loans.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted-foreground">
              No loans yet. Create your first loan to get started.
            </p>
          ) : (
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {loans.slice(0, 6).map((loan) => (
                <Link
                  key={loan.id}
                  href={`/loans/${loan.id}`}
                  className="rounded-lg border border-border p-4 transition-colors hover:bg-muted/50"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-medium text-foreground">
                        {loan.creditor?.name ?? 'Unknown'}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {formatCurrency(Number(loan.principal))}
                      </p>
                    </div>
                    <Badge variant={statusVariant[loan.status]}>
                      {LOAN_STATUS_LABELS[loan.status]}
                    </Badge>
                  </div>
                  <p className="mt-2 text-xs text-muted-foreground">
                    {formatDate(loan.loan_date)}
                  </p>
                </Link>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function StatCard({ title, value }: { title: string; value: string }) {
  return (
    <Card>
      <CardContent className="p-6">
        <p className="text-sm font-medium text-muted-foreground">{title}</p>
        <p className="mt-1 text-2xl font-semibold text-foreground">{value}</p>
      </CardContent>
    </Card>
  );
}
