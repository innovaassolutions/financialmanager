import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatCurrency, formatDate, formatPercent } from '@/lib/utils/format';
import { LOAN_STATUS_LABELS, INTEREST_TYPE_LABELS } from '@/lib/utils/constants';

interface Props {
  principal: number;
  totalInterest: number;
  totalPaid: number;
  balance: number;
  loanDate: string;
  dueDate: string | null;
  status: string;
  interestRate: number;
  interestType: string;
}

const statusVariant: Record<string, 'success' | 'warning' | 'destructive'> = {
  active: 'warning',
  paid_off: 'success',
  defaulted: 'destructive',
};

export function LoanSummary({
  principal,
  totalInterest,
  totalPaid,
  balance,
  loanDate,
  dueDate,
  status,
  interestRate,
  interestType,
}: Props) {
  const totalOwed = principal + totalInterest;
  const progressPercent = totalOwed > 0 ? Math.min(100, (totalPaid / totalOwed) * 100) : 0;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Loan Summary</CardTitle>
          <Badge variant={statusVariant[status]}>
            {LOAN_STATUS_LABELS[status]}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Balance highlight */}
        <div className="text-center">
          <p className="text-sm text-muted-foreground">Outstanding Balance</p>
          <p className="text-3xl font-bold text-foreground">{formatCurrency(balance)}</p>
        </div>

        {/* Progress bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">
              {formatCurrency(totalPaid)} paid
            </span>
            <span className="text-muted-foreground">
              {formatCurrency(totalOwed)} total
            </span>
          </div>
          <div className="h-3 w-full overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full bg-success transition-all"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Details grid */}
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-muted-foreground">Principal</p>
            <p className="font-medium">{formatCurrency(principal)}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Interest Accrued</p>
            <p className="font-medium">{formatCurrency(totalInterest)}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Annual Interest Rate</p>
            <p className="font-medium">
              {formatPercent(interestRate)} ({INTEREST_TYPE_LABELS[interestType]})
            </p>
          </div>
          <div>
            <p className="text-muted-foreground">Loan Date</p>
            <p className="font-medium">{formatDate(loanDate)}</p>
          </div>
          {dueDate && (
            <div>
              <p className="text-muted-foreground">Due Date</p>
              <p className="font-medium">{formatDate(dueDate)}</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
