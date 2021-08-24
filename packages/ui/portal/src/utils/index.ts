export const addDOMClass = (el: Element, className?: string) => {
  if (!className) return
  const classes = className.trim().split(' ')

  classes.forEach((cls) => {
    if (!el.classList.contains(cls)) {
      el.classList.add(className)
    }
  })
}

export const resolveContainer = (container?: (() => HTMLElement | null) | HTMLElement | null) => {
  if (!container) return null
  if (typeof container === 'function') container = container()
  return container
}
