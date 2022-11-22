import React, { useRef } from 'react'
import { FlattedTableColumnItemData, TableColumnItem, TableRowRecord } from '../types'
import { getGroupItemWidth } from '../utils'
import { useUpdateEffect } from '@hi-ui/use-update-effect'

export const useColWidth = ({
  resizable,
  data,
  columns,
  virtual,
}: {
  resizable: boolean
  data: TableRowRecord[]
  columns: TableColumnItem[]
  virtual: boolean
}) => {
  const measureRowElementRef = useRef<HTMLTableRowElement>(null)

  const [colWidths, setColWidths] = React.useState(() => {
    return getGroupItemWidth(columns)
  })

  console.error({ useColWidth: 1, colWidths })

  useUpdateEffect(() => {
    setColWidths(getGroupItemWidth(columns))
  }, [columns])

  /**
   * 根据实际内容区（table 的第一行）渲染，再次精确收集并设置每列宽度
   */
  React.useEffect(() => {
    let resizeObserver: ResizeObserver
    const measureRowElement = measureRowElementRef.current

    if (measureRowElement) {
      const resizeObserver = new ResizeObserver(() => {
        if (virtual) {
          /** 虚拟滚动时，内容宽度不能用以前table自动渲染的方式获取，需要手动计算 */
          const columnDefaultWidth = 200
          const containerWidth = measureRowElement.clientWidth
          let totalWidth: number = 0
          /** 虚拟滚动，需要根据collist的虚拟宽度来计算宽度 */
          columns.forEach((columnItem: TableColumnItem) => {
            totalWidth += columnItem.width || columnDefaultWidth
          })
          if (totalWidth < containerWidth) {
            setColWidths(
              columns.map((columnItem: TableColumnItem) => {
                return ((columnItem.width || columnDefaultWidth) * containerWidth) / totalWidth
              })
            )
          } else {
            setColWidths(
              columns.map((columnItem: TableColumnItem) => {
                return columnItem.width || columnDefaultWidth
              })
            )
          }
        } else {
          if (measureRowElement.childNodes) {
            const _realColumnsWidth = Array.from(measureRowElement.childNodes).map((node) => {
              return (node as HTMLElement).getBoundingClientRect().width || 0
            })

            if (_realColumnsWidth.some((width) => width && width > 0)) {
              setColWidths(_realColumnsWidth)
            }
          }
        }
      })

      resizeObserver.observe(measureRowElement)
    }

    return () => {
      if (resizeObserver) {
        resizeObserver.disconnect()
      }
    }
  }, [])

  const [headerTableElement, setHeaderTableElement] = React.useState<HTMLTableElement | null>(null)

  /**
   *  控制列最小可调整宽度
   */
  const minColWidth = React.useMemo(() => {
    if (
      headerTableElement &&
      headerTableElement.childNodes &&
      headerTableElement.childNodes[1].childNodes[0]
    ) {
      const _minColWidth = Array.from(
        headerTableElement.childNodes[1].childNodes[0].childNodes
      ).map((th) => {
        // @ts-ignore
        return th.childNodes[0].className === 'hi-table__header__title'
          ? // @ts-ignore
            th.childNodes[0].offsetWidth
          : 0
      })

      return _minColWidth
    }
    return Array(columns.length).fill(0)
  }, [columns, headerTableElement])

  /**
   * 列宽拖拽 resize，只处理拖拽线两边的列宽度
   */
  const onColumnResizable = React.useCallback(
    (_, { size }, index: number) => {
      const minWidth = minColWidth[index] + 31
      const anotherMinWidth = minColWidth[index + 1] + 31
      let nextWidth = size.width > minWidth ? size.width : minWidth

      setColWidths((prev) => {
        const nextColWidths = [...prev]
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
    [minColWidth]
  )

  const getColgroupProps = React.useCallback(
    (column: FlattedTableColumnItemData, index: number) => {
      const width = colWidths[index] || undefined

      return {
        style: {
          width: width,
          // TODO（疑惑）: minWidth 所要解决的问题
          minWidth: width,
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
