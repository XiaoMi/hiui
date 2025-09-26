import * as React from 'react'
import { render, unmount } from './adapter'

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

let reactDomRender: RenderType = defaultReactRender

export function reactDomRenderBridge(render?: RenderType) {
  if (render) {
    reactDomRender = render
  }
  return reactDomRender
}
