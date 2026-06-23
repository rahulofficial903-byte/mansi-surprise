import type { Answer, DatePlan } from '../types'

export const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined
export const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined
const emailService = import.meta.env.VITE_EMAILJS_SERVICE_ID as string | undefined
const answerTemplate = import.meta.env.VITE_EMAILJS_ANSWER_TEMPLATE_ID as string | undefined
const reportTemplate = import.meta.env.VITE_EMAILJS_REPORT_TEMPLATE_ID as string | undefined
const emailKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY as string | undefined

async function sendEmail(templateId: string, templateParams: Record<string, string>) {
  if (!emailService || !emailKey) return
  const response = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ service_id: emailService, template_id: templateId, user_id: emailKey, template_params: templateParams }),
  })
  if (!response.ok) throw new Error('EmailJS request failed')
}

export async function trackAnswer(entry: Answer) {
  const tasks: Promise<unknown>[] = []
  if (supabaseUrl && supabaseKey) {
    tasks.push(fetch(`${supabaseUrl}/rest/v1/responses`, {
      method: 'POST',
      headers: { apikey: supabaseKey, Authorization: `Bearer ${supabaseKey}`, 'Content-Type': 'application/json', Prefer: 'return=minimal' },
      body: JSON.stringify({ question: entry.question, answer: entry.answer, category: entry.category, timestamp: entry.timestamp, final_status: entry.category === 'Final' ? entry.answer : null }),
    }).then(response => { if (!response.ok) throw new Error('Supabase insert failed') }))
  }
  if (answerTemplate) tasks.push(sendEmail(answerTemplate, { subject: 'Mansi Answered A Question', question: entry.question, selected_answer: entry.answer, category: entry.category, timestamp: new Date(entry.timestamp).toLocaleString() }))
  await Promise.allSettled(tasks)
}

export async function sendFinalReport(answers: Answer[], plan?: DatePlan) {
  if (!reportTemplate) return
  const report = answers.map(({ category, question, answer }) => `[${category}] ${question}: ${answer}`).join('\n')
  await sendEmail(reportTemplate, {
    subject: "Mansi's Responses",
    completed_at: new Date().toLocaleString(), responses: report,
    preference: plan?.preference ?? 'Not selected yet', preferred_date: plan?.date || 'Not selected yet', preferred_time: plan?.time || 'Not selected yet',
    final_confirmation: answers.find(item => item.question === 'Final invitation')?.answer ?? 'Pending',
  })
}

export async function adminSignIn(email: string, password: string) {
  if (!supabaseUrl || !supabaseKey) throw new Error('Supabase is not configured.')
  const response = await fetch(`${supabaseUrl}/auth/v1/token?grant_type=password`, { method: 'POST', headers: { apikey: supabaseKey, 'Content-Type': 'application/json' }, body: JSON.stringify({ email, password }) })
  if (!response.ok) throw new Error('Sign-in failed.')
  const data = await response.json() as { access_token: string }
  sessionStorage.setItem('mansi-admin-token', data.access_token)
  return data.access_token
}

export async function getResponses(token: string) {
  if (!supabaseUrl || !supabaseKey) throw new Error('Supabase is not configured.')
  const response = await fetch(`${supabaseUrl}/rest/v1/responses?select=*&order=timestamp.desc`, { headers: { apikey: supabaseKey, Authorization: `Bearer ${token}` } })
  if (!response.ok) throw new Error('Could not load responses.')
  return response.json()
}
