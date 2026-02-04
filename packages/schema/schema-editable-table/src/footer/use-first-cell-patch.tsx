import { useEffect } from 'react'
import { useEditableSchemaTableCtx } from '../ctx'
import { cls } from '../utils'

// 简而言之，启用行选择时，把 footer 的第一个cell 的文字设置为 '合计'
// 首列固定展示 // TODO 待支持动态首列配置
export function useFirstCellPatch() {
  const { globalStaticRef, tableContainerRef } = useEditableSchemaTableCtx()
  const enableRowSelection = globalStaticRef.current.enableRowSelection

  useEffect(() => {
    if (enableRowSelection) {
      const container = tableContainerRef.current
      if (container) {
        const selector = `.${cls('footer-wrapper')} table[data-is-selection] .${cls('footer-cell')}`
        const firstCell = container.querySelector(selector)
        if (firstCell) {
          firstCell.innerHTML = '合计'
        }
      }
    }
  }, [enableRowSelection, tableContainerRef])
}
