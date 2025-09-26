'use client'

import { createRoot } from 'react-dom/client'
import { unstableSetRender } from './context'

type RenderType = NonNullable<Parameters<typeof unstableSetRender>[0]>
type ContainerType = Parameters<RenderType>[1] & {
  _reactRoot?: ReturnType<typeof createRoot>
}

unstableSetRender((node, container: ContainerType) => {
  container._reactRoot ||= createRoot(container)
  const root: ReturnType<typeof createRoot> = container._reactRoot
  root.render(node)

  return () =>
    new Promise<void>((resolve) => {
      setTimeout(() => {
        root.unmount()
        resolve()
      }, 0)
    })
})
