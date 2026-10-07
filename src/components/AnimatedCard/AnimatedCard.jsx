import { useCallback, useRef, useState } from 'react'
import { AnimatePresence, useReducedMotion } from 'motion/react'
import * as m from 'motion/react-m'
import { useLocation, useOutlet } from 'react-router-dom'
import styles from './AnimatedCard.module.css'

export default function AnimatedCard({ outletContext }) {
  const { pathname } = useLocation()
  const outlet = useOutlet(outletContext)
  const contentRef = useRef(null)
  const previousPath = useRef(pathname)
  const [height, setHeight] = useState(null)
  const reduceMotion = useReducedMotion()
  const direction = pathname === '/cadastro' ? 1 : -1

  const observeContent = useCallback((element) => {
    if (!element) return
    contentRef.current = element
    const observer = new ResizeObserver(() => {
      const cardStyle = getComputedStyle(element.parentElement)
      setHeight(element.getBoundingClientRect().height + parseFloat(cardStyle.borderTopWidth) + parseFloat(cardStyle.borderBottomWidth))
    })
    observer.observe(element)
    return () => { observer.disconnect(); contentRef.current = null }
  }, [])

  return (
    <m.div id="auth-card" className={styles.card} initial={false}
      animate={{ height: height ?? 'auto' }}
      transition={{ duration: reduceMotion ? 0 : 0.42, ease: [0.22, 1, 0.36, 1] }}>
      <AnimatePresence initial={false} mode="wait" custom={direction}>
        <m.div key={pathname} custom={direction} ref={observeContent}
          className={styles.content}
          variants={{ enter: (side) => ({ opacity: 0, x: reduceMotion ? 0 : side * 45 }),
            center: { opacity: 1, x: 0 },
            exit: (side) => ({ opacity: 0, x: reduceMotion ? 0 : -side * 45 }) }}
          initial="enter" animate="center" exit="exit"
          transition={{ duration: reduceMotion ? 0 : 0.24, ease: [0.22, 1, 0.36, 1] }}
          onAnimationComplete={() => {
            if (previousPath.current !== pathname) {
              contentRef.current?.querySelector('h1')?.focus()
              previousPath.current = pathname
            }
          }}>
          {outlet}
        </m.div>
      </AnimatePresence>
    </m.div>
  )
}
