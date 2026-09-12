'use client'

/**
 * Web Audio API based Sound Effects Generator
 * This creates retro RPG sounds without needing external mp3 files!
 */

const createAudioContext = () => {
  if (typeof window === 'undefined') return null
  return new (window.AudioContext || (window as any).webkitAudioContext)()
}

let audioCtx: AudioContext | null = null

export const playSound = (type: 'sword' | 'levelup' | 'reward') => {
  if (typeof window === 'undefined') return
  if (!audioCtx) audioCtx = createAudioContext()
  if (!audioCtx) return

  const osc = audioCtx.createOscillator()
  const gainNode = audioCtx.createGain()

  osc.connect(gainNode)
  gainNode.connect(audioCtx.destination)

  const now = audioCtx.currentTime

  if (type === 'sword') {
    // Sharp metal clash sound
    osc.type = 'sawtooth'
    osc.frequency.setValueAtTime(800, now)
    osc.frequency.exponentialRampToValueAtTime(100, now + 0.1)
    
    gainNode.gain.setValueAtTime(0, now)
    gainNode.gain.linearRampToValueAtTime(0.5, now + 0.02)
    gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.2)
    
    osc.start(now)
    osc.stop(now + 0.2)
  } 
  else if (type === 'levelup') {
    // Epic ascending arpeggio
    osc.type = 'square'
    
    // Sequence of notes (C5, E5, G5, C6)
    osc.frequency.setValueAtTime(523.25, now)
    osc.frequency.setValueAtTime(659.25, now + 0.1)
    osc.frequency.setValueAtTime(783.99, now + 0.2)
    osc.frequency.setValueAtTime(1046.50, now + 0.3)
    
    gainNode.gain.setValueAtTime(0, now)
    gainNode.gain.linearRampToValueAtTime(0.3, now + 0.05)
    gainNode.gain.setValueAtTime(0.3, now + 0.4)
    gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.8)
    
    osc.start(now)
    osc.stop(now + 0.8)
  }
  else if (type === 'reward') {
    // Happy coin sound
    osc.type = 'sine'
    osc.frequency.setValueAtTime(987.77, now) // B5
    osc.frequency.setValueAtTime(1318.51, now + 0.1) // E6
    
    gainNode.gain.setValueAtTime(0, now)
    gainNode.gain.linearRampToValueAtTime(0.4, now + 0.02)
    gainNode.gain.setValueAtTime(0.4, now + 0.1)
    gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.4)
    
    osc.start(now)
    osc.stop(now + 0.4)
  }
}
