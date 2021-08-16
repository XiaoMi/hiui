import { useCallback, useRef, useState, useEffect } from 'react'
import { debounce } from '../utils'

export const useTagInput = <T>(selector: string, tags: T[]) => {
  const tagInputRef = useRef<HTMLElement>()
  const shouldCalcTagCountRef = useRef(false)
  const [showCount, setShowCount] = useState(0)

  const calSowCount = useCallback(() => {
    if (shouldCalcTagCountRef.current && tagInputRef.current) {
      // tags 多个展示超过一行时，以数字显示
      const tagWrapperRect = tagInputRef.current.getBoundingClientRect()

      let width = 0
      let showCountIndex = 0 // 在第几个开始显示折行
      const tags = tagInputRef.current.querySelectorAll(selector)

      tags.forEach((tag, index) => {
        const tagRect = tag.getBoundingClientRect()

        width += tagRect.width

        // 110 是留给显示剩余选项的宽度
        if (shouldCalcTagCountRef.current && width + 110 > tagWrapperRect.width) {
          shouldCalcTagCountRef.current = false
          showCountIndex = index
        }
      })

      if (!shouldCalcTagCountRef.current) {
        setShowCount(showCountIndex)
      }
    } else {
      shouldCalcTagCountRef.current = true
    }
  }, [selector])

  useEffect(() => {
    const resize = debounce(() => {
      shouldCalcTagCountRef.current = true
      setShowCount(0)
      calSowCount()
    }, 60)

    window.addEventListener('resize', resize)
    return () => {
      window.removeEventListener('resize', resize)
      resize.cancel()
    }
  }, [calSowCount])

  useEffect(() => {
    shouldCalcTagCountRef.current = true
    calSowCount()
  }, [calSowCount, tags])

  // const currentCount = showCount === 0 ? tags.length : showCount
  return [showCount, calSowCount] as const
}
