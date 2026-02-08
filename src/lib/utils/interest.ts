import type { InterestType, AccrualFrequency } from '@/types/database';

interface InterestCalculationParams {
  principal: number;
  rate: number;
  interestType: InterestType;
  frequency: AccrualFrequency;
  outstandingBalance: number;
}

export function calculateInterestAccrual({
  principal,
  rate,
  interestType,
  frequency,
  outstandingBalance,
}: InterestCalculationParams): number {
  const annualRate = rate / 100;

  if (interestType === 'simple') {
    // Simple interest is always based on original principal
    if (frequency === 'daily') {
      return Number((principal * (annualRate / 365)).toFixed(2));
    }
    // monthly
    return Number((principal * (annualRate / 12)).toFixed(2));
  }

  // Compound interest is based on outstanding balance
  if (frequency === 'daily') {
    return Number((outstandingBalance * (annualRate / 365)).toFixed(2));
  }
  // monthly
  return Number((outstandingBalance * (annualRate / 12)).toFixed(2));
}

interface HistoricalAccrual {
  accrual_date: string;
  amount: number;
  interest_type: InterestType;
}

export function generateHistoricalAccruals({
  principal,
  rate,
  interestType,
  frequency,
  loanDate,
}: {
  principal: number;
  rate: number;
  interestType: InterestType;
  frequency: AccrualFrequency;
  loanDate: string;
}): HistoricalAccrual[] {
  if (rate <= 0) return [];

  const start = new Date(loanDate + 'T00:00:00');
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (start >= today) return [];

  const accruals: HistoricalAccrual[] = [];
  let runningBalance = principal;

  if (frequency === 'daily') {
    const cursor = new Date(start);
    while (cursor < today) {
      const amount = calculateInterestAccrual({
        principal,
        rate,
        interestType,
        frequency,
        outstandingBalance: runningBalance,
      });

      if (amount > 0) {
        accruals.push({
          accrual_date: cursor.toISOString().split('T')[0],
          amount,
          interest_type: interestType,
        });
        if (interestType === 'compound') {
          runningBalance += amount;
        }
      }

      cursor.setDate(cursor.getDate() + 1);
    }
  } else {
    // Monthly: accrue on the 1st of each month (or loan date for first month)
    const cursor = new Date(start.getFullYear(), start.getMonth(), 1);
    if (cursor < start) {
      cursor.setMonth(cursor.getMonth() + 1);
    }

    while (cursor < today) {
      const amount = calculateInterestAccrual({
        principal,
        rate,
        interestType,
        frequency,
        outstandingBalance: runningBalance,
      });

      if (amount > 0) {
        accruals.push({
          accrual_date: cursor.toISOString().split('T')[0],
          amount,
          interest_type: interestType,
        });
        if (interestType === 'compound') {
          runningBalance += amount;
        }
      }

      cursor.setMonth(cursor.getMonth() + 1);
    }
  }

  return accruals;
}

export function shouldAccrueToday(
  frequency: AccrualFrequency,
  lastAccrualDate: string | null,
  today: Date = new Date(),
): boolean {
  if (!lastAccrualDate) return true;

  const last = new Date(lastAccrualDate);

  if (frequency === 'daily') {
    // Accrue if it's a different day
    return last.toDateString() !== today.toDateString();
  }

  // Monthly: accrue if different month
  return (
    last.getMonth() !== today.getMonth() ||
    last.getFullYear() !== today.getFullYear()
  );
}
