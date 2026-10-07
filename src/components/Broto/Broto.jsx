import styles from './Broto.module.css'

const expressions = ['idle', 'looking', 'covered', 'peeking', 'confused', 'happy']

export default function Broto({ expression }) {
  return (
    <div className={styles.stage} data-broto-state={expression} aria-hidden="true">
      {expressions.map((state) => (
        <picture key={state}>
          {state === 'looking' && <source media="(max-width: 800px)" srcSet="/broto/looking-down.webp" />}
          <img src={`/broto/${state}.webp`} alt="" width="512" height="512"
          className={`${styles.face} ${expression === state ? styles.active : ''}`}
            decoding="async" draggable="false" />
        </picture>
      ))}
    </div>
  )
}
