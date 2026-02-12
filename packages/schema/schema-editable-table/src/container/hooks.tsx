import { useEffect } from 'react'
import { useVirtualizer, type VirtualItem } from '@tanstack/react-virtual'

import { useEditableSchemaTableCtx } from '../ctx'
import { ROW_HEIGHT } from '../const'

import type { VirtualizerOptions } from './type'

type VirtualizerResult = {
  virtualItems: VirtualItem[]
  padding: {
    start: number
    end: number
  }
}

export function useRowVirtualizer(options?: VirtualizerOptions): VirtualizerResult {
  const { table, tableContainerRef } = useEditableSchemaTableCtx()

  const virtualizer = useVirtualizer({
    count: table.getRowModel().rows.length,
    getScrollElement: () => tableContainerRef.current,
    estimateSize: () => ROW_HEIGHT,
    overscan: 5,
    ...options,
  })

  const virtualItems = virtualizer.getVirtualItems()

  const padding = !virtualItems.length
    ? { start: 0, end: 0 }
    : {
        start: virtualItems[0].start,
        end: virtualizer.getTotalSize() - virtualItems[virtualItems.length - 1].end,
      }

  return {
    virtualItems,
    padding,
  }
}

export function useColumnVirtualizer(options?: VirtualizerOptions): VirtualizerResult {
  const { table, tableContainerRef } = useEditableSchemaTableCtx()

  const virtualizer = useVirtualizer({
    count: table.getVisibleLeafColumns().length,
    getScrollElement: () => tableContainerRef.current,
    estimateSize: (index) => table.getVisibleLeafColumns()[index].getSize(),
    horizontal: true,
    overscan: 3,
    ...options,
  })

  const virtualItems = virtualizer.getVirtualItems()

  const padding = !virtualItems.length
    ? { start: 0, end: 0 }
    : {
        start: virtualItems[0].start,
        end: virtualizer.getTotalSize() - virtualItems[virtualItems.length - 1].end,
      }

  return {
    virtualItems,
    padding,
  }
}

export function useTableScroll() {
  const { tableContainerRef } = useEditableSchemaTableCtx()

  useEffect(() => {
    const container = tableContainerRef.current
    if (!container) return

    const handleScroll = () => {
      const { scrollLeft, scrollWidth, clientWidth } = container

      // 左侧是否有可滚动空间
      const hasLeftSpace = scrollLeft > 0
      // 右侧是否有可滚动空间
      const hasRightSpace = Math.abs(scrollWidth - clientWidth - scrollLeft) > 1

      // 根据两侧是否有可滚动空间来切换对应的类名
      container.classList.toggle('editable-schema-table--scrolling-right', hasLeftSpace)
      container.classList.toggle('editable-schema-table--scrolling-left', hasRightSpace)
    }

    container.addEventListener('scroll', handleScroll)
    // 初始化时触发一次
    handleScroll()

    return () => {
      container.removeEventListener('scroll', handleScroll)
    }
  }, [tableContainerRef])
}
