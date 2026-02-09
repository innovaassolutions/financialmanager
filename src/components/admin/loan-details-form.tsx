'use client';

import { useState } from 'react';
import { updateLoan } from '@/app/(admin)/loans/actions';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { formatPercent, formatDate } from '@/lib/utils/format';
import { INTEREST_TYPE_LABELS, ACCRUAL_FREQUENCY_LABELS } from '@/lib/utils/constants';

interface Props {
  loanId: string;
  interestRate: number;
  interestType: string;
  accrualFrequency: string;
  loanDate: string;
  dueDate: string | null;
  notes: string | null;
}

export function LoanDetailsForm({
  loanId,
  interestRate,
  interestType,
  accrualFrequency,
  loanDate,
  dueDate,
  notes,
}: Props) {
  const [editing, setEditing] = useState(false);

  if (editing) {
    return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Loan Details</CardTitle>
          <Button variant="ghost" size="sm" onClick={() => setEditing(false)}>
            Cancel
          </Button>
        </CardHeader>
        <CardContent>
          <form
            action={async (formData: FormData) => {
              await updateLoan(formData);
            }}
            className="space-y-4"
          >
            <input type="hidden" name="loan_id" value={loanId} />
            <input type="hidden" name="old_interest_rate" value={interestRate} />
            <input type="hidden" name="old_interest_type" value={interestType} />
            <input type="hidden" name="old_accrual_frequency" value={accrualFrequency} />

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <div>
                <label htmlFor="interest_rate" className="text-sm text-muted-foreground">
                  Annual Interest Rate (%)
                </label>
                <Input
                  id="interest_rate"
                  name="interest_rate"
                  type="number"
                  step="0.01"
                  min="0"
                  defaultValue={interestRate}
                  className="mt-1"
                />
              </div>

              <div>
                <label htmlFor="interest_type" className="text-sm text-muted-foreground">
                  Interest Type
                </label>
                <Select
                  id="interest_type"
                  name="interest_type"
                  defaultValue={interestType}
                  className="mt-1"
                >
                  {Object.entries(INTEREST_TYPE_LABELS).map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </Select>
              </div>

              <div>
                <label htmlFor="accrual_frequency" className="text-sm text-muted-foreground">
                  Accrual Frequency
                </label>
                <Select
                  id="accrual_frequency"
                  name="accrual_frequency"
                  defaultValue={accrualFrequency}
                  className="mt-1"
                >
                  {Object.entries(ACCRUAL_FREQUENCY_LABELS).map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </Select>
              </div>

              <div>
                <label className="text-sm text-muted-foreground">Loan Date</label>
                <p className="mt-1.5 text-sm font-medium text-foreground">{formatDate(loanDate)}</p>
              </div>

              <div>
                <label htmlFor="due_date" className="text-sm text-muted-foreground">
                  Due Date
                </label>
                <Input
                  id="due_date"
                  name="due_date"
                  type="date"
                  defaultValue={dueDate ?? ''}
                  className="mt-1"
                />
              </div>

              <div className="sm:col-span-2 lg:col-span-3">
                <label htmlFor="notes" className="text-sm text-muted-foreground">
                  Notes
                </label>
                <Textarea
                  id="notes"
                  name="notes"
                  defaultValue={notes ?? ''}
                  rows={3}
                  className="mt-1"
                />
              </div>
            </div>

            <div className="flex gap-2">
              <Button type="submit" size="sm">Save</Button>
              <Button type="button" variant="ghost" size="sm" onClick={() => setEditing(false)}>
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Loan Details</CardTitle>
        <Button variant="ghost" size="sm" onClick={() => setEditing(true)}>
          Edit
        </Button>
      </CardHeader>
      <CardContent>
        <dl className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div>
            <dt className="text-sm text-muted-foreground">Annual Interest Rate</dt>
            <dd className="mt-0.5 font-medium text-foreground">{formatPercent(interestRate)}</dd>
          </div>
          <div>
            <dt className="text-sm text-muted-foreground">Interest Type</dt>
            <dd className="mt-0.5 font-medium text-foreground">{INTEREST_TYPE_LABELS[interestType]}</dd>
          </div>
          <div>
            <dt className="text-sm text-muted-foreground">Accrual Frequency</dt>
            <dd className="mt-0.5 font-medium text-foreground">{ACCRUAL_FREQUENCY_LABELS[accrualFrequency]}</dd>
          </div>
          <div>
            <dt className="text-sm text-muted-foreground">Loan Date</dt>
            <dd className="mt-0.5 font-medium text-foreground">{formatDate(loanDate)}</dd>
          </div>
          <div>
            <dt className="text-sm text-muted-foreground">Due Date</dt>
            <dd className="mt-0.5 font-medium text-foreground">{dueDate ? formatDate(dueDate) : 'No due date'}</dd>
          </div>
          {notes && (
            <div>
              <dt className="text-sm text-muted-foreground">Notes</dt>
              <dd className="mt-0.5 font-medium text-foreground">{notes}</dd>
            </div>
          )}
        </dl>
      </CardContent>
    </Card>
  );
}
