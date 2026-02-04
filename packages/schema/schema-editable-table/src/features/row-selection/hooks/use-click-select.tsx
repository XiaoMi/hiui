import { useEffect } from 'react'
import { useEditableSchemaTableCtx } from '../../../ctx'
import { cls } from '../../../utils'

export const useClickSelect = () => {
  const { tableContainerRef, propsRef, table } = useEditableSchemaTableCtx()

  useEffect(() => {
    // 只在开启点击行选择时启用
    if (!propsRef.current?.rowSelection?.enableClickSelect) return
    if (!tableContainerRef.current) return

    const container = tableContainerRef.current
    const selector = `.${cls('body-wrapper')} .${cls('main-content')}`
    const tableEl = container.querySelector<HTMLTableElement>(selector)
    if (!tableEl) return

    const handleClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement

      // TODO 此处还能还有其他的待排除元素，待识别后更新
      // 排除 input 元素的点击
      if (target.tagName?.toUpperCase() === 'INPUT') return
      // 排除 svg 元素的点击
      if (target.tagName?.toUpperCase() === 'SVG') return
      if (target.tagName?.toUpperCase() === 'PATH') return

      // 排除 HiUI 的表单项
      if (target.className.includes('hi')) {
        //  Select 等使用 MockInput 的组件
        if (target.className.includes('mock-input')) return
        // 日期选择器组件
        if (target.className.includes('date-picker')) return
        // 多选选择器组件
        if (target.className.includes('tag-input-mock')) return
      }

      // 查找当前点击的行元素
      const rowEl = target.closest('tr[data-id]')
      if (!rowEl) return

      const rowId = rowEl.getAttribute('data-id')
      if (!rowId) return

      // 获取行实例并触发选中
      const row = table.getRow(rowId)
      if (!row) return
      row.toggleSelected()
      row.$afterToggleSelected()
    }

    tableEl.addEventListener('click', handleClick)

    return () => {
      tableEl.removeEventListener('click', handleClick)
    }
  }, [tableContainerRef, propsRef, table])
}
