import { useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'
import styles from './FormField.module.css'

export default function FormField({ id, label, error, hint, type = 'text', ...inputProps }) {
  const [visible, setVisible] = useState(false)
  const isPassword = type === 'password'
  const description = [hint && `${id}-hint`, error && `${id}-error`].filter(Boolean).join(' ')
  return (
    <div className={styles.field}>
      <label htmlFor={id}>{label}</label>
      <div className={styles.inputWrapper}>
        <input {...inputProps} id={id} name={id} type={isPassword && visible ? 'text' : type}
          className={`${styles.input} ${isPassword ? styles.password : ''}`}
          aria-invalid={Boolean(error)} aria-describedby={description || undefined} />
        {isPassword && (
          <button className={styles.toggle} type="button" onClick={() => setVisible(!visible)}
            aria-label={`${visible ? 'Ocultar' : 'Mostrar'} ${label.toLowerCase()}`} aria-controls={id} aria-pressed={visible}>
            {visible ? <EyeOff size={18} aria-hidden="true" /> : <Eye size={18} aria-hidden="true" />}
          </button>
        )}
      </div>
      {hint && <p id={`${id}-hint`} className={styles.hint}>{hint}</p>}
      {error && <p id={`${id}-error`} className={styles.error}>{error}</p>}
    </div>
  )
}
