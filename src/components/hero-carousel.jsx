'use client'

import {useEffect, useRef} from 'react'
import {handleHorizontalArrows} from '@/lib/keyboard'
import {easeOutCubic, prefersReducedMotion} from '@/lib/motion'
import styles from './styles/hero-carousel.module.css'

export function HeroCarousel({slides}) {
  const trackRef = useRef(null)
  const stepRef = useRef(() => {})

  useEffect(() => {
    const track = trackRef.current
    if (!track || slides.length === 0) return

    const reduceMotion = prefersReducedMotion()

    const state = {
      offset: 0,
      paused: reduceMotion,
      animating: false,
      animStartOffset: 0,
      targetOffset: 0,
      animStartTime: 0,
    }

    const speed = 0.45
    const animDuration = 560
    const loopWidth = () => track.scrollWidth / 2

    const applyTransform = () => {
      track.style.transform = `translateX(${-state.offset}px)`
    }

    const stride = () => {
      const slide = track.querySelector(`.${styles.slide}`)
      if (!slide) return 0
      const gap = parseFloat(getComputedStyle(track).gap) || 0
      return slide.getBoundingClientRect().width + gap
    }

    const wrapOffset = () => {
      const width = loopWidth()
      if (width <= 0) return
      if (state.offset >= width) state.offset -= width
      if (state.offset < 0) state.offset += width
    }

    const step = (direction) => {
      state.paused = true
      const delta = direction * stride()
      if (!delta) return

      if (reduceMotion) {
        state.offset += delta
        wrapOffset()
        applyTransform()
        return
      }

      const width = loopWidth()
      if (direction < 0 && state.offset < 1) {
        state.offset += width
      } else if (direction > 0 && state.offset >= width - 1) {
        state.offset -= width
      }

      state.animStartOffset = state.offset
      state.targetOffset = (state.animating ? state.targetOffset : state.offset) + delta
      state.animStartTime = performance.now()
      state.animating = true
    }

    stepRef.current = step

    let raf = requestAnimationFrame(function tick(now) {
      if (state.animating) {
        const t = Math.min(1, (now - state.animStartTime) / animDuration)
        state.offset =
          state.animStartOffset +
          (state.targetOffset - state.animStartOffset) * easeOutCubic(t)
        applyTransform()
        if (t >= 1) {
          state.offset = state.targetOffset
          wrapOffset()
          applyTransform()
          state.animating = false
        }
      } else if (!state.paused) {
        state.offset += speed
        wrapOffset()
        applyTransform()
      }
      raf = requestAnimationFrame(tick)
    })

    return () => {
      cancelAnimationFrame(raf)
    }
  }, [slides])

  const stepPrevious = () => {
    stepRef.current(-1)
  }

  const stepNext = () => {
    stepRef.current(1)
  }

  const onHeroKeyDown = (event) => {
    handleHorizontalArrows(event, (direction) => {
      stepRef.current(direction)
    })
  }

  const renderSlide = (slide, index, {hidden = false} = {}) => (
    <li
      key={`${slide.key}-${hidden ? 'clone' : 'slide'}-${index}`}
      className={styles.slide}
      aria-hidden={hidden || undefined}
    >
      <img src={slide.src} alt={hidden ? '' : slide.alt} />
    </li>
  )

  if (!slides?.length) return null

  const slideItems = [
    ...slides.map((slide, index) => renderSlide(slide, index)),
    ...slides.map((slide, index) => renderSlide(slide, index, {hidden: true})),
  ]

  return (
    <section className={styles.hero} onKeyDown={onHeroKeyDown}>
      <div className={styles.carousel}>
        <div className={styles.viewport}>
          <ul ref={trackRef} className={styles.track}>
            {slideItems}
          </ul>
        </div>
      </div>
      <div className={styles.controls}>
        <button type="button" className={styles.button} onClick={stepPrevious}>
          <span className="visuallyHidden">Previous</span>
          <span aria-hidden="true">←</span>
        </button>
        <button type="button" className={styles.button} onClick={stepNext}>
          <span className="visuallyHidden">Next</span>
          <span aria-hidden="true">→</span>
        </button>
      </div>
    </section>
  )
}
