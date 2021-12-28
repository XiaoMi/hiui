import React from 'react'
import { FlattedTableColumnItemData, TableColumnItem } from '../types'
import { setAttrStatus } from '@hi-ui/dom-utils'

export const useColWidth = ({
  data,
  columns,
  resizable,
  dataSource,
  firstRowElementRef,
  isHoveredCol,
}: {
  resizable: boolean
  columns: TableColumnItem[]
  data: object[]
  dataSource?: any
  firstRowElementRef?: any
  isHoveredCol: (dataKey: string) => boolean
}) => {
  const [colWidths, setColWidths] = React.useState(() => {
    // css width default is 'auto'
    return columns.map((c) => c.width)
  })

  /**
   * 获取每列宽度，数组维护
   */
  React.useEffect(() => {
    // disabledDataRef.current = []
    // TODO: why don't dataSource
    if (!dataSource) {
      // 收集所有列宽，通过 table 的第一行
      if (firstRowElementRef.current) {
        console.log('firstRowElementRef.current', firstRowElementRef.current)

        const _realColumnsWidth = Array.from(firstRowElementRef.current.childNodes).map((node) => {
          return (node as HTMLElement).getBoundingClientRect().width || 0
        })

        setColWidths(_realColumnsWidth)
      }
    }
  }, [columns, dataSource, data, firstRowElementRef])

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
   * 列宽拖拽 resize
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
      const width = resizable ? colWidths[index] : column.width

      return {
        style: {
          // width: column.type === 'checkbox' ? checkboxColWidth : width,
          width: width,
          // TODO（疑惑）: minWidth 所要解决的问题
          minWidth: width,
        },
        // @ts-ignore
        'data-hover-highlight': setAttrStatus(isHoveredCol(column.dataKey)),
      }
    },
    [resizable, colWidths, isHoveredCol]
  )

  return {
    onColumnResizable,
    getColgroupProps,
    setHeaderTableElement,
    colWidths,
  }
}
