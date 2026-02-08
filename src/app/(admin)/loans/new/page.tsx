import { createClient } from '@/lib/supabase/server';
import { LoanForm } from '@/components/admin/loan-form';

export const dynamic = 'force-dynamic';

export default async function NewLoanPage() {
  const supabase = await createClient();
  const { data: creditors } = await supabase
    .from('creditors')
    .select('id, name')
    .order('name');

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <h1 className="text-2xl font-semibold">New Loan</h1>
      <LoanForm creditors={creditors ?? []} />
    </div>
  );
}
