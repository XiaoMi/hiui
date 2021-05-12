export { default as cx } from 'classnames'

export const getPrefixCls = (cls: string, componentPrefix = 'hi-v4') => `${componentPrefix}-${cls}`

export const addCls = (element: Element, className?: string) => {
  if (className) {
    element.classList.add(className)
  }
  return element
}
