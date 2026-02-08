'use client';

import { updateLoanStatus, deleteLoan } from '@/app/(admin)/loans/actions';
import { Button } from '@/components/ui/button';

interface Props {
  loanId: string;
  currentStatus: string;
}

export function LoanActions({ loanId, currentStatus }: Props) {
  return (
    <div className="flex gap-2">
      {currentStatus === 'active' && (
        <>
          <form action={updateLoanStatus.bind(null, loanId, 'paid_off')}>
            <Button type="submit" variant="outline" size="sm">
              Mark as Paid Off
            </Button>
          </form>
          <form action={updateLoanStatus.bind(null, loanId, 'defaulted')}>
            <Button type="submit" variant="destructive" size="sm">
              Mark as Defaulted
            </Button>
          </form>
        </>
      )}
      {currentStatus === 'defaulted' && (
        <form action={updateLoanStatus.bind(null, loanId, 'active')}>
          <Button type="submit" variant="outline" size="sm">
            Reactivate
          </Button>
        </form>
      )}
      {currentStatus === 'paid_off' && (
        <form action={updateLoanStatus.bind(null, loanId, 'active')}>
          <Button type="submit" variant="outline" size="sm">
            Reactivate
          </Button>
        </form>
      )}
      <form
        action={deleteLoan.bind(null, loanId)}
        onSubmit={(e) => {
          if (!confirm('Delete this loan and all its payments and interest records?')) {
            e.preventDefault();
          }
        }}
      >
        <Button type="submit" variant="destructive" size="sm">
          Delete Loan
        </Button>
      </form>
    </div>
  );
}
