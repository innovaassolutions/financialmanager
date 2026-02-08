'use client';

import { useState } from 'react';
import { updateDocumentUrl } from '@/app/(admin)/loans/actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface Props {
  loanId: string;
  documentUrl: string | null;
}

export function LoanDocumentLink({ loanId, documentUrl }: Props) {
  const [editing, setEditing] = useState(false);

  if (editing) {
    return (
      <form
        action={async (formData: FormData) => {
          const url = formData.get('document_url') as string;
          await updateDocumentUrl(loanId, url);
        }}
        className="flex gap-2"
      >
        <Input
          name="document_url"
          type="url"
          defaultValue={documentUrl ?? ''}
          placeholder="https://drive.google.com/..."
        />
        <Button type="submit" size="sm">Save</Button>
        <Button type="button" variant="ghost" size="sm" onClick={() => setEditing(false)}>
          Cancel
        </Button>
      </form>
    );
  }

  return (
    <div className="flex items-center gap-2">
      {documentUrl ? (
        <a
          href={documentUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-foreground underline hover:text-primary"
        >
          {documentUrl}
        </a>
      ) : (
        <p className="text-sm text-muted-foreground">No link added</p>
      )}
      <Button variant="ghost" size="sm" onClick={() => setEditing(true)}>
        {documentUrl ? 'Edit' : 'Add Link'}
      </Button>
    </div>
  );
}
