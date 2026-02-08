'use client';

import { useState } from 'react';
import { createLoan } from '@/app/(admin)/loans/actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface Props {
  creditors: { id: string; name: string }[];
}

export function LoanForm({ creditors }: Props) {
  const [useExisting, setUseExisting] = useState(creditors.length > 0);
  const today = new Date().toISOString().split('T')[0];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Loan Details</CardTitle>
      </CardHeader>
      <CardContent>
        <form action={createLoan} className="space-y-4">
          {/* Creditor selection */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Creditor</label>
            {creditors.length > 0 && (
              <div className="flex gap-2 mb-2">
                <button
                  type="button"
                  onClick={() => setUseExisting(true)}
                  className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
                    useExisting
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-secondary text-secondary-foreground'
                  }`}
                >
                  Existing
                </button>
                <button
                  type="button"
                  onClick={() => setUseExisting(false)}
                  className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
                    !useExisting
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-secondary text-secondary-foreground'
                  }`}
                >
                  New
                </button>
              </div>
            )}

            {useExisting && creditors.length > 0 ? (
              <Select name="creditor_id" required>
                <option value="">Select a creditor</option>
                {creditors.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </Select>
            ) : (
              <Input
                name="creditor_name"
                placeholder="Creditor name"
                required
              />
            )}
          </div>

          {/* Principal & Rate */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Principal Amount</label>
              <Input
                name="principal"
                type="number"
                step="0.01"
                min="0"
                placeholder="0.00"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Annual Interest Rate (%)</label>
              <Input
                name="interest_rate"
                type="number"
                step="0.01"
                min="0"
                defaultValue="0"
              />
            </div>
          </div>

          {/* Interest Type & Frequency */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Interest Type</label>
              <Select name="interest_type" defaultValue="simple">
                <option value="simple">Simple</option>
                <option value="compound">Compound</option>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Accrual Frequency</label>
              <Select name="accrual_frequency" defaultValue="monthly">
                <option value="daily">Daily</option>
                <option value="monthly">Monthly</option>
              </Select>
            </div>
          </div>

          {/* Dates */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Loan Date</label>
              <Input name="loan_date" type="date" defaultValue={today} required />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Due Date (optional)</label>
              <Input name="due_date" type="date" />
            </div>
          </div>

          {/* Documents */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Document Link (optional)</label>
            <Input
              name="document_url"
              type="url"
              placeholder="https://drive.google.com/..."
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Upload Document (optional)</label>
            <Input name="file" type="file" accept=".pdf,.doc,.docx,.png,.jpg,.jpeg" />
            <p className="text-xs text-muted-foreground">Accepted: PDF, Word, PNG, JPG</p>
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Notes (optional)</label>
            <Textarea name="notes" placeholder="Any additional details..." />
          </div>

          <Button type="submit" className="w-full">
            Create Loan
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
