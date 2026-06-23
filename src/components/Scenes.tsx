import { AnimatePresence, motion } from 'framer-motion'
import { CalendarDays, Check, Clock3, Coffee, Heart, UtensilsCrossed } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import type { Answer, DatePlan } from '../types'
import { ChoiceButton, Eyebrow, PrimaryButton, ScreenTitle, StoryCard } from './UI'

type Tone = (frequency?: number, duration?: number, volume?: number) => void
type Save = (question: string, answer: string, category: Answer['category']) => void
type BaseProps = { next: () => void; tone: Tone; save: Save }

const memoryQuestions = [
  { q: 'Who was more innocent when we first met?', options: ['Rahul 😇', 'Mansi 😇'], response: (a: string) => a.startsWith('Rahul') ? 'Bold answer. Rahul approves. 😌' : "Fair enough. Rahul won't argue. Maybe." },
  { q: 'Who replies slower?', options: ['Rahul 🐢', 'Mansi 🐢'], response: () => 'If waiting was a sport, one of us would be Olympic level.' },
  { q: 'Who gets more dramatic?', options: ['Rahul 🎭', 'Mansi 🎭'], response: () => 'No comments from legal counsel.' },
  { q: 'Who secretly cares more?', options: ['Rahul ❤️', 'Mansi ❤️'], response: () => 'Interesting answer detected... 👀' },
]

const romanticQuestions = [
  { q: 'Do you enjoy talking with Rahul? 😊', options: ['Yes ❤️', 'Very Much ❤️❤️'] },
  { q: 'If Rahul randomly called you for coffee, would you come? ☕', options: ['Of Course ☕', 'Maybe ☕'] },
  { q: 'If Rahul invited you for lunch, would you come? 🍝', options: ['Yes 🍝', 'Definitely 🍝'] },
  { q: 'Would you like to spend more time together? ❤️', options: ['Yes ❤️', 'Absolutely ❤️'] },
  { q: 'Is Rahul at least a little special? ✨', options: ['Yes ✨', 'Maybe More Than A Little ✨'] },
  { q: 'Would you like more walks, more conversations, and more coffee moments together? ☕❤️', options: ['Yes ❤️', 'Obviously ❤️'] },
]

function StepDots({ count, active }: { count: number; active: number }) {
  return <div className="mb-7 flex justify-center gap-1.5">{Array.from({ length: count }, (_, i) => <motion.span key={i} animate={{ width: i === active ? 24 : 6, opacity: i <= active ? 1 : .3 }} className="h-1.5 rounded-full bg-pink-300" />)}</div>
}

export function Landing({ next, tone }: Omit<BaseProps, 'save'>) {
  return <StoryCard><Eyebrow>A Tiny Coaching-Center Throwback ✨</Eyebrow><ScreenTitle>Hey Mansi <span className="text-pink-400">❤️</span></ScreenTitle><p className="mx-auto mt-6 max-w-md leading-7 opacity-75">Rahul made something small.<br /><br />It contains memories,<br />some comedy,<br />a few questions,<br />and one slightly nervous invitation. ☕</p><PrimaryButton className="mt-8" onClick={() => { tone(); next() }}>Let's See 👀</PrimaryButton><p className="mt-3 text-[11px] italic opacity-45">Warning: Contains nostalgia, overthinking and bad jokes.</p><p className="mx-auto mt-5 max-w-sm text-[10px] leading-4 opacity-40">Your choices will be privately shared with Rahul so he can see your answers.</p></StoryCard>
}

