import { useMemo, useRef } from 'react'

/**
 * TODO: What is useLazyRender
 */
export const useLazyRender = ({
  visible,
  preload = false,
  unmountOnExit = true,
}: UseLazyRenderProps) => {
  const hasOpenedRef = useRef(false)
  if (visible) {
    hasOpenedRef.current = true
  }

  const shouldRender = useMemo(() => {
    if (visible) return true

    // 初次未渲染，且开启预渲染时渲染 children
    if (!hasOpenedRef.current) return preload

    // 未开启关闭时销毁，保留渲染 children
    if (!unmountOnExit) return true

    return false
  }, [preload, unmountOnExit, visible])

  return shouldRender
}

export interface UseLazyRenderProps {
  /**
   * 开启渲染展示
   */
  visible: boolean
  /**
   * 开启预加载渲染，用于性能优化，优先级小于 `unmountOnExit`
   */
  preload?: boolean
  /**
   * 开启退出时销毁，用于性能优化，优先级大于 `preload`
   */
  unmountOnExit?: boolean
}
