import React, { useState, useCallback } from 'react'

/**
 * usePatchElement
 * - 用于在保持 React 树的前提下动态添加/移除子元素
 * - 常用于 Modal/Drawer 等命令式 API，使弹层内容能够访问外层 Context
 *
 * @returns [elements, patchElement]
 * - elements: 当前挂载的元素列表
 * - patchElement: 添加元素，返回移除该元素的函数
 */
export function usePatchElement(): readonly [
  React.ReactElement[],
  (element: React.ReactElement) => () => void
] {
  const [elements, setElements] = useState<React.ReactElement[]>([])

  const patchElement = useCallback((element: React.ReactElement) => {
    setElements((prev) => [...prev, element])
    return () => {
      setElements((prev) => prev.filter((el) => el !== element))
    }
  }, [])

  return [elements, patchElement] as const
}

export type UsePatchElementReturn = ReturnType<typeof usePatchElement>
