'use client';

import { deletePayment } from '@/app/(admin)/loans/actions';
import { Button } from '@/components/ui/button';

export function DeletePaymentButton({ paymentId, loanId }: { paymentId: string; loanId: string }) {
  return (
    <form
      action={deletePayment.bind(null, paymentId, loanId)}
      onSubmit={(e) => {
        if (!confirm('Delete this payment?')) {
          e.preventDefault();
        }
      }}
    >
      <Button type="submit" variant="ghost" size="sm" className="text-destructive hover:text-destructive">
        Delete
      </Button>
    </form>
  );
}
