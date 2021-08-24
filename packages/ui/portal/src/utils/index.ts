export const addDOMClass = (el?: Element | null, className?: string) => {
  if (!el || !className) return

  className.split(' ').forEach((cls) => {
    el.classList.add(cls)
  })
}

export const removeDOMClass = (el?: Element | null, className?: string) => {
  if (!el || !className) return

  className.split(' ').forEach((cls) => {
    el.classList.remove(cls)
  })
}

export const resolveContainer = (container?: (() => HTMLElement | null) | HTMLElement | null) => {
  if (!container) return null
  if (typeof container === 'function') container = container()
  return container
}
