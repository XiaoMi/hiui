import React, { useCallback, useState, useEffect, useReducer, useLayoutEffect } from 'react'
import { debounce } from './utils'

// 表示 tag 的 marginRight
const TAG_MARGIN_RIGHT = 4
// 留给显示剩余选项的宽度：suffix + paddingLeft + paddingRight + leftCountTag (16 + 10 + + 10 + 54)
const LEFT_SPACE_WIDTH = 100 + TAG_MARGIN_RIGHT

export const useTagInput = <T>(tags: T[], ref: React.MutableRefObject<HTMLDivElement | null>) => {
  const inputWidth = useResizeWidth(ref)
  const tagMaxWidth = inputWidth ? inputWidth - (LEFT_SPACE_WIDTH + 1) : undefined

  return [tagMaxWidth] as const
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
