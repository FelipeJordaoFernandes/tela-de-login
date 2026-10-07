import { renderToString } from 'react-dom/server'
import { StaticRouter } from 'react-router-dom'
import { AppRoutes } from './App'

// Apenas as telas públicas são geradas, sem cadastros ou estado de usuário.
export function render(pathname) {
  return renderToString(<StaticRouter location={pathname}><AppRoutes /></StaticRouter>)
}
