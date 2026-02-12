import { useEffect, useRef } from 'react'

/**
 * useElHovering
 * @desc 鼠标 hover 时，给返回的 elRef 的元素上，增加 data-hovering 状态
 * @desc 如果传入 ref，则使用传入的 ref，否则使用内部的 ref
 * @returns
 */
export function useElHovering<T extends HTMLElement = HTMLElement>(ref?: React.RefObject<T>) {
  const elRef = useRef<T>(null)

  useEffect(() => {
    const elem = ref?.current || elRef.current
    if (!elem) return

    const handleMouseEnter = () => {
      elem.setAttribute('data-hovering', 'true')
    }

    const handleMouseLeave = () => {
      elem.removeAttribute('data-hovering')
    }

    elem.addEventListener('mouseenter', handleMouseEnter)
    elem.addEventListener('mouseleave', handleMouseLeave)

    return () => {
      elem.removeEventListener('mouseenter', handleMouseEnter)
      elem.removeEventListener('mouseleave', handleMouseLeave)
    }
  }, [ref])

  return { elRef }
}
