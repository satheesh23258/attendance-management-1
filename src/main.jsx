import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import { AuthProvider } from './contexts/AuthContext'
import RoleThemeProvider from './contexts/ThemeContext'

ReactDOM.createRoot(document.getElementById('root')).render(
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
