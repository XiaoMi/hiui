import React, { useCallback } from 'react'
import { FlattedTableColumnItemData, TableColumnItem, TableRowRecord } from '../types'
import { getGroupItemWidth } from '../utils'
import { useUpdateEffect } from '@hi-ui/use-update-effect'

export const useColWidth = ({
  resizable,
  tableWidthAdjustOnResize,
  data,
  columns,
  virtual,
  scrollBodyElementRef,
}: {
  resizable: boolean
  tableWidthAdjustOnResize: boolean
  data: TableRowRecord[]
  columns: TableColumnItem[]
  virtual?: boolean
  scrollBodyElementRef: React.RefObject<HTMLTableElement>
}) => {
  const measureRowElementRef = React.useRef<HTMLTableRowElement | null>(null)
  // 是否重新设置过表格每列宽度
  const hasResetWidths = React.useRef<boolean>(false)
  const [colWidths, setColWidths] = React.useState(() => {
    return getGroupItemWidth(columns).colWidths
  })

  /**
   * 根据实际内容区（table 的第一行）渲染，再次精确收集并设置每列宽度
   * 如果实际总宽度大于设置的宽度，则将多余的宽度平分到没有设置 fixed 的列上
   */
  const getWidths = useCallback(
    (measureRowElement: HTMLTableRowElement | null) => {
      if (measureRowElement && measureRowElement.childNodes) {
        // 超出的宽度，即每列真实的宽度超出设置的宽度的总和
        let exceedWidth = 0
        const { flattedColumnsWithoutChildren, colWidths } = getGroupItemWidth(columns)

        let _realColumnsWidth = Array.from(measureRowElement.childNodes).map((node, index) => {
          const realWidth = (node as HTMLElement).offsetWidth || 60
          const { fixed } = flattedColumnsWithoutChildren[index] ?? {}
          const width = colWidths[index]

          // 如果该列设置了 fixed 并且真实宽度大于设置的 width 则设置为 width
          if (fixed && width && width < realWidth) {
            exceedWidth += realWidth - width
            return width
          }

          return realWidth
        })

        // 如果有多余的宽度，则将多余的宽度平分到没有设置 fixed 的列上
        if (exceedWidth > 0) {
          const noFixedColumns = flattedColumnsWithoutChildren.filter((item) => !item.fixed)

          _realColumnsWidth = _realColumnsWidth.map((item, index) => {
            if (!flattedColumnsWithoutChildren[index]?.fixed) {
              return item + Math.floor(exceedWidth / noFixedColumns.length)
            }
            return item
          })
        }

        if (_realColumnsWidth.some((width) => width && width > 0)) {
          return _realColumnsWidth
        }
      }

      return getGroupItemWidth(columns).colWidths
    },
    [columns]
  )

  const getVirtualWidths = useCallback(() => {
    const measureRowElement = measureRowElementRef.current
    if (!measureRowElement) {
      return getGroupItemWidth(columns).colWidths
    }

    /** 虚拟滚动时，内容宽度不能用以前table自动渲染的方式获取，需要手动计算 */
    const columnDefaultWidth = 200
    const containerWidth = measureRowElement.clientWidth
    let totalWidth: number = 0
    /** 虚拟滚动，需要根据collist的虚拟宽度来计算宽度 */
    columns.forEach((columnItem: TableColumnItem) => {
      totalWidth += columnItem.width || columnDefaultWidth
    })

    if (totalWidth < containerWidth) {
      // 容器宽度大于设置的宽度总和时，col宽度等比分分配占满容器。
      return columns.map((columnItem: TableColumnItem) => {
        return ((columnItem.width || columnDefaultWidth) * containerWidth) / totalWidth
      })
    } else {
      // 容器宽度小于设置的宽度总和时，col宽度等于设置/默认宽度。
      return columns.map((columnItem: TableColumnItem) => {
        return columnItem.width || columnDefaultWidth
      })
    }
  }, [columns])

  // 记录上一轮的列，用于判断列是否发生变化，只有发生变化时才重新计算列宽
  const prevColumnsRef = React.useRef<TableColumnItem[]>(columns)
  const hasColumnsChanged = React.useCallback(() => {
    const prevColumns = prevColumnsRef.current

    // 长度不同
    if (prevColumns.length !== columns.length) {
      return true
    }

    // 检查 dataKey、width 是否有变化
    for (let i = 0; i < columns.length; i++) {
      const prev = prevColumns[i]
      const curr = columns[i]

      if (prev.dataKey !== curr.dataKey || prev.width !== curr.width) {
        return true
      }
    }

    return false
  }, [columns])

  useUpdateEffect(() => {
    if (virtual && hasColumnsChanged()) {
      // 虚拟滚动的计算需要根据容器来做分配，不能使用没有width默认设置为0的方式来做表格平均分配
      setColWidths(getVirtualWidths())
    }
  }, [getVirtualWidths, virtual])

  useUpdateEffect(() => {
    if (!hasColumnsChanged()) {
      return
    }

    prevColumnsRef.current = columns

    // 当列变化时，重新设置列宽
    setColWidths(getGroupItemWidth(columns).colWidths)

    // 重新设置列宽后，真实的宽度会发生变化，基于真实的宽度再次重新计算出合适的列宽
    setTimeout(() => {
      const scrollBodyElementWidth = scrollBodyElementRef.current?.offsetWidth ?? 0
      const measureRowElementWidth = measureRowElementRef.current?.offsetWidth
      // 如果测量元素的宽度小于等于容器宽度，则重新设置列宽
      if (measureRowElementWidth && measureRowElementWidth <= scrollBodyElementWidth) {
        setColWidths(getWidths(measureRowElementRef.current))
      }
    }, 16)
  }, [columns])

  /**
   * 根据实际内容区（table 的第一行）渲染，再次精确收集并设置每列宽度
   */
  React.useEffect(() => {
    let resizeObserver: ResizeObserver

    const measureRowElement = measureRowElementRef.current

    if (measureRowElement) {
      resizeObserver = new ResizeObserver(() => {
        if (virtual) {
          setColWidths(getVirtualWidths())
        } else {
          // 当第一行有内容时并且没有重新设置列宽时，再去设置列宽
          // Warning hasResetWidths.current 作用是防止某些浏览器下，下面逻辑死循环
          if (measureRowElement?.childNodes && hasResetWidths.current === false) {
            hasResetWidths.current = true
            setColWidths(getWidths(measureRowElement))
          }
        }
      })

      resizeObserver.observe(measureRowElement)
    }

    return () => {
      resizeObserver?.disconnect()
    }
    // 测量元素在内容列为空时会是空，切换会使测量元素变化，导致后续的resize时间无法响应,此处测量元素变化时需要重新绑定
  }, [columns, getVirtualWidths, getWidths, virtual])

  const [headerTableElement, setHeaderTableElement] = React.useState<HTMLTableRowElement | null>(
    null
  )

  // 控制列最小可调整宽度，主要用于可拖拽调节列宽的场景，目前表头分组还不支持该功能
  const [minColWidths, setMinColWidths] = React.useState<number[]>(
    getGroupItemWidth(columns).minColWidths
  )

  // 当列变化时同步更新 minColWidths
  React.useEffect(() => {
    let resizeObserver: ResizeObserver

    if (headerTableElement) {
      resizeObserver = new ResizeObserver(() => {
        const calcMinColWidths = Array.from(headerTableElement.childNodes).map((th, index) => {
          const { colWidths, minColWidths } = getGroupItemWidth(columns)
          const colWidth = colWidths[index]
          const minColWidth = minColWidths[index]

          // 如果设置了最小宽度，则直接使用最小宽度
          if (minColWidth !== undefined && minColWidth !== 0) {
            return minColWidth
          }

          const thPaddingLeft = parseFloat(
            window.getComputedStyle(th as Element).getPropertyValue('padding-left')
          )
          const childNode = Array.from(th.childNodes)[0]
          // 计算真实标题内容宽度
          const childNodeWidth = (childNode as HTMLElement)?.offsetWidth + thPaddingLeft * 2

          // 如果设置的标题宽度小于真实内容宽度，则使用设置的宽度，否则使用真实内容宽度
          if (colWidth && colWidth < childNodeWidth) {
            return colWidth
          }

          return childNodeWidth || 40
        })

        setMinColWidths(calcMinColWidths)
      })
      resizeObserver.observe(headerTableElement!)
    } else {
      setMinColWidths(Array(columns.length).fill(0))
    }

    return () => {
      resizeObserver?.disconnect()
    }
  }, [columns, columns.length, headerTableElement, resizable])

  /**
   * 列宽拖拽 resize，只处理拖拽线两边的列宽度
   */
  const onColumnResizable = React.useCallback(
    (evt, { size }, index: number) => {
      const minWidth = minColWidths[index]
      const anotherMinWidth = minColWidths[index + 1]
      let nextWidth = size.width > minWidth ? size.width : minWidth

      setColWidths((prev) => {
        const nextColWidths = [...prev]

        if (tableWidthAdjustOnResize) {
          nextColWidths[index] = nextWidth
          return nextColWidths
        }

        let anotherWidth = nextColWidths[index + 1]! + nextColWidths[index]! - nextWidth

        if (anotherWidth <= anotherMinWidth) {
          anotherWidth = anotherMinWidth
          nextWidth = nextColWidths[index + 1]! - anotherMinWidth + nextColWidths[index]!
        }

        nextColWidths[index] = nextWidth
        nextColWidths[index + 1] = anotherWidth
        return nextColWidths
      })
    },
    [minColWidths, tableWidthAdjustOnResize]
  )

  const getColgroupProps = React.useCallback(
    (column: FlattedTableColumnItemData, index: number) => {
      const width = colWidths[index] || undefined
      // const minWidth = minColWidths[index] || undefined

      return {
        style: {
          width: width,
          // minWidth: minWidth || width,
        },
        // 'data-hover-highlight': setAttrStatus(isHoveredCol(column.dataKey)),
      }
    },
    [colWidths]
  )

  return {
    measureRowElementRef,
    onColumnResizable,
    getColgroupProps,
    setHeaderTableElement,
    colWidths,
  }
}
