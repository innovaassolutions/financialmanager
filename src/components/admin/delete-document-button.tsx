'use client';

import { deleteDocument } from '@/app/(admin)/loans/actions';
import { Button } from '@/components/ui/button';

interface Props {
  documentId: string;
  filePath: string;
  loanId: string;
  fileName: string;
}

export function DeleteDocumentButton({ documentId, filePath, loanId, fileName }: Props) {
  return (
    <form
      action={deleteDocument.bind(null, documentId, filePath, loanId)}
      onSubmit={(e) => {
        if (!confirm(`Delete ${fileName}?`)) e.preventDefault();
      }}
    >
      <Button type="submit" variant="ghost" size="sm" className="text-destructive hover:text-destructive">
        Delete
      </Button>
    </form>
  );
}
