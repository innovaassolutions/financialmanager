'use client';

import { recordDisbursement } from '@/app/(admin)/loans/actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

export function DisbursementForm({ loanId }: { loanId: string }) {
  const today = new Date().toISOString().split('T')[0];

  return (
    <form action={recordDisbursement} className="space-y-4">
      <input type="hidden" name="loan_id" value={loanId} />

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Amount</label>
          <Input
            name="amount"
            type="number"
            step="0.01"
            min="0"
            placeholder="0.00"
            required
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Disbursement Date</label>
          <Input name="disbursement_date" type="date" defaultValue={today} required />
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground">Notes (optional)</label>
        <Textarea name="notes" placeholder="Disbursement notes..." />
      </div>

      <Button type="submit">Record Disbursement</Button>
    </form>
  );
}
