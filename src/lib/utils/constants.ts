export const APP_NAME = 'Financial Manager';
export const ASSISTANT_NAME = 'Gail';

export const LOAN_STATUS_LABELS: Record<string, string> = {
  active: 'Active',
  paid_off: 'Paid Off',
  defaulted: 'Defaulted',
};

export const INTEREST_TYPE_LABELS: Record<string, string> = {
  simple: 'Simple',
  compound: 'Compound',
};

export const ACCRUAL_FREQUENCY_LABELS: Record<string, string> = {
  daily: 'Daily',
  monthly: 'Monthly',
};

export const ROUTES = {
  home: '/',
  login: '/login',
  dashboard: '/dashboard',
  loans: '/loans',
  newLoan: '/loans/new',
  loanDetail: (id: string) => `/loans/${id}`,
  payments: '/payments',
  chat: '/chat',
  portal: (token: string) => `/portal/${token}`,
} as const;
