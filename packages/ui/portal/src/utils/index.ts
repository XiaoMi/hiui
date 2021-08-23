export const addDOMClass = (el: Element, className?: string) => {
  if (!className) return
  const classes = className.trim().split(' ')

  classes.forEach((cls) => {
    if (!el.classList.contains(cls)) {
      el.classList.add(className)
    }
  })
}
