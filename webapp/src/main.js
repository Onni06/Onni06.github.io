import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.js'

const rootElement = document.getElementById('root')

if (!rootElement) {
  console.error('Root element not found!')
} else {
  try {
    const root = createRoot(rootElement)
    root.render(
      <StrictMode>
        <App />
      </StrictMode>
    )
  } catch (error) {
    console.error('Error rendering app:', error)
    rootElement.innerHTML = `
      <div style="color: red; padding: 20px;">
        <h1>Error Loading App</h1>
        <p>${error.message}</p>
      </div>
    `
  }
}