export function MemoryQuiz({ next, tone, save }: BaseProps) {
  const [index, setIndex] = useState(0)
  const [response, setResponse] = useState('')
  const current = memoryQuestions[index]
  const select = (answer: string) => {
    if (response) return
    save(current.q, answer, 'Memory Quiz'); setResponse(current.response(answer)); tone(540 + index * 50, .1)
    window.setTimeout(() => { if (index === memoryQuestions.length - 1) next(); else { setIndex(i => i + 1); setResponse('') } }, 1500)
  }
  return <StoryCard><Eyebrow>01 · Memory & Friendship Quiz</Eyebrow><StepDots count={4} active={index} /><AnimatePresence mode="wait"><motion.div key={index} initial={{ opacity: 0, x: 25 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -25 }}><h2 className="font-display text-3xl font-bold sm:text-5xl">{current.q}</h2><div className="mt-8 flex flex-wrap justify-center gap-3">{current.options.map(option => <ChoiceButton key={option} onClick={() => select(option)}>{option}</ChoiceButton>)}</div>{response && <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-7 text-sm text-pink-200">{response}</motion.p>}</motion.div></AnimatePresence></StoryCard>
}

export function RapidFire({ next, tone, save }: BaseProps) {
  const [step, setStep] = useState(0)
  const [text, setText] = useState('')
  const questions = useMemo(() => [
    { q: 'Coffee Date ☕ OR Lunch Date 🍝', options: ['Coffee Date ☕', 'Lunch Date 🍝'] },
    { q: 'Mountains 🏔️ OR Beach 🏖️', options: ['Mountains 🏔️', 'Beach 🏖️'] },
    { q: 'Long Drive 🚗 OR Long Walk 🚶', options: ['Long Drive 🚗', 'Long Walk 🚶'] },
    { q: "What's one thing you like about Rahul? 😏", input: true },
    { q: 'Which emoji reminds you of Rahul?', options: ['😂', '❤️', '🤦', '😎', '☕', '🐼'] },
    { q: 'If Rahul had a superpower, what would it be?', options: ['Overthinking 🧠', 'Bad Jokes 😂', 'Eating Food 🍕', 'Making People Smile 😊'] },
  ], [])
  const current = questions[step]
  const choose = (answer: string) => {
    if (!answer.trim()) return
    save(current.q, answer.trim(), 'Rapid Fire'); tone(600 + step * 35, .08)
    if (step === questions.length - 1) next(); else { setStep(i => i + 1); setText('') }
  }
  return <StoryCard><Eyebrow>02 · Fun Rapid Fire</Eyebrow><StepDots count={6} active={step} /><AnimatePresence mode="wait"><motion.div key={step} initial={{ opacity: 0, scale: .97 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: .97 }}><p className="mb-3 text-xs font-bold uppercase tracking-[.2em] text-pink-300/70">Pick quickly. Overthinking is Rahul's department.</p><h2 className="font-display text-3xl font-bold sm:text-5xl">{current.q}</h2>{current.input ? <div className="mx-auto mt-8 flex max-w-md flex-col gap-3"><input autoFocus value={text} onChange={e => setText(e.target.value)} onKeyDown={e => e.key === 'Enter' && choose(text)} maxLength={120} placeholder="Type your honest answer..." className="rounded-2xl border border-white/20 bg-white/10 px-5 py-4 text-center outline-none placeholder:text-white/30 focus:border-pink-300/60" /><PrimaryButton onClick={() => choose(text)}>Lock It In ✨</PrimaryButton></div> : <div className="mt-8 flex flex-wrap justify-center gap-3">{current.options?.map(option => <ChoiceButton key={option} onClick={() => choose(option)}>{option}</ChoiceButton>)}</div>}</motion.div></AnimatePresence></StoryCard>
}

export function RomanticQuiz({ next, tone, save }: BaseProps) {
  const [index, setIndex] = useState(0)
  const current = romanticQuestions[index]
  const choose = (answer: string) => {
    save(current.q, answer, 'Romantic'); tone(650 + index * 35, .1)
    window.setTimeout(() => index === romanticQuestions.length - 1 ? next() : setIndex(i => i + 1), 500)
  }
  return <StoryCard><Eyebrow>03 · Slightly Romantic Questions</Eyebrow><StepDots count={6} active={index} /><AnimatePresence mode="wait"><motion.div key={index} initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -18 }}><h2 className="font-display text-3xl font-bold sm:text-5xl">{current.q}</h2><div className="mt-9 flex flex-wrap justify-center gap-3">{current.options.map(option => <ChoiceButton key={option} onClick={() => choose(option)}>{option}</ChoiceButton>)}</div></motion.div></AnimatePresence></StoryCard>
}

