import { createRoot } from 'react-dom/client'
import '@fontsource-variable/inter/index.css'
import '@fontsource-variable/inter/wght-italic.css'
import '@fontsource-variable/jetbrains-mono/index.css'
import './styles.css'
import './warm.css'
import App from './App'

if ('scrollRestoration' in history) {
  history.scrollRestoration = 'manual'
}
window.scrollTo(0, 0)

const root = document.getElementById('root')
if (!root) throw new Error('Root element not found')

createRoot(root).render(<App />)
