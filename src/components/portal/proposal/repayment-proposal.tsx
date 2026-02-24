import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '@/components/ui/table';
import { formatMYR } from '@/lib/utils/format';

interface RepaymentProposalProps {
  totalCommitment: number;
}

const months = [
  { month: 'March 2026', date: '26 Mar 2026' },
  { month: 'April 2026', date: '26 Apr 2026' },
  { month: 'May 2026', date: '26 May 2026' },
  { month: 'June 2026', date: '26 Jun 2026' },
  { month: 'July 2026', date: '26 Jul 2026' },
  { month: 'August 2026', date: '26 Aug 2026' },
];

const ONGOING_RENTAL = 1400;

export function RepaymentProposal({ totalCommitment }: RepaymentProposalProps) {
  const monthlyRepayment = totalCommitment / 6;
  const monthlyTotal = monthlyRepayment + ONGOING_RENTAL;

  return (
    <Card>
      <CardHeader>
        <CardTitle>6-Month Repayment Schedule</CardTitle>
        <p className="text-sm text-muted-foreground">
          Arrears repayment of {formatMYR(monthlyRepayment)}/month plus ongoing
          rental of {formatMYR(ONGOING_RENTAL)}/month.
        </p>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Month</TableHead>
              <TableHead className="text-right">Arrears</TableHead>
              <TableHead className="text-right">Rental</TableHead>
              <TableHead className="text-right">Total</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {months.map((m) => (
              <TableRow key={m.month}>
                <TableCell>
                  <div>
                    <p className="font-medium">{m.month}</p>
                    <p className="text-xs text-muted-foreground">
                      Due: {m.date}
                    </p>
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  {formatMYR(monthlyRepayment)}
                </TableCell>
                <TableCell className="text-right">
                  {formatMYR(ONGOING_RENTAL)}
                </TableCell>
                <TableCell className="text-right font-medium">
                  {formatMYR(monthlyTotal)}
                </TableCell>
              </TableRow>
            ))}
            {/* Total row */}
            <TableRow className="border-t-2 border-border font-semibold">
              <TableCell>Total (6 months)</TableCell>
              <TableCell className="text-right">
                {formatMYR(totalCommitment)}
              </TableCell>
              <TableCell className="text-right">
                {formatMYR(ONGOING_RENTAL * 6)}
              </TableCell>
              <TableCell className="text-right">
                {formatMYR(totalCommitment + ONGOING_RENTAL * 6)}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>

        {/* Progress bar */}
        <div className="mt-6">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Repayment progress</span>
            <span className="font-medium text-foreground">0 of 6 payments</span>
          </div>
          <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full bg-primary transition-all"
              style={{ width: '0%' }}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
