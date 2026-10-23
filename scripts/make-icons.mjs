/**
 * Rasterise the exhibit favicon into the PNG icons a PWA needs.
 *
 * Usage:
 *   npm run icons
 *
 * The source mark is the same raindrop-over-waterline used by public/favicon.svg,
 * so the installed app keeps the exhibit's identity instead of a generic glyph.
 */
import { mkdir, writeFile } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'

const here = dirname(fileURLToPath(import.meta.url))
const outDir = resolve(here, '..', 'public', 'icons')

const BG = '#160c06'
const BG_DEEP = '#100904'

const mark = `
  <path d="M32 7.5c7.7 11.3 14.2 19.7 14.2 28.8A14.2 14.2 0 0 1 17.8 36.3C17.8 27.2 24.3 18.8 32 7.5Z"
    fill="none" stroke="#ffedd7" stroke-width="3.1" stroke-linejoin="round" />
  <path d="M32 18.4c4.1 6.2 7.6 11.2 7.6 16.7a7.6 7.6 0 0 1-15.2 0c0-5.5 3.5-10.5 7.6-16.7Z"
    fill="#dc5000" />
  <path d="M21.5 46.2c6.9 3.6 14.1 3.6 21 0"
    fill="none" stroke="#b9d6d1" stroke-width="2.7" stroke-linecap="round" />
`

/** Rounded app icon, matching the browser favicon. */
function badge(background = BG) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="64" height="64">
    <rect width="64" height="64" rx="15" fill="${background}" />
    ${mark}
  </svg>`
}

/** Full-bleed icon with the mark inside the maskable safe zone. */
function maskable(background = BG_DEEP) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="64" height="64">
    <rect width="64" height="64" fill="${background}" />
    <g transform="translate(32 32) scale(0.68) translate(-32 -32)">${mark}</g>
  </svg>`
}

async function render(svg, size, file) {
  const png = await sharp(Buffer.from(svg)).resize(size, size).png({ compressionLevel: 9 }).toBuffer()
  await writeFile(resolve(outDir, file), png)
  return `${file} (${size}×${size})`
}

await mkdir(outDir, { recursive: true })

const written = await Promise.all([
  render(badge(), 192, 'icon-192.png'),
  render(badge(), 512, 'icon-512.png'),
  render(maskable(), 192, 'maskable-192.png'),
  render(maskable(), 512, 'maskable-512.png'),
  render(badge(BG_DEEP), 180, 'apple-touch-icon.png'),
  render(badge(), 32, 'favicon-32.png'),
])

console.log('Icons written to public/icons:')
for (const line of written) console.log('  ' + line)
