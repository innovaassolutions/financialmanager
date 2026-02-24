import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { formatMYR } from '@/lib/utils/format';

interface Disbursement {
  amount: number;
  notes: string | null;
}

interface FinancialSummaryProps {
  disbursements: Disbursement[];
  totalDisbursed: number;
}

export function FinancialSummary({ disbursements, totalDisbursed }: FinancialSummaryProps) {
  const rentalCount = disbursements.filter(
    (d) => d.notes?.includes('Monthly rental'),
  ).length;

  const patiencePremium = totalDisbursed * 0.15;
  const totalCommitment = totalDisbursed + patiencePremium;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Financial Summary</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {/* Rental */}
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">
              Monthly rental ({rentalCount} months x RM1,400)
            </span>
            <span className="font-medium text-foreground">
              {formatMYR(totalDisbursed)}
            </span>
          </div>

          {/* Subtotal divider */}
          <div className="border-t border-border pt-3">
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium text-foreground">Subtotal</span>
              <span className="font-medium text-foreground">
                {formatMYR(totalDisbursed)}
              </span>
            </div>
          </div>

          {/* Patience premium */}
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">
              15% patience premium (gratitude)
            </span>
            <span className="font-medium text-foreground">
              {formatMYR(patiencePremium)}
            </span>
          </div>

          {/* Total commitment */}
          <div className="rounded-lg bg-primary/10 p-3">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-foreground">
                Total Commitment
              </span>
              <span className="text-lg font-bold text-primary">
                {formatMYR(totalCommitment)}
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