export function Confession({ next, tone }: Omit<BaseProps, 'save'>) {
  const lines = ['After extensive research...', 'Several overthinking sessions...', 'And consultation with absolutely nobody...', 'I have reached a conclusion.', 'I genuinely enjoy talking to you ❤️', 'You make ordinary days feel a little better.', 'And that brings me to one final question...']
  const [visible, setVisible] = useState(0)
  useEffect(() => {
    const timers = lines.map((_, i) => window.setTimeout(() => { setVisible(i + 1); tone(360 + i * 55, .07, .02) }, i * 1350 + 350))
    return () => timers.forEach(clearTimeout)
  }, [tone])
  return <StoryCard><Eyebrow>04 · A Funny Confession</Eyebrow><div className="mx-auto min-h-[330px] max-w-lg space-y-4 py-4">{lines.map((line, i) => <AnimatePresence key={line}>{visible > i && <motion.p initial={{ opacity: 0, y: 15, filter: 'blur(6px)' }} animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }} className={`font-display ${i >= 4 ? 'text-2xl font-bold text-pink-100 sm:text-3xl' : 'text-xl opacity-70'}`}>{line}</motion.p>}</AnimatePresence>)}</div>{visible === lines.length && <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}><PrimaryButton onClick={next}>The Final Question →</PrimaryButton></motion.div>}</StoryCard>
}

function DodgingNo({ onDecline, onAttempt }: { onDecline: () => void; onAttempt: (count: number) => void }) {
  const labels = ['Nice Try 😂', 'Think Again 😏', 'Coffee is waiting ☕', 'Mission Failed 😆', 'You Almost Got Me 😂', 'Are You Sure? 👀', 'Rahul Paid The Developer 😎']
  const [attempts, setAttempts] = useState(0)
  const [position, setPosition] = useState({ x: 0, y: 0, rotate: 0, scale: 1 })
  const dodge = () => {
    if (attempts >= 10) return
    const next = attempts + 1; setAttempts(next); onAttempt(next)
    setPosition({ x: (Math.random() - .5) * Math.min(innerWidth * .45, 360), y: (Math.random() - .5) * 180, rotate: (Math.random() - .5) * 35, scale: Math.max(.62, 1 - next * .035) })
  }
  if (attempts >= 10) return <ChoiceButton onClick={onDecline}>Maybe another weekend 🙂</ChoiceButton>
  return <motion.button animate={position} onPointerEnter={dodge} onPointerDown={dodge} onFocus={dodge} onClick={onDecline} transition={{ type: 'spring', stiffness: 480, damping: 23 }} className="relative z-30 rounded-full border border-white/20 bg-white/10 px-6 py-3.5 text-sm font-semibold shadow-lg backdrop-blur-md">{attempts ? labels[(attempts - 1) % labels.length] : 'NO 🙈'}</motion.button>
}

