import { TableColumnItem } from './../types'
import { isNumeric } from '@hi-ui/type-assertion'

export const deleteRowByKey = (data: object[], dragInfo: any) => {
  const { dragKey } = dragInfo
  data.some((item: any, index) => {
    const { key, children } = item

    if (dragKey === key) {
      data.splice(index, 1)
      return true
    }

    if (children) {
      deleteRowByKey(children, dragInfo)
    }

    return false
  })

  return data
}

export const setRowByKey = (data: object[], dragInfo: any, inSameLevel = true) => {
  const { dropKey, dropClientY, startClientY, rowData } = dragInfo
  data.some((item: any, index) => {
    const { key, children } = item
    if (dropKey === key) {
      const direction = startClientY > dropClientY ? 0 : 1
      data.splice(index + direction, 0, rowData)
      return true
    }

    if (children) {
      inSameLevel = false
      setRowByKey(children, dragInfo, inSameLevel)
    }
    return false
  })
  return data
}

export const setColumnsDefaultWidth = (columns: any, defaultWidth: any) => {
  const _columns: any = columns.concat()

  const setWidth = (_columns: any) => {
    _columns.forEach((item: any) => {
      const { children } = item
      if (children) {
        setWidth(children)
      } else if (item.dataKey) {
        item.width = item.width || defaultWidth
      }
    })
  }

  setWidth(_columns)
  return _columns
}

/**
 * 获取每个 Column 的真实列宽度（排除合并列头）
 * 如果是多级表头，将会递归 children 得到叶子结点层每项的宽度
 */
export const getGroupItemWidth = (
  columns: TableColumnItem[]
): { colWidths: number[]; minColWidths: number[] } => {
  const colWidths: number[] = []
  const minColWidths: number[] = []

  const dig = (column: TableColumnItem[]) => {
    column.forEach(({ children, width, minWidth }) => {
      if (Array.isArray(children)) {
        dig(children)
        return
      }

      // 如果没有设置列宽度，css 宽度默认是 `auto`，这里对于非数字 width 均设置为 0
      const colWidth = isNumeric(width) ? Number(width) : 0
      const minColWidth = isNumeric(minWidth) ? Number(minWidth) : 0

      colWidths.push(colWidth)
      minColWidths.push(minColWidth)
    })
  }

  dig(columns)

  return {
    colWidths,
    minColWidths,
  }
}

export const getMaskItemsWIdth = (columns: TableColumnItem[]) => {
  let num = 0

  const getAllItemWidth = (column: TableColumnItem[]) => {
    column.forEach(({ children, width }) => {
      if (children) {
        getAllItemWidth(children)
        return
      }

      if (isNumeric(width)) {
        num += Number(width)
      }
    })
  }

  getAllItemWidth(columns)
  return num
}

export const parseFixedColumns = (
  item: any,
  index: number,
  columns: any[],
  arr: any[],
  key: string,
  parentStickyWidth = 0
) => {
  const width = (arr[index - 1] || { width: 0 }).width || 0
  const stickyWidth = (arr[index - 1] || { width: 0 })[key] || 0
  item = { ...item }
  item[key] = width + stickyWidth + parentStickyWidth

  if (item.children) {
    const _parentStickyWidth = item[key]
    const { children } = item
    item.children = []

    children.forEach((childrenItem: any, idx: number) => {
      const child = parseFixedColumns(
        childrenItem,
        idx,
        columns,
        children,
        key,
        idx === 0 ? _parentStickyWidth : 0
      )

      item.children[idx] = child
      children[idx] = child
      columns[child.index] = child
    })
  }

  return item
}

// export const parseFixedColumnsByRoot = ({
//   column,
//   prevColumn,
//   key,
//   parentStickyWidth = 0,
// }: any) => {
//   prevColumn = prevColumn || { width: 0 }

//   const width = prevColumn.width || 0
//   const stickyWidth = prevColumn[key] || 0

//   column[key] = width + stickyWidth + parentStickyWidth

//   if (column.children) {
//     const _parentStickyWidth = column[key]
//     const { children } = column
//     column.children = []

//     children.forEach((childrenItem: any, index: number) => {
//       column.children[index] = parseFixedColumnsByRoot(
//         {
//           childrenItem,
//           index,
//           children,
//           key,
//           index === 0 ? _parentStickyWidth : 0
//         }
//       )
//     })
//   }
// }

/**
 * 生成 uuid
 */
export const uuid = () => Math.random().toString(36).substring(5).split('').join('.')

export const parseLocalArray = ({ key, defaultValue }: any) => {
  if (key) {
    try {
      let localArr = window.localStorage.getItem(key)

      if (localArr) {
        localArr = JSON.parse(localArr)

        if (Array.isArray(localArr)) {
          return localArr
        }
      }
    } catch (error) {}
  }

  return defaultValue
}

// 检查是否需要展示Total或average
export const checkNeedTotalOrEvg = (_data: any[], item: any, calcKey: string) => {
  if (item[calcKey]) {
    // 当每一项都为数字类型字符串时，才进行求和计算
    const isDataKeyValueAllNumber = _data.every((dataItem) => isNumeric(dataItem[item.dataKey]))
    return isDataKeyValueAllNumber
  }
  return false
}

// 获取总和或取平均值
export const getTotalOrEvgRowData = (_data: any[], c: any, isAvg: boolean) => {
  const dataPointCountList = _data.map((dataItem) => {
    const strNum = dataItem[c.dataKey] + ''
    const afterPonterStr = strNum.split('.')[1]
    return afterPonterStr ? afterPonterStr.length : 0
  })
  const maxPointCount =
    dataPointCountList && dataPointCountList.length ? Math.max(...dataPointCountList) : 0
  const columnSumData = _data.reduce((acc, cur) => (acc += Number(cur[c.dataKey])), 0)

  if (isAvg) {
    const avgData = columnSumData / _data.length
    return maxPointCount > 0 ? avgData.toFixed(maxPointCount) : avgData
  }

  return maxPointCount > 0 ? columnSumData.toFixed(maxPointCount) : columnSumData
}

/**
 * 获取指定列
 */
export const getColumnByDataKey = (
  columns: TableColumnItem[],
  dataKey: string
): TableColumnItem => {
  for (const column of columns) {
    if (column.dataKey === dataKey) {
      return column
    }
    if (column.children) {
      return getColumnByDataKey(column.children, dataKey)
    }
  }

  return {} as TableColumnItem
}

/**
 * 获取默认排序的列
 */
export const getColumnByDefaultSortOrder = (columns: TableColumnItem[]): TableColumnItem => {
  for (const column of columns) {
    if (column.defaultSortOrder || column.sortOrder) {
      return column
    }
    if (column.children) {
      return getColumnByDefaultSortOrder(column.children)
    }
  }

  return {} as TableColumnItem
}

export const flattenColumns = (columns: TableColumnItem[]): TableColumnItem[] => {
  const result: TableColumnItem[] = []
  const traverse = (cols: TableColumnItem[]) => {
    cols.forEach((col) => {
      if (col.children?.length) {
        traverse(col.children)
      } else {
        result.push(col)
      }
    })
  }
  traverse(columns)
  return result
}
