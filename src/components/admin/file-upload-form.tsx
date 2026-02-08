'use client';

import { uploadDocument } from '@/app/(admin)/loans/actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export function FileUploadForm({ loanId }: { loanId: string }) {
  return (
    <div>
      <form action={uploadDocument} className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <input type="hidden" name="loan_id" value={loanId} />
        <Input name="file" type="file" accept=".pdf,.doc,.docx,.png,.jpg,.jpeg" className="max-w-xs" />
        <Button type="submit" size="sm">Upload</Button>
      </form>
      <p className="mt-2 text-xs text-muted-foreground">Accepted: PDF, Word, PNG, JPG</p>
    </div>
  );
}
