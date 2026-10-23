import { useCallback, useEffect, useRef, useState } from 'react'

type UseNarrationOptions = {
  text: string
  enabled: boolean
  onEnd?: () => void
}

const NATURAL_VOICE = /natural|neural|wavenet|premium|enhanced|studio/i
const PREFERRED_VOICE =
  /aria|jenny|sonia|neerja|priya|veena|heera|samantha|serena|libby|emma|ava|allison|karen|moira|tessa|fiona|google uk english female/i
const MALE_VOICE = /\bmale\b|david|mark|guy|ryan|george|daniel|alex|fred|tom\b/i

function scoreVoice(voice: SpeechSynthesisVoice) {
  let score = 0
  if (/^en/i.test(voice.lang)) score += 20
  if (/en-IN/i.test(voice.lang)) score += 34
  if (/en-GB/i.test(voice.lang)) score += 16
  if (NATURAL_VOICE.test(voice.name)) score += 80
  if (/google/i.test(voice.name)) score += 28
  if (PREFERRED_VOICE.test(voice.name)) score += 40
  if (MALE_VOICE.test(voice.name)) score -= 24
  if (!voice.localService) score += 8
  return score
}

function pickVoice(voices: SpeechSynthesisVoice[]) {
  return voices
    .filter((voice) => /^en/i.test(voice.lang))
    .slice()
    .sort((a, b) => scoreVoice(b) - scoreVoice(a))[0]
}

/** Split long copy into calm, single-sentence utterances. */
function toPhrases(text: string) {
  const cleaned = text.replace(/\s+/g, ' ').trim()
  if (!cleaned) return []
  const parts = cleaned.match(/[^.!?]+[.!?]+["')\]]?|[^.!?]+$/g) ?? [cleaned]
  return parts
    .flatMap((part) => {
      if (part.length <= 190) return [part.trim()]
      const clauses = part.match(/[^,;:]+[,;:]+|[^,;:]+$/g) ?? [part]
      const phrases: string[] = []
      let current = ''
      for (const clause of clauses) {
        if ((current + clause).length > 190 && current) {
          phrases.push(current.trim())
          current = clause
        } else {
          current += clause
        }
      }
      if (current.trim()) phrases.push(current.trim())
      return phrases
    })
    .filter(Boolean)
}

export function useNarration({ text, enabled, onEnd }: UseNarrationOptions) {
  const [supported, setSupported] = useState(false)
  const [speaking, setSpeaking] = useState(false)
  const enabledRef = useRef(enabled)
  const onEndRef = useRef(onEnd)
  const tokenRef = useRef(0)
  const timerRef = useRef<number | null>(null)
  const voiceRef = useRef<SpeechSynthesisVoice | null>(null)

  useEffect(() => {
    enabledRef.current = enabled
  }, [enabled])

  useEffect(() => {
    onEndRef.current = onEnd
  }, [onEnd])

  useEffect(() => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return
    setSupported(true)
    const refresh = () => {
      const voices = window.speechSynthesis.getVoices()
      if (voices.length) voiceRef.current = pickVoice(voices)
    }
    refresh()
    window.speechSynthesis.addEventListener?.('voiceschanged', refresh)
    return () => {
      window.speechSynthesis.removeEventListener?.('voiceschanged', refresh)
    }
  }, [])

  const stop = useCallback(() => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return
    tokenRef.current += 1
    if (timerRef.current) window.clearTimeout(timerRef.current)
    timerRef.current = null
    window.speechSynthesis.cancel()
    setSpeaking(false)
  }, [])

  const speak = useCallback((value: string) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return
    const phrases = toPhrases(value)
    if (!phrases.length) return

    tokenRef.current += 1
    const token = tokenRef.current
    if (timerRef.current) window.clearTimeout(timerRef.current)
    const synth = window.speechSynthesis
    synth.cancel()
    setSpeaking(true)

    let index = 0
    const next = () => {
      if (token !== tokenRef.current) return
      if (index >= phrases.length) {
        setSpeaking(false)
        onEndRef.current?.()
        return
      }
      const phrase = phrases[index]
      index += 1
      const utterance = new SpeechSynthesisUtterance(phrase)
      utterance.rate = 0.9
      utterance.pitch = 0.96
      utterance.volume = 0.95
      const voice = voiceRef.current ?? pickVoice(synth.getVoices())
      if (voice) {
        utterance.voice = voice
        utterance.lang = voice.lang
      }
      utterance.onend = () => {
        if (token !== tokenRef.current) return
        timerRef.current = window.setTimeout(next, 150)
      }
      utterance.onerror = (event) => {
        if (token !== tokenRef.current) return
        if (event.error === 'interrupted' || event.error === 'canceled') return
        timerRef.current = window.setTimeout(next, 100)
      }
      if (synth.paused) synth.resume()
      synth.speak(utterance)
    }

    // A short beat after cancel() prevents Chrome from swallowing the first phrase.
    timerRef.current = window.setTimeout(next, 130)
  }, [])

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
      // Chapter changes create a new utterance; speak() cancels the previous queue.
    }
  }, [enabled, supported, speak, stop, text])

  useEffect(() => {
    return () => {
      stop()
    }
  }, [stop])

  return { supported, speaking, stop, speak, restart }
}
