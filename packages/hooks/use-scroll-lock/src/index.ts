import React, { useEffect, useMemo, useRef } from 'react'
import { isBrowser } from '@hi-ui/env'
import { isElement } from '@hi-ui/type-assertion'

const containerMap = new Map<any, [number, string]>()
const mockTarget = { style: {} } as HTMLElement

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

    return mockTarget
  }, [target])

  useEffect(() => {
    if (enabled && ref && ref.current) {
      prevRef.current = ref.current

      const top = containerMap.get(targetMemo)
      // 如果有 container，则计数设置恢复态
      if (top) {
        prevBodyOverflowRef.current = top[1]
        top[0]++
      } else {
        // 初始时保存 overflow 设置的样式
        prevBodyOverflowRef.current = (targetMemo as HTMLElement).style.overflow
        containerMap.set(targetMemo, [1, prevBodyOverflowRef.current])
      }

      ;(targetMemo as HTMLElement).style.overflow = 'hidden'
    }

    // 如果还有modal则不设置恢复，持续锁滚
    // 如果是最后一个则恢复
    return () => {
      if (prevRef.current) {
        if (prevBodyOverflowRef.current !== undefined) {
          const top = containerMap.get(targetMemo)
          if (top) {
            top[0]--

            // 如果是最后一个才恢复其值
            if (top[0] < 1) {
              containerMap.delete(targetMemo)
              ;(targetMemo as HTMLElement).style.overflow = prevBodyOverflowRef.current
            }
          } else {
            ;(targetMemo as HTMLElement).style.overflow = prevBodyOverflowRef.current
          }

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
