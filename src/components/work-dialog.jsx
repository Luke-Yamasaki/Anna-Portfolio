'use client'

import {useEffect, useRef} from 'react'
import {PortableText} from 'next-sanity'
import {WorkMedia} from './work-media'
import styles from './work-dialog.module.css'

export function WorkDialog({
  dialogRef,
  work,
  onClose,
  onStep,
  descriptionRef,
  descriptionWrapRef,
}) {
  const mediaRef = useRef(null)

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return

    const onKeyDown = (event) => {
      if (!dialog.open) return

      if (event.key === 'Tab') {
        const focusable = [
          ...dialog.querySelectorAll(
            'button, [href], video[controls], [tabindex]:not([tabindex="-1"])',
          ),
        ].filter((el) => !el.hasAttribute('disabled'))

        if (focusable.length === 0) {
          event.preventDefault()
          return
        }

        const first = focusable[0]
        const last = focusable[focusable.length - 1]
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault()
          last.focus({preventScroll: true})
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault()
          first.focus({preventScroll: true})
        }
      }

      if (event.key === 'ArrowLeft') {
        event.preventDefault()
        onStep(-1)
      }
      if (event.key === 'ArrowRight') {
        event.preventDefault()
        onStep(1)
      }
    }

    const onClick = (event) => {
      if (event.target === dialog) onClose()
    }

    const onDialogClose = () => {
      mediaRef.current?.querySelector('video, mux-player')?.pause()
    }

    dialog.addEventListener('keydown', onKeyDown)
    dialog.addEventListener('click', onClick)
    dialog.addEventListener('close', onDialogClose)

    return () => {
      dialog.removeEventListener('keydown', onKeyDown)
      dialog.removeEventListener('click', onClick)
      dialog.removeEventListener('close', onDialogClose)
    }
  }, [dialogRef, onClose, onStep])

  return (
    <dialog
      ref={dialogRef}
      className={styles.dialog}
      aria-modal="true"
      aria-labelledby="work-dialog-label"
    >
      <button
        type="button"
        className={styles.close}
        aria-label="Close"
        onClick={onClose}
      >
        <span aria-hidden="true">X</span>
      </button>
      <div className={styles.body}>
        <div className={styles.navContainer}>
          <button
            type="button"
            className={styles.nav}
            aria-label="Previous work"
            onClick={() => onStep(-1)}
          >
            <span aria-hidden="true">←</span>
          </button>
        </div>
        <div className={styles.center}>
          <div ref={mediaRef} className={styles.media}>
            {work ? <WorkMedia work={work} /> : null}
          </div>
          <div className={styles.copy}>
            <p id="work-dialog-label" className={styles.label}>
              {work?.label}
            </p>
            <div ref={descriptionWrapRef} className={styles.descriptionWrap}>
              <div ref={descriptionRef} className={styles.description}>
                {work?.description ? <PortableText value={work.description} /> : null}
              </div>
            </div>
          </div>
        </div>
        <div className={styles.navContainer}>
          <button
            type="button"
            className={styles.nav}
            aria-label="Next work"
            onClick={() => onStep(1)}
          >
            <span aria-hidden="true">→</span>
          </button>
        </div>
      </div>
    </dialog>
  )
}
