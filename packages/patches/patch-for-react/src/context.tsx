import * as React from 'react'
import { render, unmount } from './render'

export type UnmountType = () => Promise<void>
export type RenderType = (
  node: React.ReactElement,
  container: Element | DocumentFragment
) => UnmountType

const defaultReactRender: RenderType = (node, container) => {
  render(node, container)
  return () => {
    return unmount(container)
  }
}

let unstableRender: RenderType = defaultReactRender

// Set React render function for compatible usage.
// This is internal usage only compatible with React 19.
// And will be removed in next major version.
export function unstableSetRender(render?: RenderType) {
  if (render) {
    unstableRender = render
  }
  return unstableRender
}
