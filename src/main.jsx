import { StrictMode } from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// O aviso/e-mail de cadastro é transitório; reload inicia o HTML público vazio.
const historyState = window.history.state
if (historyState?.usr?.registeredEmail) {
  const state = { ...historyState.usr }
  delete state.registeredEmail
  window.history.replaceState({ ...historyState, usr: state }, '')
}

const app = (
  <StrictMode>
    <App />
  </StrictMode>
)
const root = document.getElementById('root')
const route = window.location.pathname.replace(/\/+$/, '')
if (root.hasChildNodes() && ['/login', '/cadastro'].includes(route)) hydrateRoot(root, app)
else createRoot(root).render(app)
