import React from 'react'

/** 返回当前组件的渲染次数 */
export function useRenderCount() {
  const renderCount = React.useRef(0)
  renderCount.current += 1
  return renderCount.current
}
