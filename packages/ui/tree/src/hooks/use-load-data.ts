// @ts-nocheck
import React, { useState, useRef, useCallback } from 'react'
import { FlattedTreeNodeData } from '../types'

export const useLoadData = (
  node: FlattedTreeNodeData,
  expanded: boolean,
  onExpand: any,
  onLoadChildren: any
) => {
  const [loading, setLoading] = useState(false)

  const onExpandRef = useRef(onExpand)
  React.useEffect(() => {
    onExpandRef.current = onExpand
  })
  // 处理 Switch 点击
  const handleSwitcherClick = useCallback(
    (evt: React.MouseEvent) => {
      evt.nativeEvent.stopPropagation()

      if (node.children) {
        onExpandRef.current?.(node, !expanded)
        return
      }

      if (onLoadChildren) {
        setLoading(true)

        // 如何设计请求数据，异步插入
        onLoadChildren(node)
          .then((res) => {
            setLoading(false)
            // 由于闭包，这里通过 setTimeout 拿取最新的 onExpand
            setTimeout(() => {
              onExpandRef.current?.(node, !expanded)
            })
          })
          .catch(() => {
            setLoading(false)
          })
      }
    },
    [node, expanded, onLoadChildren]
  )
}
