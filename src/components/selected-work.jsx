'use client'

import {useMemo, useRef, useState} from 'react'
import {lockPageScroll, unlockPageScroll} from '@/lib/dialog'
import {prefersReducedMotion} from '@/lib/motion'
import {decorateWorksForGrid, stepIndex, workItemClassName} from '@/lib/works'
import {WorkDialog} from './work-dialog'
import {WorkMedia} from './work-media'
import styles from './styles/media-grid.module.css'

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

  const renderWorkItem = (work) => (
    <div
      key={work.id}
      className={workItemClassName(work, styles)}
      style={{'--mobile-order': String(work.mobileOrder)}}
    >
      <div className={styles.frame}>
        <WorkMedia work={work} preview autoPlay={!reduceMotion} />
      </div>
      <button type="button" className={styles.label} data-work-index={work.index}>
        {work.label}
      </button>
    </div>
  )

  if (!works?.length) return null

  const workItems = items.map(renderWorkItem)

  return (
    <>
      <section className={styles.section}>
        <h2 className="visuallyHidden">Selected work</h2>
        <div className={styles.grid} onClick={onGridClick}>
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
