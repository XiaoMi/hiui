import { useEffect, useRef } from 'react'
import { useEditableSchemaTableCtx } from '../../../ctx'
import { cls } from '../../../utils'

/**
 * 同步表格行的 hover 状态
 * @desc 当表格分为选择列和主内容两部分时，确保 hover 效果能同步显示在两边
 */
export function useSyncHoverStyle() {
  const { tableContainerRef, propsRef } = useEditableSchemaTableCtx()

  const findClassName = `.${cls('body-row')}`
  // 用ref存储上一次 hover 的行元素，避免不必要的DOM查询
  const lastHoveredRowsRef = useRef<HTMLElement[] | null>(null)

  useEffect(() => {
    if (!tableContainerRef.current) return
    // 只在开启行选择时启用 hover 同步
    if (!propsRef.current?.rowSelection) return
    // // 如果开启了列分组，则不启用 hover 同步
    // TODO 此处需进一步细化处理场景
    // if (propsRef.current.grouping) return

    const container = tableContainerRef.current
    const clearHover = () => {
      if (lastHoveredRowsRef.current) {
        lastHoveredRowsRef.current.forEach((el) => el.removeAttribute('data-hovering'))
        lastHoveredRowsRef.current = null
      }
    }

    const handleMouseMove = (e: MouseEvent) => {
      // 查找当前 hover 的行元素
      const row = (e.target as HTMLElement).closest(findClassName)
      // 如果没有找到行元素，清除上一次的 hover 状态
      if (!row) return clearHover()

      const rowId = row.getAttribute('data-id')
      if (!rowId) return

      // 如果 hover 的是同一行，不做任何操作
      if (lastHoveredRowsRef.current?.[0]?.getAttribute('data-id') === rowId) {
        return
      }

      // 清除上一次 hover 的行
      clearHover()

      // 找到所有相同 id 的行并添加 hover 状态
      const currentRows = Array.from(
        container.querySelectorAll(`tr[data-id="${rowId}"]`)
      ) as HTMLElement[]
      currentRows.forEach((el) => el.setAttribute('data-hovering', ''))
      lastHoveredRowsRef.current = currentRows
    }

    // 鼠标离开表格时清除所有 hover 状态
    const handleMouseLeave = () => clearHover()

    container.addEventListener('mousemove', handleMouseMove)
    container.addEventListener('mouseleave', handleMouseLeave)

    return () => {
      // 清理事件监听
      container.removeEventListener('mousemove', handleMouseMove)
      container.removeEventListener('mouseleave', handleMouseLeave)
      // 组件卸载时清除所有hover状态
      clearHover()
    }
  }, [tableContainerRef, propsRef, findClassName])
}
