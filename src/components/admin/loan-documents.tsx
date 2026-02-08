'use client';

import { uploadDocument, deleteDocument, updateDocumentUrl } from '@/app/(admin)/loans/actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useState } from 'react';

interface Document {
  id: string;
  file_name: string;
  file_path: string;
  file_size: number;
  created_at: string;
  url?: string;
}

interface Props {
  loanId: string;
  documentUrl: string | null;
  documents: Document[];
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function LoanDocuments({ loanId, documentUrl, documents }: Props) {
  const [editingLink, setEditingLink] = useState(false);

  return (
    <div className="space-y-6">
      {/* Document Link */}
      <div className="space-y-2">
        <p className="text-sm font-medium text-foreground">Document Link</p>
        {editingLink ? (
          <form action={async (formData: FormData) => {
            const url = formData.get('document_url') as string;
            await updateDocumentUrl(loanId, url);
          }} className="flex gap-2">
            <Input
              name="document_url"
              type="url"
              defaultValue={documentUrl ?? ''}
              placeholder="https://drive.google.com/..."
            />
            <Button type="submit" size="sm">Save</Button>
            <Button type="button" variant="ghost" size="sm" onClick={() => setEditingLink(false)}>
              Cancel
            </Button>
          </form>
        ) : (
          <div className="flex items-center gap-2">
            {documentUrl ? (
              <a
                href={documentUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-accent-foreground underline hover:text-primary"
              >
                {documentUrl}
              </a>
            ) : (
              <p className="text-sm text-muted-foreground">No link added</p>
            )}
            <Button variant="ghost" size="sm" onClick={() => setEditingLink(true)}>
              {documentUrl ? 'Edit' : 'Add Link'}
            </Button>
          </div>
        )}
      </div>

      {/* Divider */}
      <div className="border-t border-border" />

      {/* File Upload */}
      <div className="space-y-3">
        <p className="text-sm font-medium text-foreground">Upload Files</p>
        <form action={uploadDocument} className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <input type="hidden" name="loan_id" value={loanId} />
          <Input name="file" type="file" accept=".pdf,.doc,.docx,.png,.jpg,.jpeg" className="max-w-xs" />
          <Button type="submit" size="sm" variant="outline">Upload File</Button>
        </form>
        <p className="text-xs text-muted-foreground">
          Accepted: PDF, Word, PNG, JPG
        </p>
      </div>

      {/* File List */}
      {documents.length > 0 && (
        <div className="space-y-2">
          {documents.map((doc) => (
            <div key={doc.id} className="flex items-center justify-between rounded-lg border border-border px-4 py-3">
              <div className="flex items-center gap-3">
                <FileIcon />
                <div>
                  {doc.url ? (
                    <a
                      href={doc.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm font-medium text-foreground hover:underline"
                    >
                      {doc.file_name}
                    </a>
                  ) : (
                    <p className="text-sm font-medium text-foreground">{doc.file_name}</p>
                  )}
                  <p className="text-xs text-muted-foreground">{formatFileSize(doc.file_size)}</p>
                </div>
              </div>
              <form
                action={deleteDocument.bind(null, doc.id, doc.file_path, loanId)}
                onSubmit={(e) => {
                  if (!confirm(`Delete ${doc.file_name}?`)) e.preventDefault();
                }}
              >
                <Button type="submit" variant="ghost" size="sm" className="text-destructive hover:text-destructive">
                  Delete
                </Button>
              </form>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function FileIcon() {
  return (
    <svg className="h-5 w-5 text-muted-foreground" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
    </svg>
  );
}
