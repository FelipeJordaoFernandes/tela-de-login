import { ArrowUpRight, Leaf, MoveRight } from 'lucide-react'
import { Link, Outlet } from 'react-router-dom'
import styles from './AuthLayout.module.css'

const portfolioUrl = 'https://felipe-jordao-portfolio.vercel.app/'

export default function AuthLayout() {
  return (
    <div className={styles.shell}>
      <a className={styles.skipLink} href="#conteudo">Pular para o conteúdo</a>
      <header className={styles.header}>
        <Link className={styles.brand} to="/login" aria-label="Acesso — início">
          <span className={styles.brandIcon}><Leaf size={20} strokeWidth={1.7} aria-hidden="true" /></span>
          acesso<span className={styles.brandDot}>.</span>
        </Link>
        <a className={styles.portfolioLink} href={portfolioUrl}>
          <span>Voltar ao portfólio</span><ArrowUpRight size={17} aria-hidden="true" />
        </a>
      </header>
      <main id="conteudo" className={styles.main} tabIndex={-1}>
        <section className={styles.intro} aria-labelledby="intro-title">
          <p className={styles.eyebrow}><span aria-hidden="true" /> SIMPLES DESDE O PRIMEIRO ACESSO</p>
          <h2 id="intro-title">Todo começo<br /> merece<br /> <span>boas-vindas.</span></h2>
          <p className={styles.description}>Um espaço para entrar, se conectar<br className={styles.desktopBreak} /> e dar o próximo passo. No seu ritmo.</p>
          <div className={styles.signature}>
            <span className={styles.signatureLine} aria-hidden="true" />
            <p>O essencial, bem cuidado.</p>
            <MoveRight size={19} strokeWidth={1.5} aria-hidden="true" />
          </div>
        </section>
        <div className={styles.formArea}><Outlet /></div>
      </main>
      <footer className={styles.footer}>
        <p>Design e código por <a href={portfolioUrl}>Felipe Jordão Fernandes</a></p>
        <p className={styles.demoLabel}><span aria-hidden="true" /> Projeto de portfólio · Interface demonstrativa</p>
      </footer>
    </div>
  )
}
