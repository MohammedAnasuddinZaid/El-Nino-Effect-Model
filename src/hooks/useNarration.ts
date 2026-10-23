import { useCallback, useEffect, useRef, useState } from 'react'
import type { Language } from '../data/i18n'

type UseNarrationOptions = {
  src?: string
  /** The chapter that will play next, warmed in advance so there is no gap. */
  preloadSrc?: string
  fallbackText: string
  language: Language
  enabled: boolean
  onEnd?: () => void
}

const NATURAL_VOICE = /natural|neural|wavenet|premium|enhanced|studio|expressive/i
const PREFERRED_VOICE =
  /neerja|swara|aarav|madhur|aria|jenny|sonia|priya|veena|heera|samantha|serena|libby|emma|ava|allison|karen|moira|tessa|fiona/i
const MALE_VOICE = /\bmale\b|prabhat|madhur|david|mark|guy|ryan|george|daniel|alex|fred|tom\b/i

/** One shared element per file, kept warm between chapters. */
const audioCache = new Map<string, HTMLAudioElement>()

function getAudio(src: string) {
  let element = audioCache.get(src)
  if (!element) {
    element = new Audio()
    element.preload = 'auto'
    element.src = src
    audioCache.set(src, element)
  }
  return element
}

export function preloadNarration(src?: string) {
  if (!src || typeof Audio === 'undefined') return
  const element = getAudio(src)
  if (element.readyState < 2) {
    try {
      element.load()
    } catch {
      // The browser will fetch it when it is actually played.
    }
  }
}

function targetLanguage(language: Language) {
  return language === 'hi' ? 'hi' : 'en'
}

function scoreVoice(voice: SpeechSynthesisVoice, language: Language) {
  const lang = targetLanguage(language)
  let score = 0
  if (voice.lang.toLowerCase().startsWith(lang)) score += 40
  if (language === 'hi' && /hi-IN/i.test(voice.lang)) score += 55
  if (language === 'en' && /en-IN/i.test(voice.lang)) score += 55
  if (language === 'en' && /en-GB/i.test(voice.lang)) score += 18
  if (NATURAL_VOICE.test(voice.name)) score += 90
  if (/google/i.test(voice.name)) score += 32
  if (PREFERRED_VOICE.test(voice.name)) score += 46
  if (MALE_VOICE.test(voice.name)) score -= 18
  if (!voice.localService) score += 8
  return score
}

function pickVoice(voices: SpeechSynthesisVoice[], language: Language) {
  return voices
    .filter((voice) => voice.lang.toLowerCase().startsWith(targetLanguage(language)))
    .slice()
    .sort((a, b) => scoreVoice(b, language) - scoreVoice(a, language))[0]
}

/**
 * The pre-generated MP3s are the primary voice, so the fallback only has to be
 * decent. Keep it to a single utterance wherever possible — splitting by sentence
 * is what makes speech synthesis sound choppy.
 */
