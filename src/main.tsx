import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { loadTheme } from './themeStorage'

document.documentElement.dataset.theme = loadTheme()

createRoot(document.getElementById('root')!).render(
  <App />,
)
