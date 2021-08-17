import React, { useCallback, useRef, useState, useEffect, useReducer } from 'react'
import { debounce } from '../utils'

// 表示 tag 的 marginRight
const TAG_MARGIN_RIGHT = 4
// 留给显示剩余选项的宽度：suffix + paddingLeft + paddingRight + leftCountTag (16 + 10 + + 10 + 54)
const LEFT_SPACE_WIDTH = 100 + TAG_MARGIN_RIGHT

export const useTagInput = <T>(
  selector: string,
  tags: T[],
  ref: React.MutableRefObject<HTMLDivElement | null>
) => {
  const shouldCalcTagCountRef = useRef(false)
  const [showCount, setShowCount] = useState(0)

  const [inputWidth, setInputWidth] = useState(0)

  const tryUpdateInputWidth = useCallback(() => {
    const nextInputWidth = ref.current?.getBoundingClientRect().width || 0
    if (inputWidth !== nextInputWidth) {
      setShowCount(0)
      setInputWidth(nextInputWidth)
    }
  }, [ref, inputWidth])

  useEffect(() => {
    const resize = () => {
      shouldCalcTagCountRef.current = true

      tryUpdateInputWidth()
    }

    // init
    resize()

    // resize
    const debouncedResize = debounce(resize, 60)
    window.addEventListener('resize', debouncedResize)
    return () => {
      window.removeEventListener('resize', debouncedResize)
      debouncedResize.cancel()
    }
  }, [tryUpdateInputWidth])

  const [trigger, forceUpdate] = useReducer((v) => !v, false)

  useEffect(() => {
    console.log(inputWidth)
    forceUpdate()
  }, [inputWidth])

  const calSowCount = useCallback(() => {
    if (shouldCalcTagCountRef.current && ref.current) {
      // tags 多个展示超过一行时，以数字显示
      const tagWrapperRect = ref.current.getBoundingClientRect()
      const tagElements = ref.current.querySelectorAll(selector)

      let width = 0
      console.log(tagElements)

      for (let i = 0; i < tagElements.length; ++i) {
        const tag = tagElements[i]
        const tagRect = tag.getBoundingClientRect()
        width += tagRect.width + TAG_MARGIN_RIGHT
        console.log(width)

        if (shouldCalcTagCountRef.current && width + LEFT_SPACE_WIDTH - tagWrapperRect.width > 0) {
          shouldCalcTagCountRef.current = false
          // 开始显示折行的位置，如果为 0，则必展示一个
          const nextShowCount = i === 0 ? 1 : i
          setShowCount(nextShowCount)
          break
        }
      }
    } else {
      shouldCalcTagCountRef.current = true
    }
  }, [selector, ref, trigger])

  useEffect(() => {
    shouldCalcTagCountRef.current = true
    setShowCount(0)
    calSowCount()
  }, [calSowCount, tags])

  const showTagCount = showCount > 0 ? showCount : tags.length
  const leftTagCount = tags.length - showTagCount
  const tagMaxWidth = inputWidth ? inputWidth - (LEFT_SPACE_WIDTH + 1) : '100%'

  return [tagMaxWidth, showTagCount, leftTagCount] as const
}
