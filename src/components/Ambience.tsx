import { motion } from 'framer-motion'

const particles = Array.from({ length: 24 }, (_, i) => ({
  id: i, left: `${(i * 37) % 100}%`, top: `${(i * 61) % 100}%`, delay: (i % 7) * .7, size: 2 + (i % 4),
}))

export function Ambience({ starry = false }: { starry?: boolean }) {
  return <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
    {starry && <motion.div initial={{ opacity: 0 }} animate={{ opacity: .35 }} className="star-field absolute inset-0" />}
    {particles.map(p => <motion.span key={p.id} className="absolute rounded-full bg-pink-200" style={{ left: p.left, top: p.top, width: p.size, height: p.size }} animate={{ y: [0, -22, 0], opacity: [.08, .5, .08], scale: [1, 1.5, 1] }} transition={{ duration: 5 + p.id % 4, delay: p.delay, repeat: Infinity, ease: 'easeInOut' }} />)}
    {Array.from({ length: 9 }, (_, i) => <motion.span key={`heart-${i}`} className="absolute text-pink-300/20" style={{ left: `${8 + i * 11}%`, bottom: -30, fontSize: 12 + (i % 4) * 6 }} animate={{ y: [0, -900], x: [0, i % 2 ? 40 : -35], rotate: [0, i % 2 ? 25 : -25], opacity: [0, .45, 0] }} transition={{ duration: 12 + i, delay: i * 1.6, repeat: Infinity, ease: 'linear' }}>♥</motion.span>)}
  </div>
}

export function CursorHearts() {
  return <motion.div className="pointer-events-none fixed z-30 hidden h-6 w-6 place-items-center text-pink-300 md:grid" animate={{ rotate: [0, 10, -8, 0] }} transition={{ repeat: Infinity, duration: 2 }} style={{ x: -100, y: -100 }} id="cursor-heart">♥</motion.div>
}

export function HeartBurst({ id }: { id: number }) {
  return <div key={id} className="pointer-events-none fixed inset-0 z-40 grid place-items-center" aria-hidden>
    {Array.from({ length: 20 }, (_, i) => <motion.span key={i} className="absolute text-xl text-pink-300" initial={{ x: 0, y: 0, scale: 0, opacity: 1 }} animate={{ x: Math.cos(i / 20 * Math.PI * 2) * (110 + i * 5), y: Math.sin(i / 20 * Math.PI * 2) * (110 + i * 5), scale: [0, 1.4, .4], opacity: 0, rotate: i * 35 }} transition={{ duration: 1.2, ease: 'easeOut' }}>♥</motion.span>)}
  </div>
}

export function HeartRain() {
  return <div className="pointer-events-none fixed inset-0 z-40 overflow-hidden" aria-hidden>{Array.from({ length: 34 }, (_, i) => <motion.span key={i} initial={{ y: -80, x: `${(i * 31) % 100}vw`, opacity: 0, rotate: 0 }} animate={{ y: '110vh', opacity: [0, 1, 1, 0], rotate: i % 2 ? 320 : -320 }} transition={{ duration: 3.5 + i % 4, delay: (i % 12) * .18, ease: 'linear' }} className="absolute text-pink-300" style={{ fontSize: 14 + i % 5 * 5 }}>♥</motion.span>)}</div>
}
