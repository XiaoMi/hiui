import React from 'react'
import { get } from 'lodash-es'

export function isInvalidGridEl(el: unknown) {
  // null 直接返回
  if (el === null) return true

  const isValidElement = React.isValidElement(el)

  // 无效元素直接返回
  if (!isValidElement) return true

  // 如果是一个FormItemWrapper，并且被配置为隐藏，则认为是一个无效的元素
  const isInvalidFormItemWrapperEl = get(el, 'props.field.control.hidden')
  if (isInvalidFormItemWrapperEl) return true

  return false
}

export function getGridElSpan(el: unknown) {
  try {
    const span = get(el, 'props.span') || get(el, 'props.data-$span')
    if (typeof span === 'number' && !isNaN(span) && span >= 0) return span
    return null
  } catch (error) {
    console.log('getGridElSpan', error)
    return null
  }
}
