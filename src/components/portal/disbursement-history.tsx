import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { formatCurrency, formatDate } from '@/lib/utils/format';

interface Disbursement {
  id: string;
  amount: number;
  disbursement_date: string;
  notes: string | null;
}

export function PortalDisbursementHistory({ disbursements }: { disbursements: Disbursement[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Disbursement History</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Notes</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {disbursements.map((d) => (
              <TableRow key={d.id}>
                <TableCell>{formatDate(d.disbursement_date)}</TableCell>
                <TableCell>{formatCurrency(Number(d.amount))}</TableCell>
                <TableCell className="text-muted-foreground">
                  {d.notes || '—'}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
