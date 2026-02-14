import React from 'react'

export function isInvalidGridEl(el: unknown) {
  // null 直接返回
  if (el === null) return true

  const isValidElement = React.isValidElement(el as React.ReactNode)

  // 无效元素直接返回
  if (!isValidElement) return true

  // 如果是一个元素，并且被配置为隐藏，则认为是一个无效的元素
  const element = el as React.ReactElement<{ 'data-grid-hidden'?: boolean }>
  const isHiddenEl = element?.props?.['data-grid-hidden']
  if (isHiddenEl) return true

  return false
}

export function getGridElSpan(el: unknown) {
  try {
    const props = (el as React.ReactElement)?.props
    const span = props?.span ?? props?.['data-span']
    if (typeof span === 'number' && !isNaN(span) && span >= 0) return span
    return null
  } catch {
    return null
  }
}
