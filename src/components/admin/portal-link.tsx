'use client';

import { useState } from 'react';
import { regenerateToken } from '@/app/(admin)/loans/actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface Props {
  token: string;
  creditorId: string;
}

export function PortalLink({ token, creditorId }: Props) {
  const [currentToken, setCurrentToken] = useState(token);
  const [copied, setCopied] = useState(false);

  const portalUrl = typeof window !== 'undefined'
    ? `${window.location.origin}/portal/${currentToken}`
    : `/portal/${currentToken}`;

  async function handleCopy() {
    await navigator.clipboard.writeText(portalUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  async function handleRegenerate() {
    if (!confirm('Regenerate token? The old portal link will stop working.')) return;
    const newToken = await regenerateToken(creditorId);
    setCurrentToken(newToken);
  }

  return (
    <div className="space-y-3">
      <p className="text-sm text-muted-foreground">
        Share this link with the creditor so they can view their loan status.
      </p>
      <div className="flex gap-2">
        <Input value={portalUrl} readOnly className="font-mono text-xs" />
        <Button variant="outline" size="sm" onClick={handleCopy}>
          {copied ? 'Copied!' : 'Copy'}
        </Button>
      </div>
      <Button variant="ghost" size="sm" onClick={handleRegenerate}>
        Regenerate Token
      </Button>
    </div>
  );
}
