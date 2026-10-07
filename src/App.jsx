import { useEffect, useRef } from 'react'
import { BrowserRouter, Link, Navigate, Route, Routes, useLocation } from 'react-router-dom'
import AuthLayout from './components/AuthLayout/AuthLayout'
import AuthForm from './components/AuthForm/AuthForm'
import styles from './App.module.css'

function RouteFocus() {
  const { pathname } = useLocation()
  const previousPath = useRef(pathname)

  useEffect(() => {
    const titles = { '/': 'Entrar', '/login': 'Entrar', '/cadastro': 'Criar conta' }
    document.title = `${titles[pathname] || 'Página não encontrada'} | Acesso — Felipe Jordão`
    if (previousPath.current !== pathname) {
      window.scrollTo({ top: 0, behavior: 'instant' })
      document.getElementById('page-title')?.focus()
      previousPath.current = pathname
    }
  }, [pathname])
  return null
}

export default function App() {
  return (
    <BrowserRouter>
      <RouteFocus />
      <Routes>
        <Route element={<AuthLayout />}>
          <Route index element={<Navigate to="/login" replace />} />
          <Route path="login" element={<AuthForm key="login" mode="login" />} />
          <Route path="cadastro" element={<AuthForm key="cadastro" mode="register" />} />
          <Route path="*" element={
            <section className={styles.notFound}>
              <p className={styles.eyebrow}>ERRO 404</p>
              <h1 id="page-title" tabIndex={-1}>Esse caminho ainda não existe.</h1>
              <p>Vamos voltar para um lugar conhecido?</p>
              <Link to="/login">Voltar para o login <span aria-hidden="true">→</span></Link>
            </section>
          } />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
