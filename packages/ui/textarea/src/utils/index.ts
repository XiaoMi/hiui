import React from 'react'

let hiddenTextareaNode: HTMLTextAreaElement | undefined

const HIDDEN_TEXTAREA_STYLE = {
  'min-height': '0',
  'max-height': 'none',
  height: '0',
  visibility: 'hidden',
  position: 'absolute',
  'z-index': '-1000',
  top: '0',
  right: '0',
} as const

export const calcNodeAutoSizeStyles = (
  node: HTMLTextAreaElement,
  minRows: number | undefined,
  maxRows: number | undefined
) => {
  const { boxSizing, borderSize, paddingSize, sizingStyle } = getNodeComputedStyle(node)
  const value = node.value || node.placeholder || ''
  const wrap = node.getAttribute('wrap')

  if (!hiddenTextareaNode) {
    hiddenTextareaNode = document.createElement('textarea')
    hiddenTextareaNode.setAttribute('tab-index', '-1')
    hiddenTextareaNode.setAttribute('aria-hidden', 'true')
    document.body.appendChild(hiddenTextareaNode)
  }

  if (wrap !== null) {
    hiddenTextareaNode.setAttribute('wrap', wrap)
  }

  const mergedStyle = Object.assign({ overflow: 'hidden' }, HIDDEN_TEXTAREA_STYLE, sizingStyle)
  setImportantStyles(hiddenTextareaNode, mergedStyle)
  hiddenTextareaNode.value = value

  // 测量整行文本
  let height = hiddenTextareaNode.scrollHeight

  if (boxSizing === 'border-box') {
    // border-box:  content + padding + border
    height += borderSize
  } else {
    // content-box: content
    height -= paddingSize
  }

  let minHeight
  let maxHeight
  let overflowY: string | undefined = 'hidden'

  if (minRows !== undefined || maxRows !== undefined) {
    // 测量单行文本
    hiddenTextareaNode.value = 'x'
    // content
    const rowHeight = hiddenTextareaNode.scrollHeight - paddingSize

    if (typeof minRows === 'number' && minRows > 0) {
      minHeight = rowHeight * minRows
      if (boxSizing === 'border-box') {
        minHeight = minHeight + paddingSize + borderSize
      }

      if (height < minHeight) {
        height = minHeight
      }
    }

    if (typeof maxRows === 'number' && maxRows > 0) {
      maxHeight = rowHeight * maxRows
      if (boxSizing === 'border-box') {
        maxHeight = maxHeight + paddingSize + borderSize
      }

      if (height > maxHeight) {
        overflowY = undefined
        height = maxHeight
      }
    }
  }

  return {
    resize: 'none',
    height,
    minHeight,
    maxHeight,
    overflowY,
  } as React.CSSProperties
}

const SIZING_STYLE = [
  // box
  'box-sizing',
  'width',
  // padding
  'padding-left',
  'padding-right',
  'padding-bottom',
  'padding-top',
  'padding-inline-start',
  'padding-inline-end',
  // border
  'border-left-width',
  'border-right-width',
  'border-bottom-width',
  'border-top-width',
  // font
  'font-family',
  'font-weight',
  'font-size',
  'font-variant',
  'text-rendering',
  'text-transform',
  'text-indent',
  'word-break',
  'letter-spacing',
  'line-height',
]

const getNodeComputedStyle = (node: HTMLTextAreaElement) => {
  const computedStyle = window.getComputedStyle(node)

  const sizingStyle = SIZING_STYLE.reduce((acc, name) => {
    acc[name] = computedStyle.getPropertyValue(name)
    return acc
  }, {} as Record<string, any>)

  const paddingSize =
    parseFloat(sizingStyle['padding-bottom']) + parseFloat(sizingStyle['padding-top'])

  const borderSize =
    parseFloat(sizingStyle['border-bottom-width']) + parseFloat(sizingStyle['border-top-width'])

  return {
    boxSizing: sizingStyle['box-sizing'],
    borderSize,
    paddingSize,
    sizingStyle,
  }
}

const setImportantStyles = (node: HTMLElement, styleObject: object) => {
  node.setAttribute(
    'style',
    Object.keys(styleObject).reduce(
      (acc, key) => acc + key + ':' + styleObject[key as keyof typeof styleObject] + '!important;',
      ''
    )
  )
}
