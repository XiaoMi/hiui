'use client'

import { createRoot } from 'react-dom/client'
import setReactDomRender from '@hi-ui/react-compat'

type RenderType = NonNullable<Parameters<typeof setReactDomRender>[0]>
type ContainerType = Parameters<RenderType>[1] & {
  _reactRoot?: ReturnType<typeof createRoot>
}

setReactDomRender((node: any, container: ContainerType) => {
  container._reactRoot ||= createRoot(container)
  const root: ReturnType<typeof createRoot> = container._reactRoot
  root.render(node)

  return () =>
    new Promise<void>((resolve) => {
      setTimeout(() => {
        root.unmount()
        // @ts-expect-error 移除 _reactRoot
        // 防止多次调用时在已卸载的 root 上执行 unmount 方法
        container._reactRoot = null
        resolve()
      }, 0)
    })
})
