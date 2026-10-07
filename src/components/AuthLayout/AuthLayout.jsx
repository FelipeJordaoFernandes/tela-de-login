import { useCallback, useState } from 'react'
import { Leaf } from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'
import { MotionConfig } from 'motion/react'
import AnimatedCard from '../AnimatedCard/AnimatedCard'
import Broto from '../Broto/Broto'
import styles from './AuthLayout.module.css'

export default function AuthLayout() {
  const { pathname } = useLocation()
  const [reaction, setReaction] = useState({ pathname, expression: 'idle' })
  const onReaction = useCallback((expression) => setReaction({ pathname, expression }), [pathname])
  const expression = reaction.pathname === pathname ? reaction.expression : 'idle'

  return (
    <MotionConfig reducedMotion="user">
      <div className={styles.shell}>
        <a className={styles.skipLink} href="#conteudo">Pular para o conteúdo</a>
        <header className={styles.header}>
          <Link className={styles.brand} to="/login" aria-label="Acesso — início">
            <span className={styles.brandIcon}><Leaf size={20} strokeWidth={1.7} aria-hidden="true" /></span>
            acesso<span className={styles.brandDot}>.</span>
          </Link>
        </header>
        <main id="conteudo" className={styles.main} tabIndex={-1}>
          <div className={styles.mascotArea}><Broto expression={expression} /></div>
          <div className={styles.formArea}>
            <AnimatedCard outletContext={{ onReaction }} />
          </div>
        </main>
        <footer className={styles.footer}>
          <p>Design e código por <a href="https://felipe-jordao-portfolio.vercel.app/">Felipe Jordão Fernandes</a></p>
          <p className={styles.demoLabel}><span aria-hidden="true" /> Projeto de portfólio · Acesso local</p>
        </footer>
      </div>
    </MotionConfig>
  )
}