function toPhrases(text: string) {
  const cleaned = text.replace(/\s+/g, ' ').trim()
  if (!cleaned) return []
  if (cleaned.length <= 620) return [cleaned]
  const parts = cleaned.match(/[^.!?।]+[.!?।]+["')\]]?|[^.!?।]+$/g) ?? [cleaned]
  const phrases: string[] = []
  let current = ''
  for (const part of parts) {
    if ((current + part).length > 260 && current) {
      phrases.push(current.trim())
      current = part
    } else {
      current += part
    }
  }
  if (current.trim()) phrases.push(current.trim())
  return phrases.filter(Boolean)
}

function fadeAudio(audio: HTMLAudioElement, to: number, duration = 260, done?: () => void) {
  const from = audio.volume
  const start = performance.now()
  let frame = 0
  const tick = (now: number) => {
    const t = Math.min(1, (now - start) / duration)
    const eased = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2
    audio.volume = Math.min(1, Math.max(0, from + (to - from) * eased))
    if (t < 1) {
      frame = requestAnimationFrame(tick)
    } else {
      done?.()
    }
  }
  frame = requestAnimationFrame(tick)
  return () => {
    cancelAnimationFrame(frame)
  }
}

export function useNarration({
  src,
  preloadSrc,
  fallbackText,
  language,
  enabled,
  onEnd,
}: UseNarrationOptions) {
  const [supported, setSupported] = useState(false)
  const [speaking, setSpeaking] = useState(false)
  const tokenRef = useRef(0)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const voiceRef = useRef<SpeechSynthesisVoice | null>(null)
  const timerRef = useRef<number | null>(null)
  const cancelFadeRef = useRef<(() => void) | null>(null)
  const onEndRef = useRef(onEnd)
  const enabledRef = useRef(enabled)

  useEffect(() => {
    onEndRef.current = onEnd
  }, [onEnd])

  useEffect(() => {
    enabledRef.current = enabled
  }, [enabled])

  useEffect(() => {
    if (typeof window === 'undefined') return
    setSupported(typeof Audio !== 'undefined' || 'speechSynthesis' in window)
    if (!('speechSynthesis' in window)) return
    const refresh = () => {
      const voices = window.speechSynthesis.getVoices()
      if (voices.length) voiceRef.current = pickVoice(voices, language)
    }
    refresh()
    window.speechSynthesis.addEventListener?.('voiceschanged', refresh)
    return () => window.speechSynthesis.removeEventListener?.('voiceschanged', refresh)
  }, [language])

  // Warm the next chapter while the current one is still speaking.
  useEffect(() => {
    preloadNarration(preloadSrc)
  }, [preloadSrc])

  const release = useCallback((audio: HTMLAudioElement) => {
    audio.onended = null
    audio.onerror = null
    audio.oncanplay = null
    audio.pause()
  }, [])

  const stop = useCallback(() => {
    tokenRef.current += 1
    if (timerRef.current) window.clearTimeout(timerRef.current)
    timerRef.current = null
    cancelFadeRef.current?.()
    cancelFadeRef.current = null
    if (audioRef.current) {
      release(audioRef.current)
      audioRef.current.volume = 0
      audioRef.current = null
    }
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel()
    }
    setSpeaking(false)
  }, [release])

  const speakFallback = useCallback(
    (value: string, token: number) => {
      if (typeof window === 'undefined' || !('speechSynthesis' in window)) return
      const phrases = toPhrases(value)
      if (!phrases.length) {
        if (enabledRef.current && token === tokenRef.current) onEndRef.current?.()
        return
      }
      const synth = window.speechSynthesis
      synth.cancel()
      const voice = voiceRef.current ?? pickVoice(synth.getVoices(), language)
      let index = 0
      setSpeaking(true)
      const next = () => {
        if (token !== tokenRef.current || !enabledRef.current) return
        if (index >= phrases.length) {
          setSpeaking(false)
          if (enabledRef.current) onEndRef.current?.()
          return
        }
        const phrase = phrases[index]
        index += 1
        const utterance = new SpeechSynthesisUtterance(phrase)
        utterance.rate = language === 'hi' ? 0.94 : 0.97
        utterance.pitch = language === 'hi' ? 1.0 : 0.98
        utterance.volume = 0.96
        if (voice) {
          utterance.voice = voice
          utterance.lang = voice.lang
        } else {
          utterance.lang = language === 'hi' ? 'hi-IN' : 'en-IN'
        }
        utterance.onend = () => {
          if (token !== tokenRef.current || !enabledRef.current) return
          timerRef.current = window.setTimeout(next, 40)
        }
        utterance.onerror = (event) => {
          if (token !== tokenRef.current || !enabledRef.current) return
          if (event.error === 'interrupted' || event.error === 'canceled') return
          timerRef.current = window.setTimeout(next, 40)
        }
        if (synth.paused) synth.resume()
        synth.speak(utterance)
      }
      next()
    },
    [language],
  )

  const replay = useCallback(() => {
    if (!enabledRef.current) return
    const token = tokenRef.current + 1
    tokenRef.current = token
    if (src) {
      const audio = getAudio(src)
      audio.currentTime = 0
      void audio.play().catch(() => speakFallback(fallbackText, token))
      return
    }
    speakFallback(fallbackText, token)
  }, [fallbackText, speakFallback, src])

  useEffect(() => {
    if (!enabled) {
      stop()
      return
    }

    tokenRef.current += 1
    const token = tokenRef.current
    if (timerRef.current) window.clearTimeout(timerRef.current)
    timerRef.current = null
    cancelFadeRef.current?.()
    cancelFadeRef.current = null
    if (audioRef.current) {
      release(audioRef.current)
      audioRef.current = null
    }
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel()
    }

    const fallback = () => {
      if (token !== tokenRef.current || !enabledRef.current) return
      speakFallback(fallbackText, token)
    }

    if (!src) {
      fallback()
      return
    }

    const audio = getAudio(src)
    audio.volume = 0.62
    audioRef.current = audio
    let failed = false
    const fail = () => {
      if (failed || token !== tokenRef.current || !enabledRef.current) return
      failed = true
      setSpeaking(false)
      if (audioRef.current === audio) audioRef.current = null
      fallback()
    }
    audio.onerror = fail
    audio.onended = () => {
      if (token !== tokenRef.current || !enabledRef.current) return
      setSpeaking(false)
      if (audioRef.current === audio) audioRef.current = null
      // The next chapter is already warm, so hand over straight away.
      preloadNarration(preloadSrc)
      onEndRef.current?.()
    }

    const start = () => {
      if (token !== tokenRef.current || !enabledRef.current) return
      setSpeaking(true)
      audio.currentTime = 0
      void audio
        .play()
        .then(() => {
          if (token !== tokenRef.current) return
          cancelFadeRef.current = fadeAudio(audio, 0.94, 240)
        })
        .catch(fail)
    }

    if (audio.readyState >= 2) start()
    else audio.oncanplay = start
    if (audio.readyState < 2) {
      try {
        audio.load()
      } catch {
        // ignore
      }
    }

    return () => {
      if (token === tokenRef.current) tokenRef.current += 1
      cancelFadeRef.current?.()
      cancelFadeRef.current = null
      release(audio)
      if (audioRef.current === audio) audioRef.current = null
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel()
      }
      setSpeaking(false)
    }
  }, [enabled, fallbackText, preloadSrc, release, speakFallback, src, stop])

  useEffect(() => {
    return () => {
      tokenRef.current += 1
      cancelFadeRef.current?.()
      if (audioRef.current) audioRef.current.pause()
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel()
      }
    }
  }, [])

  return { supported, speaking, stop, replay }
}