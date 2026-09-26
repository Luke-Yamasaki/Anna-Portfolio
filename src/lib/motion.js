export function prefersReducedMotion() {
  if (typeof window === 'undefined') return false
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

export function easeOutCubic(t) {
  return 1 - (1 - t) ** 3
}
