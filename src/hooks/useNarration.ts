import { useCallback, useEffect, useRef, useState } from 'react'

type UseNarrationOptions = {
  text: string
  enabled: boolean
  onEnd?: () => void
}

export function useNarration({ text, enabled, onEnd }: UseNarrationOptions) {
  const [supported, setSupported] = useState(false)
  const [speaking, setSpeaking] = useState(false)
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null)
  const enabledRef = useRef(enabled)
  const onEndRef = useRef(onEnd)

  useEffect(() => {
    enabledRef.current = enabled
  }, [enabled])

  useEffect(() => {
    onEndRef.current = onEnd
  }, [onEnd])

  useEffect(() => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return
    setSupported(true)
    // Voices are populated asynchronously in most browsers.
    const warm = () => window.speechSynthesis.getVoices()
    warm()
    window.speechSynthesis.addEventListener?.('voiceschanged', warm)
    return () => {
      window.speechSynthesis.removeEventListener?.('voiceschanged', warm)
    }
  }, [])

  const stop = useCallback(() => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return
    window.speechSynthesis.cancel()
    setSpeaking(false)
  }, [])

  const speak = useCallback(
    (value: string) => {
      if (typeof window === 'undefined' || !('speechSynthesis' in window)) return
      if (!value.trim()) return
      window.speechSynthesis.cancel()
      const utterance = new SpeechSynthesisUtterance(value)
      utterance.rate = 0.94
      utterance.pitch = 1
      utterance.volume = 1
      const voices = window.speechSynthesis.getVoices()
      const preferred =
        voices.find((voice) => /en-IN/i.test(voice.lang) && /female|priya|veena|heera/i.test(voice.name)) ??
        voices.find((voice) => /en-IN/i.test(voice.lang)) ??
        voices.find((voice) => /en-GB/i.test(voice.lang)) ??
        voices.find((voice) => /^en/i.test(voice.lang))
      if (preferred) utterance.voice = preferred
      utterance.onstart = () => setSpeaking(true)
      utterance.onend = () => {
        setSpeaking(false)
        onEndRef.current?.()
      }
      utterance.onerror = () => setSpeaking(false)
      utteranceRef.current = utterance
      window.speechSynthesis.speak(utterance)
    },
    [],
  )

  const restart = useCallback(() => {
    if (enabledRef.current) speak(text)
  }, [speak, text])

  useEffect(() => {
    if (!enabled) {
      stop()
      return
    }
    if (supported) speak(text)
    return () => {
      // Deliberately don't cancel here: chapter changes trigger a new utterance
      // and the next effect cancels the previous one through speak().
    }
  }, [enabled, supported, speak, stop, text])

  useEffect(() => {
    return () => {
      stop()
    }
  }, [stop])

  return { supported, speaking, stop, speak, restart }
}
