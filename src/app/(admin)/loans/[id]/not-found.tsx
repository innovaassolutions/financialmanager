import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function LoanNotFound() {
  return (
    <div className="flex flex-col items-center justify-center py-24">
      <h2 className="text-xl font-semibold text-foreground">Loan not found</h2>
      <p className="mt-2 text-sm text-muted-foreground">
        This loan doesn&apos;t exist or you don&apos;t have access to it.
      </p>
      <Link href="/loans" className="mt-6">
        <Button variant="outline">Back to Loans</Button>
      </Link>
    </div>
  );
}
