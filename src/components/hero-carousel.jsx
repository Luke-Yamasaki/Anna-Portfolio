'use client'

import {useEffect, useRef} from 'react'
import styles from './hero-carousel.module.css'

export function HeroCarousel({slides}) {
  const carouselRef = useRef(null)
  const trackRef = useRef(null)
  const stepRef = useRef(() => {})

  useEffect(() => {
    const carousel = carouselRef.current
    const track = trackRef.current
    if (!carousel || !track || slides.length === 0) return

    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches

    const state = {
      offset: 0,
      paused: prefersReducedMotion,
      animating: false,
      animStartOffset: 0,
      targetOffset: 0,
      animStartTime: 0,
    }

    const speed = 0.45
    const animDuration = 560
    const easeOutCubic = (t) => 1 - (1 - t) ** 3

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

      if (prefersReducedMotion) {
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

    const onKeyDown = (event) => {
      if (event.key === 'ArrowLeft') {
        event.preventDefault()
        step(-1)
      }
      if (event.key === 'ArrowRight') {
        event.preventDefault()
        step(1)
      }
    }

    carousel.addEventListener('keydown', onKeyDown)

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
      carousel.removeEventListener('keydown', onKeyDown)
    }
  }, [slides])

  if (!slides?.length) return null

  const looped = [...slides, ...slides]

  return (
    <section className={styles.hero} aria-label="Featured work">
      <div
        ref={carouselRef}
        className={styles.carousel}
        tabIndex={0}
        aria-roledescription="carousel"
        aria-label="Featured stills"
      >
        <div className={styles.viewport}>
          <ul ref={trackRef} className={styles.track}>
            {looped.map((slide, index) => (
              <li key={`${slide.key}-${index}`} className={styles.slide}>
                <img src={slide.src} alt={slide.alt} />
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className={styles.controls}>
        <button
          type="button"
          className={styles.button}
          aria-label="Previous featured still"
          onClick={() => stepRef.current(-1)}
        >
          <span aria-hidden="true">←</span>
        </button>
        <button
          type="button"
          className={styles.button}
          aria-label="Next featured still"
          onClick={() => stepRef.current(1)}
        >
          <span aria-hidden="true">→</span>
        </button>
      </div>
    </section>
  )
}
