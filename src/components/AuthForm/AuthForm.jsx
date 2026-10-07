import { useRef, useState } from 'react'
import { ArrowRight, CheckCircle2, Info } from 'lucide-react'
import { Link, NavLink } from 'react-router-dom'
import FormField from '../FormField/FormField'
import { validateAuth } from '../../lib/validation'
import styles from './AuthForm.module.css'

const emptyValues = { name: '', email: '', password: '', confirmPassword: '' }

export default function AuthForm({ mode }) {
  const isRegister = mode === 'register'
  const [values, setValues] = useState(emptyValues)
  const [errors, setErrors] = useState({})
  const [submitted, setSubmitted] = useState(false)
  const [success, setSuccess] = useState(false)
  const formRef = useRef(null)
  const statusRef = useRef(null)

  function handleChange(event) {
    const nextValues = { ...values, [event.target.name]: event.target.value }
    setValues(nextValues)
    setSuccess(false)
    if (submitted) setErrors(validateAuth(nextValues, isRegister))
  }
  function handleSubmit(event) {
    event.preventDefault()
    const nextErrors = validateAuth(values, isRegister)
    setSubmitted(true)
    setErrors(nextErrors)
    setSuccess(false)
    const firstError = Object.keys(nextErrors)[0]
    if (firstError) {
      formRef.current.elements.namedItem(firstError)?.focus()
      return
    }
    // Demonstração visual: não envia, autentica ou persiste credenciais.
    setValues(emptyValues)
    setSubmitted(false)
    setSuccess(true)
    requestAnimationFrame(() => statusRef.current?.focus())
  }
  return (
    <section className={styles.card} aria-labelledby="page-title">
      <nav className={styles.navigation} aria-label="Acesso à conta">
        <NavLink to="/login" className={({ isActive }) => isActive ? styles.active : undefined}>Entrar</NavLink>
        <NavLink to="/cadastro" className={({ isActive }) => isActive ? styles.active : undefined}>Criar conta</NavLink>
      </nav>
      <div className={styles.heading}>
        <h1 id="page-title" tabIndex={-1}>{isRegister ? 'Seu primeiro passo.' : 'Que bom ter você aqui.'}</h1>
        <p>{isRegister ? 'Preencha seus dados para começar.' : 'Entre com seu e-mail e senha para continuar.'}</p>
      </div>
      <form ref={formRef} onSubmit={handleSubmit} noValidate className={styles.form}>
        {isRegister && <FormField id="name" label="Nome" placeholder="Seu nome"
          autoComplete="name" maxLength={100} required value={values.name} onChange={handleChange} error={errors.name} />}
        <FormField id="email" label="E-mail" type="email" placeholder="voce@exemplo.com"
          autoComplete="email" autoCapitalize="none" spellCheck={false} maxLength={254} required
          value={values.email} onChange={handleChange} error={errors.email} />
        <FormField id="password" label="Senha" type="password" placeholder={isRegister ? 'Crie sua senha' : 'Digite sua senha'}
          autoComplete={isRegister ? 'new-password' : 'current-password'} required
          hint={isRegister ? 'Use pelo menos 8 caracteres.' : undefined}
          value={values.password} onChange={handleChange} error={errors.password} />
        {isRegister && <FormField id="confirmPassword" label="Confirmar senha" type="password" placeholder="Repita sua senha"
          autoComplete="new-password" required value={values.confirmPassword} onChange={handleChange} error={errors.confirmPassword} />}
        <button type="submit" className={styles.submit}>
          {isRegister ? 'Criar minha conta' : 'Entrar'}<ArrowRight size={17} aria-hidden="true" />
        </button>
      </form>
      <div role="status" aria-live="polite" aria-atomic="true">
        {success && <div className={styles.success} ref={statusRef} tabIndex={-1}>
          <CheckCircle2 size={19} aria-hidden="true" />
          <p>Pronto! A demonstração foi concluída. {isRegister ? 'Nenhuma conta foi criada.' : 'Nenhum acesso real foi realizado.'}</p>
        </div>}
      </div>
      <p className={styles.switchPrompt}>
        {isRegister ? 'Já tem uma conta?' : 'Ainda não tem uma conta?'}{' '}
        <Link to={isRegister ? '/login' : '/cadastro'}>{isRegister ? 'Entrar' : 'Crie a sua'}</Link>
      </p>
      <div className={styles.demoNote}><Info size={15} aria-hidden="true" />
        <p>Uma experiência de demonstração.<br />Seus dados não são enviados nem salvos.</p>
      </div>
    </section>
  )
}
