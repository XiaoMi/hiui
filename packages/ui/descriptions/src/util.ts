import * as React from 'react'

type AnyObject = Record<any, any>

type RenderProps = undefined | AnyObject | ((originProps: AnyObject) => AnyObject | undefined)

export function cloneElement(element: React.ReactNode, props?: RenderProps): React.ReactNode {
  if (!React.isValidElement(element)) return element

  return React.cloneElement(element, props)
}

export function toArray(children: React.ReactNode) {
  const res: any = []
  React.Children.forEach(children, (c) => {
    res.push(c)
  })
  return res
}
