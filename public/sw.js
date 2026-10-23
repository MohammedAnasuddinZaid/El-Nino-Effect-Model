/* Every Drop Has a Story — offline shell.
 * Registered from main.tsx in production only.
 */
const VERSION = 'every-drop-v1'
const SHELL = `${VERSION}-shell`
const RUNTIME = `${VERSION}-runtime`
const MEDIA = `${VERSION}-media`

const SHELL_FILES = ['/', '/index.html', '/manifest.webmanifest', '/favicon.svg']
const MEDIA_LIMIT = 40

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(SHELL)
      .then((cache) => cache.addAll(SHELL_FILES))
      .catch(() => undefined)
      .then(() => self.skipWaiting()),
  )
})

self.addEventListener('activate', (event) => {
  const keep = new Set([SHELL, RUNTIME, MEDIA])
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((key) => !keep.has(key)).map((key) => caches.delete(key))))
      .then(() => self.clients.claim()),
  )
})

async function trim(cacheName, limit) {
  const cache = await caches.open(cacheName)
  const keys = await cache.keys()
  if (keys.length <= limit) return
  await Promise.all(keys.slice(0, keys.length - limit).map((key) => cache.delete(key)))
}

function isMedia(url) {
  return /\.(mp3|m4a|ogg|wav)$/i.test(url.pathname)
}

self.addEventListener('fetch', (event) => {
  const { request } = event
  if (request.method !== 'GET') return

  const url = new URL(request.url)
  if (url.origin !== self.location.origin) return

  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((response) => {
          const copy = response.clone()
          caches.open(SHELL).then((cache) => cache.put('/index.html', copy)).catch(() => undefined)
          return response
        })
        .catch(() => caches.match('/index.html').then((hit) => hit || caches.match('/'))),
    )
    return
  }

  if (isMedia(url)) {
    event.respondWith(
      caches.match(request).then((hit) => {
        if (hit) return hit
        return fetch(request)
          .then((response) => {
            if (response.ok && response.type === 'basic') {
              const copy = response.clone()
              caches
                .open(MEDIA)
                .then((cache) => cache.put(request, copy))
                .then(() => trim(MEDIA, MEDIA_LIMIT))
                .catch(() => undefined)
            }
            return response
          })
          .catch(() => hit)
      }),
    )
    return
  }

  event.respondWith(
    caches.match(request).then((hit) => {
      const network = fetch(request)
        .then((response) => {
          if (response.ok && response.type === 'basic') {
            const copy = response.clone()
            caches
              .open(RUNTIME)
              .then((cache) => cache.put(request, copy))
              .catch(() => undefined)
          }
          return response
        })
        .catch(() => hit)
      return hit || network
    }),
  )
})
