import React, { useCallback, useRef, useState, useEffect, useReducer, useLayoutEffect } from 'react'
import { debounce } from '../utils'

// 表示 tag 的 marginRight
const TAG_MARGIN_RIGHT = 4
// 留给显示剩余选项的宽度：suffix + paddingLeft + paddingRight + leftCountTag (16 + 10 + + 10 + 54)
const LEFT_SPACE_WIDTH = 100 + TAG_MARGIN_RIGHT

export const useTagInput = <T>(
  wrap: boolean,
  selector: string,
  tags: T[],
  ref: React.MutableRefObject<HTMLDivElement | null>
) => {
  const shouldCalcTagCountRef = useRef(false)
  const [showCount, setShowCount] = useState(0)

  const [trigger, forceUpdate] = useReducer((v) => !v, false)
  const inputWidth = useResizeWidth(ref)

  useEffect(() => {
    forceUpdate()
  }, [inputWidth, tags])

  const calSowCount = useCallback(() => {
    if (shouldCalcTagCountRef.current && ref.current) {
      // tags 多个展示超过一行时，以数字显示
      const tagElements = ref.current.querySelectorAll(selector)
      const tagWrapperWidth = ref.current.getBoundingClientRect().width
      let width = 0

      for (let i = 0; i < tagElements.length; ++i) {
        const tag = tagElements[i]
        const tagRect = tag.getBoundingClientRect()
        width += tagRect.width + TAG_MARGIN_RIGHT

        if (shouldCalcTagCountRef.current && width + LEFT_SPACE_WIDTH > tagWrapperWidth) {
          shouldCalcTagCountRef.current = false
          // 开始显示折行的位置，如果为 0，则必展示一个
          const nextShowCount = i === 0 ? 1 : i
          setShowCount(nextShowCount)
          break
        }
      }
    }
  }, [ref, selector])

  const debouncedResizeRef = useRef<any>()
  useEffect(() => {
    debouncedResizeRef.current?.cancel()
    debouncedResizeRef.current = debounce(calSowCount, 60)
  }, [calSowCount])

  useEffect(() => {
    setShowCount(0)
    shouldCalcTagCountRef.current = true
    debouncedResizeRef.current?.()

    return () => {
      shouldCalcTagCountRef.current = false
      debouncedResizeRef.current?.cancel()
    }
  }, [trigger, ref])

  const showTagCount = showCount > 0 ? showCount : tags.length
  const leftTagCount = tags.length - showTagCount
  const tagMaxWidth = inputWidth ? inputWidth - (LEFT_SPACE_WIDTH + 1) : '100%'

  if (wrap) {
    return [tagMaxWidth, tags.length, 0] as const
  }

  return [tagMaxWidth, showTagCount, leftTagCount] as const
}

export const useResizeWidth = <T extends Element>(ref: React.MutableRefObject<T | null>) => {
  const [width, setWidth] = useState(0)

  const tryUpdateWidth = useCallback(() => {
    const nextWidth = ref.current?.getBoundingClientRect().width
    setWidth((prev) => nextWidth || prev || 0)
  }, [ref])

  useLayoutEffect(() => {
    // init with resize
    tryUpdateWidth()
    const debouncedResize = debounce(tryUpdateWidth, 60)
    window.addEventListener('resize', debouncedResize)
    return () => {
      window.removeEventListener('resize', debouncedResize)
      debouncedResize.cancel()
    }
  }, [tryUpdateWidth])

  return width
}
