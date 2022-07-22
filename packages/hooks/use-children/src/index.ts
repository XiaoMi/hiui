import React, { Children } from 'react'
import { isFragment } from 'react-is'

export const useChildren = (children: React.ReactNode) => {}

export const toArray = (children: React.ReactNode): React.ReactElement[] => {
  let childrenList: React.ReactElement[] = []

  Children.forEach(children, (child: any) => {
    if (child === undefined || child === null || typeof child === 'boolean') return

    if (Array.isArray(child)) {
      childrenList = childrenList.concat(toArray(child))
    } else if (isFragment(child) && child.props && child.props.children) {
      childrenList = childrenList.concat(toArray(child.props.children))
    } else {
      childrenList.push(child)
    }
  })

  return childrenList
}
