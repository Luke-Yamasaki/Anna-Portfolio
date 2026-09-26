'use client'

import {useEffect, useState} from 'react'
import styles from './styles/disable-draft-mode.module.css'

export function DisableDraftMode() {
  const [show, setShow] = useState(false)

  useEffect(() => {
    setShow(window.self === window.top)
  }, [])

  if (!show) return null

  return (
    <a className={styles.exit} href="/api/draft-mode/disable">
      Disable draft mode
    </a>
  )
}
