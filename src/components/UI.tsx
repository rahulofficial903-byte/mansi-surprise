import { motion, type HTMLMotionProps } from 'framer-motion'
import type { ReactNode } from 'react'

export function StoryCard({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <motion.main initial={{ opacity: 0, y: 24, scale: .97 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -18, scale: .98 }} transition={{ duration: .48, ease: [0.22, 1, 0.36, 1] }} className={`glass relative z-10 mx-auto w-full max-w-2xl rounded-[2rem] px-6 py-9 text-center sm:px-12 sm:py-12 ${className}`}>{children}</motion.main>
}

export function Eyebrow({ children }: { children: ReactNode }) {
  return <p className="mb-4 text-[10px] font-bold uppercase tracking-[.35em] text-pink-300">{children}</p>
}

export function PrimaryButton({ children, className = '', ...props }: HTMLMotionProps<'button'>) {
  return <motion.button whileHover={{ scale: 1.035 }} whileTap={{ scale: .96 }} className={`premium-button rounded-full bg-gradient-to-r from-pink-500 via-rose-500 to-purple-600 px-7 py-3.5 text-sm font-bold text-white transition disabled:opacity-50 ${className}`} {...props}>{children}</motion.button>
}

export function ChoiceButton({ children, className = '', ...props }: HTMLMotionProps<'button'>) {
  return <motion.button whileHover={{ y: -2, borderColor: 'rgba(249,168,212,.7)' }} whileTap={{ scale: .97 }} className={`rounded-full border border-white/20 bg-white/10 px-6 py-3.5 text-sm font-semibold shadow-lg backdrop-blur-md transition ${className}`} {...props}>{children}</motion.button>
}

export function ScreenTitle({ children }: { children: ReactNode }) {
  return <h1 className="font-display text-4xl font-bold leading-[.95] sm:text-6xl">{children}</h1>
}
