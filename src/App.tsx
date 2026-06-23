import confetti from 'canvas-confetti'
import { AnimatePresence, motion } from 'framer-motion'
import { Moon, Music2, Settings, Sun, VolumeX } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { Ambience, CursorHearts, HeartBurst, HeartRain } from './components/Ambience'
import { AdminDashboard } from './components/AdminDashboard'
import { Confession, FinalInvitation, Landing, MemoryQuiz, RapidFire, RomanticQuiz } from './components/Scenes'
import { useSound } from './hooks/useSound'
import { sendFinalReport, trackAnswer } from './lib/tracking'
import type { Answer, DatePlan } from './types'

export default function App() {
  const [scene, setScene] = useState(0)
  const [light, setLight] = useState(false)
  const [burst, setBurst] = useState(0)
  const [heartRain, setHeartRain] = useState(false)
  const answersRef = useRef<Answer[]>([])
  const { musicOn, toggleMusic, tone } = useSound()
  const isAdmin = window.location.hash === '#admin'

  useEffect(() => {
    const move = (event: PointerEvent) => {
      const heart = document.getElementById('cursor-heart')
      if (heart) heart.style.transform = `translate3d(${event.clientX + 10}px, ${event.clientY + 10}px, 0)`
    }
    window.addEventListener('pointermove', move)
    return () => window.removeEventListener('pointermove', move)
  }, [])

  if (isAdmin) return <AdminDashboard />

  const save = (question: string, answer: string, category: Answer['category']) => {
    const entry: Answer = { question, answer, category, timestamp: new Date().toISOString() }
    answersRef.current = [...answersRef.current, entry]
    void trackAnswer(entry)
  }

  const celebrate = () => {
    setBurst(v => v + 1); setHeartRain(true)
    window.setTimeout(() => setHeartRain(false), 7000)
    confetti({ particleCount: 180, spread: 100, startVelocity: 52, origin: { y: .7 }, colors: ['#fb7185', '#f472b6', '#c084fc', '#fde68a', '#ffffff'] })
    const end = Date.now() + 2600
    const fireworks = window.setInterval(() => {
      if (Date.now() > end) return window.clearInterval(fireworks)
      confetti({ particleCount: 35, spread: 360, startVelocity: 28, ticks: 70, origin: { x: .15 + Math.random() * .7, y: .15 + Math.random() * .35 }, colors: ['#f9a8d4', '#d8b4fe', '#ffffff'] })
    }, 320)
    ;[784, 988, 1175, 1318].forEach((note, i) => window.setTimeout(() => tone(note, .35, .035), i * 180))
  }

  const next = () => setScene(value => Math.min(5, value + 1))
  const replay = () => { answersRef.current = []; setScene(0) }
  const report = (plan?: DatePlan) => { void sendFinalReport(answersRef.current, plan) }
  const scenes = [
    <Landing next={next} tone={tone} />,
    <MemoryQuiz next={next} tone={tone} save={save} />,
    <RapidFire next={next} tone={tone} save={save} />,
    <RomanticQuiz next={next} tone={tone} save={save} />,
    <Confession next={next} tone={tone} />,
    <FinalInvitation tone={tone} save={save} celebrate={celebrate} onReport={report} replay={replay} />,
  ]

  return <div className={`story-bg relative min-h-screen overflow-hidden transition-colors duration-700 ${light ? 'light' : ''}`}>
    <div className="noise pointer-events-none absolute inset-0" />
    <Ambience starry={scene >= 3} />
    <CursorHearts />
    {burst > 0 && <HeartBurst id={burst} />}
    {heartRain && <HeartRain />}
    <header className="relative z-20 flex items-center justify-between px-5 py-5 sm:px-8">
      <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[.25em] opacity-60"><span className="text-pink-400">♥</span> Mansi × Rahul</div>
      <div className="flex gap-2">
        <a href="#admin" aria-label="Open private admin" className="glass grid h-10 w-10 place-items-center rounded-full opacity-50 transition hover:opacity-100"><Settings size={15} /></a>
        <button onClick={() => { toggleMusic(); tone(500, .05) }} aria-label={musicOn ? 'Turn music off' : 'Turn music on'} className="glass grid h-10 w-10 place-items-center rounded-full">{musicOn ? <Music2 size={16} /> : <VolumeX size={16} />}</button>
        <button onClick={() => setLight(v => !v)} aria-label="Toggle color mode" className="glass grid h-10 w-10 place-items-center rounded-full">{light ? <Moon size={16} /> : <Sun size={16} />}</button>
      </div>
    </header>
    <div className="relative flex min-h-[calc(100vh-132px)] items-center px-4 py-8 sm:px-6">
      <AnimatePresence mode="wait"><motion.div key={scene} className="w-full">{scenes[scene]}</motion.div></AnimatePresence>
    </div>
    <footer className="relative z-20 flex items-center justify-center gap-2 pb-5" aria-label={`Scene ${scene + 1} of 6`}>
      {Array.from({ length: 6 }, (_, i) => <motion.span key={i} animate={{ width: i === scene ? 24 : 5, opacity: i <= scene ? 1 : .25 }} className="h-1 rounded-full bg-pink-300" />)}
    </footer>
  </div>
}
