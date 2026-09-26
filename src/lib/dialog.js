const FOCUSABLE =
  'button, [href], video[controls], mux-player, [tabindex]:not([tabindex="-1"])'

export function lockPageScroll(savedScrollY) {
  savedScrollY.current = window.scrollY
  document.documentElement.classList.add('is-dialog-open')
  document.body.style.top = `-${savedScrollY.current}px`
}

export function unlockPageScroll(savedScrollY) {
  document.documentElement.classList.remove('is-dialog-open')
  document.body.style.top = ''
  window.scrollTo({top: savedScrollY.current, left: 0, behavior: 'instant'})
}

export function getDialogFocusable(dialog) {
  return [...dialog.querySelectorAll(FOCUSABLE)].filter(
    (el) => !el.hasAttribute('disabled'),
  )
}

export function trapDialogTab(event, dialog) {
  if (event.key !== 'Tab') return

  const focusable = getDialogFocusable(dialog)
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

export function updateDescriptionOverflow(description, wrap, classNames) {
  if (!description || !wrap) return
  const {scrollTop, scrollHeight, clientHeight} = description
  const overflowing = scrollHeight > clientHeight + 1
  const atEnd = scrollTop + clientHeight >= scrollHeight - 1
  wrap.classList.toggle(classNames.overflowing, overflowing)
  wrap.classList.toggle(classNames.scrolledEnd, atEnd)
}

export function pauseDialogMedia(root) {
  root?.querySelector('video, mux-player')?.pause()
}
