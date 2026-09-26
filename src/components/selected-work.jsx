'use client'

import {useMemo, useRef, useState} from 'react'
import {lockPageScroll, unlockPageScroll} from '@/lib/dialog'
import {prefersReducedMotion} from '@/lib/motion'
import {decorateWorksForGrid, stepIndex, workItemClassName} from '@/lib/works'
import {WorkDialog} from './work-dialog'
import {WorkMedia} from './work-media'
import styles from './media-grid.module.css'

export function SelectedWork({works}) {
  const dialogRef = useRef(null)
  const savedScrollY = useRef(0)
  const [currentIndex, setCurrentIndex] = useState(0)
  const items = useMemo(() => decorateWorksForGrid(works), [works])
  const reduceMotion = prefersReducedMotion()

  const openWork = (index) => {
    setCurrentIndex(index)
    lockPageScroll(savedScrollY)
    dialogRef.current?.showModal()
    dialogRef.current?.querySelector('button')?.focus({preventScroll: true})
  }

  const closeWork = () => {
    if (!dialogRef.current?.open) return
    dialogRef.current.close()
    unlockPageScroll(savedScrollY)
  }

  const stepWork = (direction) => {
    setCurrentIndex((index) => stepIndex(index, direction, works.length))
  }

  const onGridClick = (event) => {
    const item = event.target.closest('[data-work-index]')
    if (!item) return
    openWork(Number(item.dataset.workIndex))
  }

  const onGridKeyDown = (event) => {
    if (event.key !== 'Enter' && event.key !== ' ') return
    const item = event.target.closest('[data-work-index]')
    if (!item || event.target !== item) return
    event.preventDefault()
    openWork(Number(item.dataset.workIndex))
  }

  const renderWorkItem = (work) => (
    <article
      key={work.id}
      className={workItemClassName(work, styles)}
      style={{'--mobile-order': String(work.mobileOrder)}}
      tabIndex={0}
      role="button"
      aria-label={`Open ${work.label}`}
      data-work-index={work.index}
    >
      <div className={styles.frame}>
        <WorkMedia work={work} preview autoPlay={!reduceMotion} />
      </div>
      <p className={styles.label}>{work.label}</p>
    </article>
  )

  if (!works?.length) return null

  const workItems = items.map(renderWorkItem)

  return (
    <>
      <section className={styles.section} aria-label="Selected work">
        <div
          className={styles.grid}
          onClick={onGridClick}
          onKeyDown={onGridKeyDown}
        >
          {workItems}
        </div>
      </section>
      <WorkDialog
        dialogRef={dialogRef}
        work={works[currentIndex]}
        onClose={closeWork}
        onStep={stepWork}
      />
    </>
  )
}
