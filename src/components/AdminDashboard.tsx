import { LogOut, RefreshCw, ShieldCheck } from 'lucide-react'
import { useCallback, useEffect, useState } from 'react'
import { adminSignIn, getResponses, supabaseKey, supabaseUrl } from '../lib/tracking'

type Row = { id: number; question: string; answer: string; category: string; timestamp: string; final_status: string | null }

export function AdminDashboard() {
  const [email, setEmail] = useState(import.meta.env.VITE_ADMIN_EMAIL ?? 'rahulgosainn@gmail.com')
  const [password, setPassword] = useState('')
  const [token, setToken] = useState(() => sessionStorage.getItem('mansi-admin-token') ?? '')
  const [rows, setRows] = useState<Row[]>([])
  const [message, setMessage] = useState('')

  const load = useCallback(async () => {
    if (!supabaseUrl || !supabaseKey || !token) return setMessage('Connect Supabase and sign in to use the dashboard.')
    try { setRows(await getResponses(token) as Row[]); setMessage('') } catch (error) { setMessage(error instanceof Error ? error.message : 'Could not load responses.') }
  }, [token])

  useEffect(() => { if (token) load() }, [load, token])
  const login = async (event: React.FormEvent) => {
    event.preventDefault()
    try { const accessToken = await adminSignIn(email, password); setToken(accessToken); setMessage('') } catch { setMessage('Sign-in failed. Check your Supabase Auth credentials.') }
  }
  if (!token) return <div className="story-bg grid min-h-screen place-items-center p-5 text-white"><form onSubmit={login} className="glass w-full max-w-sm rounded-3xl p-8 text-center"><ShieldCheck className="mx-auto text-pink-300" size={42} /><h1 className="mt-4 font-display text-4xl font-bold">Rahul's Dashboard</h1><p className="mt-2 text-xs opacity-50">Protected by Supabase Auth</p><input aria-label="Admin email" value={email} onChange={e => setEmail(e.target.value)} className="mt-7 w-full rounded-xl border border-white/15 bg-white/10 px-4 py-3" /><input aria-label="Admin password" type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" className="mt-3 w-full rounded-xl border border-white/15 bg-white/10 px-4 py-3" /><button className="premium-button mt-4 w-full rounded-xl bg-gradient-to-r from-pink-500 to-purple-600 px-5 py-3 font-bold">Sign In</button>{message && <p className="mt-4 text-xs text-pink-200">{message}</p>}</form></div>
  return <div className="story-bg min-h-screen p-5 text-white sm:p-10"><div className="mx-auto max-w-6xl"><div className="flex flex-wrap items-center justify-between gap-4"><div><p className="text-xs uppercase tracking-[.3em] text-pink-300">Private Admin</p><h1 className="font-display text-4xl font-bold">Mansi's Responses</h1></div><div className="flex gap-2"><button onClick={load} className="glass rounded-full p-3" aria-label="Refresh"><RefreshCw size={18} /></button><button onClick={() => { sessionStorage.removeItem('mansi-admin-token'); setToken('') }} className="glass rounded-full p-3" aria-label="Sign out"><LogOut size={18} /></button></div></div>{message && <p className="mt-5 text-pink-200">{message}</p>}<div className="glass mt-7 overflow-x-auto rounded-3xl"><table className="w-full min-w-[720px] text-left text-sm"><thead className="border-b border-white/10 text-xs uppercase tracking-wider text-pink-300"><tr><th className="p-4">Date & Time</th><th className="p-4">Category</th><th className="p-4">Question</th><th className="p-4">Answer</th><th className="p-4">Final Status</th></tr></thead><tbody>{rows.map(row => <tr key={row.id} className="border-b border-white/5"><td className="p-4 whitespace-nowrap opacity-60">{new Date(row.timestamp).toLocaleString()}</td><td className="p-4">{row.category}</td><td className="p-4">{row.question}</td><td className="p-4 font-semibold text-pink-100">{row.answer}</td><td className="p-4">{row.final_status ?? '—'}</td></tr>)}</tbody></table>{!rows.length && <p className="p-10 text-center opacity-50">No responses yet.</p>}</div></div></div>
}
