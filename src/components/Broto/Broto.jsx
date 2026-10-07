import { useEffect, useState } from 'react'
import styles from './Broto.module.css'

const expressions = ['idle', 'looking', 'covered', 'peeking', 'confused', 'happy']

export default function Broto({ expression }) {
  const [warm, setWarm] = useState(false)
  const [loaded, setLoaded] = useState(() => new Set())
  useEffect(() => {
    let firstFrame
    let secondFrame
    const warmExpressions = () => {
      firstFrame = requestAnimationFrame(() => {
        secondFrame = requestAnimationFrame(() => setWarm(true))
      })
    }
    if (document.readyState === 'complete') warmExpressions()
    else window.addEventListener('load', warmExpressions, { once: true })
    return () => {
      window.removeEventListener('load', warmExpressions)
      cancelAnimationFrame(firstFrame)
      cancelAnimationFrame(secondFrame)
    }
  }, [])
  const active = loaded.has(expression) ? expression : 'idle'
  return (
    <div className={styles.stage} data-broto-state={active} aria-hidden="true">
      {expressions.filter((state) => warm || state === 'idle' || state === expression).map((state) => (
        <picture key={state}>
          <source media="(max-width: 800px)" srcSet={`/broto/${state === 'looking' ? 'looking-down' : state}-256.webp`} />
          <img src={`/broto/${state}.webp`} alt="" width="512" height="512"
            fetchPriority={state === 'idle' ? 'high' : 'low'}
            className={`${styles.face} ${active === state ? styles.active : ''}`}
            onLoad={() => setLoaded((current) => new Set([...current, state]))}
            decoding={state === 'idle' ? 'sync' : 'async'} draggable="false" />
        </picture>
      ))}
    </div>
  )
}