type FinalProps = { tone: Tone; save: Save; celebrate: () => void; onReport: (plan?: DatePlan) => void; replay: () => void }
export function FinalInvitation({ tone, save, celebrate, onReport, replay }: FinalProps) {
  const [state, setState] = useState<'ask' | 'plan' | 'thanks' | 'declined'>('ask')
  const [attempts, setAttempts] = useState(0)
  const [plan, setPlan] = useState<DatePlan>({ preference: 'Coffee', date: '', time: '' })
  const yes = () => { save('Final invitation', 'YES ❤️', 'Final'); celebrate(); tone(880, .5, .05); setState('plan'); onReport() }
  const decline = () => { save('Final invitation', 'Maybe another weekend', 'Final'); setState('declined'); onReport() }
  const submitPlan = () => { save('Preferred plan', `${plan.preference} on ${plan.date} at ${plan.time}`, 'Final'); celebrate(); onReport(plan); setState('thanks') }
  return <StoryCard className={state !== 'ask' ? 'shadow-glow' : ''}>
    <AnimatePresence mode="wait">
      {state === 'ask' && <motion.div key="ask" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, scale: .95 }}><Eyebrow>One Important Question</Eyebrow><h2 className="font-display text-5xl font-bold sm:text-7xl">Mansi...</h2><p className="mt-5 font-display text-2xl opacity-75">Would you go for a</p><div className="my-4 flex justify-center gap-4 text-2xl font-bold sm:text-4xl"><span>COFFEE ☕</span><span className="text-pink-300">OR</span><span>LUNCH 🍝</span></div><p className="font-display text-2xl opacity-75">with Rahul this weekend?</p><div className="mt-9 flex min-h-28 flex-wrap items-center justify-center gap-4"><motion.div animate={{ scale: 1 + attempts * .035 }}><PrimaryButton onClick={yes}>YES ❤️</PrimaryButton></motion.div><DodgingNo onDecline={decline} onAttempt={setAttempts} /></div><p className="mt-5 text-[10px] opacity-35">The playful button moves, but “Maybe another weekend” always remains a real option.</p></motion.div>}
      {state === 'plan' && <motion.div key="plan" initial={{ opacity: 0, scale: .9 }} animate={{ opacity: 1, scale: 1 }}><motion.div animate={{ scale: [1, 1.15, 1] }} transition={{ repeat: Infinity, duration: 1.3 }} className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-pink-400/15 text-pink-300"><Heart size={42} fill="currentColor" /></motion.div><h2 className="mt-5 font-display text-4xl font-bold sm:text-6xl">Best Decision Detected ❤️</h2><p className="mt-4 leading-7 opacity-70">Rahul officially owes you:<br />☕ One Coffee · 🍰 One Dessert<br />😂 Unlimited Bad Jokes · ❤️ A Great Time</p><div className="mx-auto mt-7 grid max-w-md gap-3 sm:grid-cols-2"><button onClick={() => setPlan(p => ({ ...p, preference: 'Coffee' }))} className={`rounded-2xl border p-4 ${plan.preference === 'Coffee' ? 'border-pink-300 bg-pink-400/20' : 'border-white/15 bg-white/5'}`}><Coffee className="mx-auto mb-2" />Coffee</button><button onClick={() => setPlan(p => ({ ...p, preference: 'Lunch' }))} className={`rounded-2xl border p-4 ${plan.preference === 'Lunch' ? 'border-pink-300 bg-pink-400/20' : 'border-white/15 bg-white/5'}`}><UtensilsCrossed className="mx-auto mb-2" />Lunch</button><label className="relative"><CalendarDays className="absolute left-4 top-4 opacity-50" size={18} /><input aria-label="Preferred date" type="date" value={plan.date} min={new Date().toISOString().slice(0, 10)} onChange={e => setPlan(p => ({ ...p, date: e.target.value }))} className="w-full rounded-2xl border border-white/15 bg-white/10 py-4 pl-11 pr-3 [color-scheme:dark]" /></label><label className="relative"><Clock3 className="absolute left-4 top-4 opacity-50" size={18} /><input aria-label="Preferred time" type="time" value={plan.time} onChange={e => setPlan(p => ({ ...p, time: e.target.value }))} className="w-full rounded-2xl border border-white/15 bg-white/10 py-4 pl-11 pr-3 [color-scheme:dark]" /></label></div><PrimaryButton disabled={!plan.date || !plan.time} className="mt-5" onClick={submitPlan}>Confirm Our Plan ✨</PrimaryButton></motion.div>}
      {state === 'thanks' && <motion.div key="thanks" initial={{ opacity: 0 }} animate={{ opacity: 1 }}><motion.div animate={{ scale: [1, 1.25, 1], rotate: [0, -6, 6, 0] }} transition={{ repeat: Infinity, duration: 1.5 }} className="text-7xl">❤️</motion.div><h2 className="mt-5 font-display text-4xl font-bold sm:text-6xl">Thank you for spending a few minutes here ❤️</h2><p className="mx-auto mt-6 max-w-md leading-7 opacity-70">This tiny website was made with genuine effort,<br />a little courage,<br />and a lot of smiles.</p><p className="mt-6 font-display text-2xl">See you for {plan.preference} {plan.preference === 'Coffee' ? '☕' : '🍝'}</p><p className="mt-7 text-sm opacity-60">Signed,<br /><span className="font-display text-2xl font-bold">Rahul ❤️</span></p><ChoiceButton className="mt-7" onClick={replay}>Replay</ChoiceButton></motion.div>}
      {state === 'declined' && <motion.div key="declined" initial={{ opacity: 0 }} animate={{ opacity: 1 }}><Check className="mx-auto text-pink-300" size={54} /><h2 className="mt-5 font-display text-4xl font-bold">No worries at all.</h2><p className="mx-auto mt-4 max-w-sm leading-7 opacity-70">Thank you for answering honestly. The friendship, the laughs, and Rahul's bad jokes remain completely unchanged. 🙂</p><ChoiceButton className="mt-7" onClick={replay}>Replay</ChoiceButton></motion.div>}
    </AnimatePresence>
  </StoryCard>
}
