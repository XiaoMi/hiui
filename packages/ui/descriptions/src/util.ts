import * as React from 'react'

type AnyObject = Record<any, any>

type RenderProps = undefined | AnyObject | ((originProps: AnyObject) => AnyObject | undefined)

export function replaceElement(
  element: React.ReactNode,
  replacement: React.ReactNode,
  props: RenderProps
): React.ReactNode {
  if (!React.isValidElement(element)) return replacement

  return React.cloneElement(
    element,
    typeof props === 'function' ? props(element.props || {}) : props
  )
}

export function cloneElement(element: React.ReactNode, props?: RenderProps): React.ReactElement {
  return replaceElement(element, element, props) as React.ReactElement
}

export function toArray(children: React.ReactNode) {
  const res: any = []
  React.Children.forEach(children, (c) => {
    res.push(c)
  })
  return res
}
