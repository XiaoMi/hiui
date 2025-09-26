import type * as React from 'react'
import { createRoot } from 'react-dom/client'
import type { Root } from 'react-dom/client'

const MARK = '__rc_react_root__'

// ========================== Render ==========================
type ContainerType = (Element | DocumentFragment) & {
  [MARK]?: Root
}

export function render(node: React.ReactElement, container: ContainerType) {
  const root = container[MARK] || createRoot(container)

  root.render(node)

  container[MARK] = root
}

// ========================= Unmount ==========================
export async function unmount(container: ContainerType) {
  // Delay to unmount to avoid React 18 sync warning
  return Promise.resolve().then(() => {
    container[MARK]?.unmount()

    delete container[MARK]
  })
}
