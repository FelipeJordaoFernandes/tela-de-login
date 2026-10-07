import { useEffect, useRef, useState } from 'react'
import { ArrowRight, CheckCircle2, Info, LogOut } from 'lucide-react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { Link, NavLink, useLocation, useNavigate, useOutletContext } from 'react-router-dom'
import FormField from '../FormField/FormField'
import { validateAuth } from '../../lib/validation'
import { LocalAuthError, loginLocalAccount, registerLocalAccount } from '../../lib/localAuth'
import styles from './AuthForm.module.css'

const emptyValues = { name: '', email: '', password: '', confirmPassword: '' }

export default function AuthForm({ mode }) {
  const isRegister = mode === 'register'
  const location = useLocation()
  const navigate = useNavigate()
  const { onReaction } = useOutletContext()
  const [values, setValues] = useState(() => ({ ...emptyValues, email: location.state?.registeredEmail || '' }))
  const [errors, setErrors] = useState({})
  const [submitted, setSubmitted] = useState(false)
  const [busy, setBusy] = useState(false)
  const [message, setMessage] = useState('')
  const [user, setUser] = useState(null)
  const formRef = useRef(null)
  const welcomeRef = useRef(null)
  const focusAfterLogout = useRef(false)
  const operation = useRef(0)
  const reduceMotion = useReducedMotion()
  const [registrationNotice, setRegistrationNotice] = useState(Boolean(location.state?.registeredEmail))

  useEffect(() => {
    return () => { operation.current += 1 }
  }, [])

  useEffect(() => {
    document.title = `${user ? 'Boas-vindas' : isRegister ? 'Criar conta' : 'Entrar'} | Acesso — Felipe Jordão`
  }, [user, isRegister])

  function handleChange(event) {
    const nextValues = { ...values, [event.target.name]: event.target.value }
    setValues(nextValues)
    setMessage('')
    setRegistrationNotice(false)
    if (submitted) setErrors(validateAuth(nextValues, isRegister))
    const passwordField = ['password', 'confirmPassword'].includes(event.target.name)
    onReaction(passwordField ? event.target.type === 'password' ? 'covered' : 'peeking' : event.target.name === 'email' ? 'looking' : 'idle')
  }

  async function handleSubmit(event) {
    event.preventDefault()
    if (busy) return
    const nextErrors = validateAuth(values, isRegister)
    setSubmitted(true)
    setErrors(nextErrors)
    setMessage('')
    const firstError = Object.keys(nextErrors)[0]
    if (firstError) {
      formRef.current.elements.namedItem(firstError)?.focus()
      onReaction(isRegister ? 'idle' : 'confused')
      return
    }
    setBusy(true)
    const currentOperation = ++operation.current
    try {
      const result = isRegister ? await registerLocalAccount(values) : await loginLocalAccount(values)
      if (currentOperation !== operation.current) return
      setValues(emptyValues)
      setSubmitted(false)
      if (isRegister) {
        onReaction('idle')
        navigate('/login', { replace: true, state: { registeredEmail: result.email } })
      } else {
        setUser(result)
        onReaction('happy')
      }
    } catch (error) {
      if (currentOperation !== operation.current) return
      const text = error instanceof LocalAuthError ? error.message : 'Não foi possível concluir. Tente novamente.'
      if (error instanceof LocalAuthError && error.field) {
        setErrors({ [error.field]: text })
        formRef.current?.elements.namedItem(error.field)?.focus()
      } else {
        setMessage(text)
      }
      onReaction(isRegister ? 'idle' : 'confused')
    } finally {
      if (currentOperation === operation.current) setBusy(false)
    }
  }

  function logout() {
    focusAfterLogout.current = true
    setUser(null)
    setValues(emptyValues)
    setErrors({})
    setMessage('')
    setRegistrationNotice(false)
    onReaction('idle')
  }

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.section key={user ? 'welcome' : 'form'} aria-labelledby="page-title"
        initial={{ opacity: 0, x: reduceMotion ? 0 : 35 }} animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: reduceMotion ? 0 : -35 }}
        transition={{ duration: reduceMotion ? 0 : .24, ease: [0.22, 1, 0.36, 1] }}
        onAnimationComplete={() => {
          if (user) welcomeRef.current?.focus()
          else if (focusAfterLogout.current) {
            formRef.current?.closest('section')?.querySelector('h1')?.focus()
            focusAfterLogout.current = false
          }
        }}>
        {user ? (
          <div className={styles.welcome}>
            <span className={styles.welcomeIcon}><CheckCircle2 size={28} aria-hidden="true" /></span>
            <h1 id="page-title" tabIndex={-1} ref={welcomeRef}>Boas-vindas, {user.name.split(/\s+/)[0]}!</h1>
            <p>Que bom ter você por aqui.<br />Seu acesso local foi confirmado.</p>
            <button type="button" className={styles.submit} onClick={logout}>Sair <LogOut size={17} aria-hidden="true" /></button>
          </div>
        ) : (
          <>
            <nav className={styles.navigation} aria-label="Acesso à conta">
              <NavLink to="/login" className={({ isActive }) => isActive ? styles.active : undefined}>Entrar</NavLink>
              <NavLink to="/cadastro" className={({ isActive }) => isActive ? styles.active : undefined}>Criar conta</NavLink>
            </nav>
            <div className={styles.heading}>
              <h1 id="page-title" tabIndex={-1}>{isRegister ? 'Seu primeiro passo.' : 'Que bom ter você aqui.'}</h1>
              <p>{isRegister ? 'Preencha seus dados para começar.' : 'Entre com seu e-mail e senha para continuar.'}</p>
            </div>
            {registrationNotice && <p className={styles.notice} role="status">Conta criada neste navegador. Agora é só entrar!</p>}
            <form ref={formRef} onSubmit={handleSubmit} noValidate className={styles.form} aria-busy={busy}>
              <fieldset className={styles.fields} disabled={busy}>
                {isRegister && <FormField id="name" label="Nome" placeholder="Seu nome"
                  autoComplete="name" maxLength={100} required value={values.name} onChange={handleChange} error={errors.name} onInteract={onReaction} />}
                <FormField id="email" label="E-mail" type="email" placeholder="voce@exemplo.com"
                  autoComplete="email" autoCapitalize="none" spellCheck={false} maxLength={254} required
                  value={values.email} onChange={handleChange} error={errors.email} onInteract={onReaction} />
                <FormField id="password" label="Senha" type="password" placeholder={isRegister ? 'Crie sua senha' : 'Digite sua senha'}
                  autoComplete={isRegister ? 'new-password' : 'current-password'} required maxLength={128}
                  hint={isRegister ? 'Use pelo menos 8 caracteres.' : undefined}
                  value={values.password} onChange={handleChange} error={errors.password} onInteract={onReaction} />
                {isRegister && <FormField id="confirmPassword" label="Confirmar senha" type="password" placeholder="Repita sua senha"
                  autoComplete="new-password" required maxLength={128} value={values.confirmPassword} onChange={handleChange}
                  error={errors.confirmPassword} onInteract={onReaction} />}
              </fieldset>
              <p className={styles.formError} role="alert">{message}</p>
              <button type="submit" disabled={busy} className={styles.submit}>
                {busy ? 'Só um instante…' : isRegister ? 'Criar minha conta' : 'Entrar'}
                {!busy && <ArrowRight size={17} aria-hidden="true" />}
              </button>
            </form>
            <p className={styles.switchPrompt}>
              {isRegister ? 'Já tem uma conta?' : 'Ainda não tem uma conta?'}{' '}
              <Link to={isRegister ? '/login' : '/cadastro'}>{isRegister ? 'Entrar' : 'Crie a sua'}</Link>
            </p>
            <div className={styles.demoNote}><Info size={15} aria-hidden="true" />
              <p>Cadastro salvo apenas neste navegador.<br />Use dados de teste nesta demonstração.</p>
            </div>
          </>
        )}
      </motion.section>
    </AnimatePresence>
  )
}
