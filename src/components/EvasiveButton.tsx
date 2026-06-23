import { motion } from 'framer-motion'
import { useState } from 'react'

type Props = { labels: string[]; onCaught: () => void; shrink?: boolean }

export function EvasiveButton({ labels, onCaught, shrink = false }: Props) {
  const [position, setPosition] = useState({ x: 0, y: 0, rotate: 0, scale: 1 })
  const [label, setLabel] = useState('NO 🚫')
  const [escapes, setEscapes] = useState(0)

  const escape = () => {
    const rangeX = Math.min(window.innerWidth * .28, 180)
    const rangeY = Math.min(window.innerHeight * .18, 110)
    setPosition({ x: (Math.random() - .5) * rangeX * 2, y: (Math.random() - .5) * rangeY * 2, rotate: (Math.random() - .5) * 24, scale: shrink ? Math.max(.62, 1 - (escapes + 1) * .07) : 1 })
    setLabel(labels[Math.floor(Math.random() * labels.length)])
    setEscapes(v => v + 1)
  }

  return <motion.button animate={position} onPointerEnter={escape} onPointerDown={escapes < 3 ? escape : undefined} onClick={onCaught} transition={{ type: 'spring', stiffness: 420, damping: 24 }} className="relative z-20 max-w-[220px] rounded-full border border-white/20 bg-white/10 px-6 py-3.5 text-sm font-semibold shadow-lg backdrop-blur-md">{label}</motion.button>
}
