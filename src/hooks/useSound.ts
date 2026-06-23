import { useCallback, useEffect, useRef, useState } from 'react'

export function useSound() {
  const context = useRef<AudioContext | null>(null)
  const timer = useRef<number | null>(null)
  const [musicOn, setMusicOn] = useState(false)

  const getContext = useCallback(() => {
    context.current ??= new AudioContext()
    return context.current
  }, [])

  const tone = useCallback((frequency = 520, duration = .08, volume = .035) => {
    const ctx = getContext()
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.type = 'sine'; osc.frequency.value = frequency
    gain.gain.setValueAtTime(volume, ctx.currentTime)
    gain.gain.exponentialRampToValueAtTime(.0001, ctx.currentTime + duration)
    osc.connect(gain).connect(ctx.destination); osc.start(); osc.stop(ctx.currentTime + duration)
  }, [getContext])

  const toggleMusic = useCallback(() => {
    setMusicOn(value => {
      const next = !value
      if (next) {
        let step = 0
        const notes = [261.6, 329.6, 392, 329.6, 293.7, 349.2, 440, 349.2]
        tone(notes[0], .7, .018)
        timer.current = window.setInterval(() => tone(notes[++step % notes.length], .7, .018), 720)
      } else if (timer.current) window.clearInterval(timer.current)
      return next
    })
  }, [tone])

  useEffect(() => () => { if (timer.current) window.clearInterval(timer.current); context.current?.close() }, [])
  return { musicOn, toggleMusic, tone }
}
