import React, { useEffect, useMemo, useRef } from 'react'
import { isBrowser } from '@hi-ui/env'
import { isElement } from '@hi-ui/type-assertion'

/**
 * A hook using for locking the page scroll
 */
export const useScrollLock = (ref: React.RefObject<Element>, options: UseScrollLockOptions) => {
  const { enabled = true, target } = options || {}

  const prevRef = useRef<Element | null>(null)
  const prevBodyOverflowRef = useRef<string | undefined>(undefined)

  const targetMemo = useMemo(() => {
    if (isElement(target) && 'style' in target) return target

    if (isBrowser) return document.body

    return { style: {} } as HTMLElement
  }, [target])

  useEffect(() => {
    if (enabled && ref && ref.current) {
      prevRef.current = ref.current

      // 初始时保存 overflow 设置的样式
      if (prevBodyOverflowRef.current === undefined) {
        prevBodyOverflowRef.current = targetMemo.style.overflow
        targetMemo.style.overflow = 'hidden'
      }
    }

    return () => {
      if (prevRef.current) {
        if (prevBodyOverflowRef.current !== undefined) {
          targetMemo.style.overflow = prevBodyOverflowRef.current
          prevBodyOverflowRef.current = undefined
        }
      }
    }
  }, [enabled, ref, targetMemo])
}

export interface UseScrollLockOptions {
  /**
   * 是否开启滚动锁
   */
  enabled?: boolean
  /**
   * 指定锁目标
   */
  target?: Element
}
