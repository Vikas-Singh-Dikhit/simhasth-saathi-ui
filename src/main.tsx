import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { ThemeProvider } from './components/providers/theme-provider'
import { Toaster } from './components/ui/toaster'

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      <App />
      <Toaster />
    </ThemeProvider>
  </React.StrictMode>
)
