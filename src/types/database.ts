export type InterestType = 'simple' | 'compound';
export type AccrualFrequency = 'daily' | 'monthly';
export type LoanStatus = 'active' | 'paid_off' | 'defaulted';
export type ChatRole = 'user' | 'assistant';

export interface Creditor {
  id: string;
  user_id: string;
  name: string;
  email: string | null;
  phone: string | null;
  notes: string | null;
  access_token: string;
  telegram_chat_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface Loan {
  id: string;
  user_id: string;
  creditor_id: string;
  principal: number;
  interest_rate: number;
  interest_type: InterestType;
  accrual_frequency: AccrualFrequency;
  loan_date: string;
  due_date: string | null;
  status: LoanStatus;
  document_url: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
  // Joined fields
  creditor?: Creditor;
  payments?: Payment[];
  interest_accruals?: InterestAccrual[];
  disbursements?: Disbursement[];
}

export interface Disbursement {
  id: string;
  user_id: string;
  loan_id: string;
  amount: number;
  disbursement_date: string;
  notes: string | null;
  created_at: string;
}

export interface Payment {
  id: string;
  user_id: string;
  loan_id: string;
  amount: number;
  payment_date: string;
  notes: string | null;
  created_at: string;
  // Joined fields
  loan?: Loan;
}

export interface InterestAccrual {
  id: string;
  user_id: string;
  loan_id: string;
  amount: number;
  accrual_date: string;
  interest_type: InterestType;
  is_manual: boolean;
  created_at: string;
}

export interface LoanDocument {
  id: string;
  user_id: string;
  loan_id: string;
  file_name: string;
  file_path: string;
  file_size: number;
  created_at: string;
}

export interface ChatMessage {
  id: string;
  user_id: string;
  role: ChatRole;
  content: string;
  metadata: Record<string, unknown> | null;
  created_at: string;
}
