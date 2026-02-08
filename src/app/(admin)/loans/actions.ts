'use server';

import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { generateAccessToken } from '@/lib/utils/tokens';
import { generateHistoricalAccruals } from '@/lib/utils/interest';
import type { InterestType, AccrualFrequency } from '@/types/database';

export async function createLoan(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const creditorName = formData.get('creditor_name') as string;
  const creditorId = formData.get('creditor_id') as string;
  const principal = parseFloat(formData.get('principal') as string);
  const interestRate = parseFloat(formData.get('interest_rate') as string) || 0;
  const interestType = formData.get('interest_type') as string;
  const accrualFrequency = formData.get('accrual_frequency') as string;
  const loanDate = formData.get('loan_date') as string;
  const dueDate = (formData.get('due_date') as string) || null;
  const documentUrl = (formData.get('document_url') as string) || null;
  const notes = (formData.get('notes') as string) || null;

  let finalCreditorId = creditorId;

  // Create new creditor if no existing one selected
  if (!creditorId && creditorName) {
    const { data: newCreditor, error: creditorError } = await supabase
      .from('creditors')
      .insert({
        user_id: user.id,
        name: creditorName,
        access_token: generateAccessToken(),
      })
      .select('id')
      .single();

    if (creditorError) throw new Error(creditorError.message);
    finalCreditorId = newCreditor.id;
  }

  const { data: loan, error } = await supabase
    .from('loans')
    .insert({
      user_id: user.id,
      creditor_id: finalCreditorId,
      principal,
      interest_rate: interestRate,
      interest_type: interestType,
      accrual_frequency: accrualFrequency,
      loan_date: loanDate,
      due_date: dueDate,
      document_url: documentUrl,
      notes,
    })
    .select('id')
    .single();

  if (error) throw new Error(error.message);

  // Generate retroactive interest if loan date is in the past
  if (interestRate > 0) {
    const accruals = generateHistoricalAccruals({
      principal,
      rate: interestRate,
      interestType: interestType as InterestType,
      frequency: accrualFrequency as AccrualFrequency,
      loanDate,
    });

    if (accruals.length > 0) {
      const rows = accruals.map((a) => ({
        user_id: user.id,
        loan_id: loan.id,
        amount: a.amount,
        accrual_date: a.accrual_date,
        interest_type: a.interest_type,
        is_manual: false,
      }));

      // Insert in batches of 500 to avoid payload limits
      for (let i = 0; i < rows.length; i += 500) {
        const batch = rows.slice(i, i + 500);
        await supabase.from('interest_accruals').insert(batch);
      }
    }
  }

  redirect(`/loans/${loan.id}`);
}

export async function recordPayment(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const loanId = formData.get('loan_id') as string;
  const amount = parseFloat(formData.get('amount') as string);
  const paymentDate = formData.get('payment_date') as string;
  const notes = (formData.get('notes') as string) || null;

  const { error } = await supabase.from('payments').insert({
    user_id: user.id,
    loan_id: loanId,
    amount,
    payment_date: paymentDate,
    notes,
  });

  if (error) throw new Error(error.message);
  redirect(`/loans/${loanId}`);
}

export async function updateLoanStatus(loanId: string, status: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const { error } = await supabase
    .from('loans')
    .update({ status })
    .eq('id', loanId);

  if (error) throw new Error(error.message);
  redirect(`/loans/${loanId}`);
}

export async function deleteLoan(loanId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  // Delete uploaded files from storage
  const { data: docs } = await supabase
    .from('loan_documents')
    .select('file_path')
    .eq('loan_id', loanId);
  if (docs && docs.length > 0) {
    await supabase.storage
      .from('loan-documents')
      .remove(docs.map((d) => d.file_path));
  }

  // Delete related records first (cascade should handle this, but be explicit)
  await supabase.from('loan_documents').delete().eq('loan_id', loanId);
  await supabase.from('interest_accruals').delete().eq('loan_id', loanId);
  await supabase.from('payments').delete().eq('loan_id', loanId);
  await supabase.from('loans').delete().eq('id', loanId);

  redirect('/loans');
}

export async function deletePayment(paymentId: string, loanId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  await supabase.from('payments').delete().eq('id', paymentId);

  redirect(`/loans/${loanId}`);
}

export async function updateDocumentUrl(loanId: string, documentUrl: string | null) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  await supabase
    .from('loans')
    .update({ document_url: documentUrl || null })
    .eq('id', loanId);

  redirect(`/loans/${loanId}`);
}

export async function uploadDocument(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const loanId = formData.get('loan_id') as string;
  const file = formData.get('file') as File;

  if (!file || file.size === 0) throw new Error('No file selected');

  const filePath = `${user.id}/${loanId}/${Date.now()}-${file.name}`;

  const { error: uploadError } = await supabase.storage
    .from('loan-documents')
    .upload(filePath, file);

  if (uploadError) throw new Error(uploadError.message);

  const { error: dbError } = await supabase.from('loan_documents').insert({
    user_id: user.id,
    loan_id: loanId,
    file_name: file.name,
    file_path: filePath,
    file_size: file.size,
  });

  if (dbError) throw new Error(dbError.message);

  redirect(`/loans/${loanId}`);
}

export async function deleteDocument(documentId: string, filePath: string, loanId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  await supabase.storage.from('loan-documents').remove([filePath]);
  await supabase.from('loan_documents').delete().eq('id', documentId);

  redirect(`/loans/${loanId}`);
}

export async function regenerateToken(creditorId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const newToken = generateAccessToken();
  const { error } = await supabase
    .from('creditors')
    .update({ access_token: newToken })
    .eq('id', creditorId);

  if (error) throw new Error(error.message);
  return newToken;
}
