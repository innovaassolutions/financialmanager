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
