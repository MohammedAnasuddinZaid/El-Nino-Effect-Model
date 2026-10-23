import { useCallback, useEffect, useState } from 'react'

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>
}

function isStandalone() {
  if (typeof window === 'undefined') return false
  const modes = ['standalone', 'fullscreen', 'minimal-ui']
  if (modes.some((mode) => window.matchMedia(`(display-mode: ${mode})`).matches)) return true
  return (window.navigator as Navigator & { standalone?: boolean }).standalone === true
}

function isIosLike() {
  if (typeof navigator === 'undefined') return false
  const ua = navigator.userAgent
  const apple = /iPad|iPhone|iPod/.test(ua) || (/Macintosh/.test(ua) && navigator.maxTouchPoints > 1)
  return apple
}

/**
 * "Install as an app" flow. Chrome/Edge/Android fire beforeinstallprompt, so we
 * can offer a real one-tap install. iOS has no such event, so we surface the
 * Share → Add to Home Screen steps instead.
 */
export function useInstallPrompt() {
  const [deferred, setDeferred] = useState<BeforeInstallPromptEvent | null>(null)
  const [installed, setInstalled] = useState(isStandalone)
  const [iosLike] = useState(isIosLike)
  const [hintOpen, setHintOpen] = useState(false)

  useEffect(() => {
    const onPrompt = (event: Event) => {
      event.preventDefault()
      setDeferred(event as BeforeInstallPromptEvent)
    }
    const onInstalled = () => {
      setInstalled(true)
      setDeferred(null)
      setHintOpen(false)
    }
    const media = window.matchMedia('(display-mode: standalone)')
    const onDisplayChange = () => setInstalled(isStandalone())

    window.addEventListener('beforeinstallprompt', onPrompt)
    window.addEventListener('appinstalled', onInstalled)
    media.addEventListener?.('change', onDisplayChange)
    return () => {
      window.removeEventListener('beforeinstallprompt', onPrompt)
      window.removeEventListener('appinstalled', onInstalled)
      media.removeEventListener?.('change', onDisplayChange)
    }
  }, [])

  const install = useCallback(async () => {
    if (deferred) {
      const event = deferred
      setDeferred(null)
      try {
        await event.prompt()
        const choice = await event.userChoice
        if (choice.outcome === 'accepted') setInstalled(true)
      } catch {
        setHintOpen(true)
      }
      return
    }
    setHintOpen(true)
  }, [deferred])

  const closeHint = useCallback(() => setHintOpen(false), [])

  return { canInstall: !installed, installed, iosLike, hintOpen, install, closeHint }
}
