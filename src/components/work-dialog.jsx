'use client'

import {useEffect, useRef} from 'react'
import {PortableText} from 'next-sanity'
import {
  pauseDialogMedia,
  trapDialogTab,
  updateDescriptionOverflow,
} from '@/lib/dialog'
import {handleHorizontalArrows} from '@/lib/keyboard'
import {WorkMedia} from './work-media'
import styles from './styles/work-dialog.module.css'

export function WorkDialog({dialogRef, work, onClose, onStep}) {
  const mediaRef = useRef(null)
  const descriptionRef = useRef(null)
  const descriptionWrapRef = useRef(null)

  const syncOverflow = () => {
    updateDescriptionOverflow(descriptionRef.current, descriptionWrapRef.current, {
      overflowing: styles.isOverflowing,
      scrolledEnd: styles.isScrolledEnd,
    })
  }

  useEffect(() => {
    requestAnimationFrame(syncOverflow)
  }, [work])

  useEffect(() => {
    const dialog = dialogRef.current
    const description = descriptionRef.current
    if (!dialog) return

    const onKeyDown = (event) => {
      if (!dialog.open) return
      trapDialogTab(event, dialog)
      handleHorizontalArrows(event, onStep)
    }

    const onClick = (event) => {
      if (event.target === dialog) onClose()
    }

    const onDialogClose = () => {
      pauseDialogMedia(mediaRef.current)
    }

    dialog.addEventListener('keydown', onKeyDown)
    dialog.addEventListener('click', onClick)
    dialog.addEventListener('close', onDialogClose)
    description?.addEventListener('scroll', syncOverflow, {passive: true})
    window.addEventListener('resize', syncOverflow)

    return () => {
      dialog.removeEventListener('keydown', onKeyDown)
      dialog.removeEventListener('click', onClick)
      dialog.removeEventListener('close', onDialogClose)
      description?.removeEventListener('scroll', syncOverflow)
      window.removeEventListener('resize', syncOverflow)
    }
  }, [dialogRef, onClose, onStep])

  const stepPrevious = () => {
    onStep(-1)
  }

  const stepNext = () => {
    onStep(1)
  }

  return (
    <dialog ref={dialogRef} className={styles.dialog} aria-labelledby="work-dialog-label">
      <button type="button" className={styles.close} onClick={onClose}>
        <span className="visuallyHidden">Close</span>
        <span aria-hidden="true">X</span>
      </button>
      <div className={styles.body}>
        <div className={styles.navContainer}>
          <button type="button" className={styles.nav} onClick={stepPrevious}>
            <span className="visuallyHidden">Previous work</span>
            <span aria-hidden="true">←</span>
          </button>
        </div>
        <div className={styles.center}>
          <div ref={mediaRef} className={styles.media}>
            {work ? <WorkMedia work={work} /> : null}
          </div>
          <div className={styles.copy}>
            <h2 id="work-dialog-label" className={styles.label}>
              {work?.label}
            </h2>
            <div ref={descriptionWrapRef} className={styles.descriptionWrap}>
              <div ref={descriptionRef} className={styles.description}>
                {work?.description ? <PortableText value={work.description} /> : null}
              </div>
            </div>
          </div>
        </div>
        <div className={styles.navContainer}>
          <button type="button" className={styles.nav} onClick={stepNext}>
            <span className="visuallyHidden">Next work</span>
            <span aria-hidden="true">→</span>
          </button>
        </div>
      </div>
    </dialog>
  )
}
