'use client'

import {useCallback, useEffect, useMemo, useRef, useState} from 'react'
import {packWorksForMobile} from '@/lib/works'
import {WorkMedia} from './work-media'
import {WorkDialog} from './work-dialog'
import styles from './media-grid.module.css'
import dialogStyles from './work-dialog.module.css'

export function SelectedWork({works}) {
  const dialogRef = useRef(null)
  const descriptionRef = useRef(null)
  const descriptionWrapRef = useRef(null)
  const savedScrollY = useRef(0)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [open, setOpen] = useState(false)

  const mobileOrderByIndex = useMemo(
    () =>
      new Map(packWorksForMobile(works).map((work, order) => [work.index, order])),
    [works],
  )

  const updateDescriptionOverflow = useCallback(() => {
    const description = descriptionRef.current
    const wrap = descriptionWrapRef.current
    if (!description || !wrap) return
    const {scrollTop, scrollHeight, clientHeight} = description
    const overflowing = scrollHeight > clientHeight + 1
    const atEnd = scrollTop + clientHeight >= scrollHeight - 1
    wrap.classList.toggle(dialogStyles.isOverflowing, overflowing)
    wrap.classList.toggle(dialogStyles.isScrolledEnd, atEnd)
  }, [])

  const lockPage = useCallback(() => {
    savedScrollY.current = window.scrollY
    document.documentElement.classList.add('is-dialog-open')
    document.body.style.top = `-${savedScrollY.current}px`
  }, [])

  const unlockPage = useCallback(() => {
    document.documentElement.classList.remove('is-dialog-open')
    document.body.style.top = ''
    window.scrollTo({top: savedScrollY.current, left: 0, behavior: 'instant'})
  }, [])

  const openWork = useCallback(
    (index) => {
      setCurrentIndex(index)
      setOpen(true)
      lockPage()
      dialogRef.current?.showModal()
      requestAnimationFrame(updateDescriptionOverflow)
      dialogRef.current?.querySelector('button')?.focus({preventScroll: true})
    },
    [lockPage, updateDescriptionOverflow],
  )

  const closeWork = useCallback(() => {
    if (!dialogRef.current?.open) return
    dialogRef.current.close()
    setOpen(false)
    unlockPage()
  }, [unlockPage])

  const stepWork = useCallback(
    (direction) => {
      if (!works.length) return
      setCurrentIndex((index) => (index + direction + works.length) % works.length)
    },
    [works.length],
  )

  useEffect(() => {
    if (!open) return
    requestAnimationFrame(updateDescriptionOverflow)
  }, [currentIndex, open, updateDescriptionOverflow])

  useEffect(() => {
    const description = descriptionRef.current
    if (!description) return
    description.addEventListener('scroll', updateDescriptionOverflow, {passive: true})
    window.addEventListener('resize', updateDescriptionOverflow)
    return () => {
      description.removeEventListener('scroll', updateDescriptionOverflow)
      window.removeEventListener('resize', updateDescriptionOverflow)
    }
  }, [updateDescriptionOverflow])

  const prefersReducedMotion =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches

  if (!works?.length) return null

  let videoCount = 0

  return (
    <>
      <section className={styles.section} aria-label="Selected work">
        <div className={styles.grid}>
          {works.map((work) => {
            const itemClass = [styles.item]
            if (work.type === 'video') {
              const side = videoCount % 2 === 0 ? 'Left' : 'Right'
              itemClass.push(styles.itemVideo, styles[`itemVideo${side}`])
              videoCount += 1
            } else {
              itemClass.push(styles.itemImage)
            }

            return (
              <article
                key={work.id}
                className={itemClass.join(' ')}
                style={{'--mobile-order': String(mobileOrderByIndex.get(work.index))}}
                tabIndex={0}
                role="button"
                aria-label={`Open ${work.label}`}
                onClick={() => openWork(work.index)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault()
                    openWork(work.index)
                  }
                }}
              >
                <div className={styles.frame}>
                  <WorkMedia work={work} preview autoPlay={!prefersReducedMotion} />
                </div>
                <p className={styles.label}>{work.label}</p>
              </article>
            )
          })}
        </div>
      </section>
      <WorkDialog
        dialogRef={dialogRef}
        work={works[currentIndex]}
        onClose={closeWork}
        onStep={stepWork}
        descriptionRef={descriptionRef}
        descriptionWrapRef={descriptionWrapRef}
      />
    </>
  )
}
