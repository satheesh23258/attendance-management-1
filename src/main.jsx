import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import { AuthProvider } from './contexts/AuthContext'
import RoleThemeProvider from './contexts/ThemeContext'

// Only register service worker in production to avoid caching issues in dev
if (import.meta.env.PROD) {
  import('virtual:pwa-register').then(({ registerSW }) => {
    registerSW({ immediate: true })
  })
}

const root = document.getElementById('root')

if (!root) {
  console.error('Root element not found!')
} else {
  try {
    ReactDOM.createRoot(root).render(
      <React.StrictMode>
        <BrowserRouter>
          <RoleThemeProvider role="hybrid">
            <AuthProvider>
              <App />
            </AuthProvider>
          </RoleThemeProvider>
        </BrowserRouter>
      </React.StrictMode>,
    )
    console.log('React app rendered successfully')
  } catch (error) {
    console.error('Failed to render React app:', error)
    root.innerHTML = `<div style="padding:40px;font-family:monospace;color:red;">
      <h1>React Render Error</h1>
      <pre>${error?.stack || error?.message || String(error)}</pre>
    </div>`
  }
}
