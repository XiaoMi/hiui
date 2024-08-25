import { useEffect, useRef } from 'react'
import { TableColumnItem, FlattedTableRowData } from '../types'
export interface Ipagination {
  current: number | undefined
  pageSize: number | undefined
}
export interface ISorter {
  order: string | null
  column: TableColumnItem
}
export interface IExtra {
  action: string
  currentDataSource: object[]
}
export interface UseChangeProps {
  activeSorterColumn: string | null
  activeSorterType: string | null
  current: number | undefined
  pageSize: number | undefined
  columns: TableColumnItem[]
  showData: FlattedTableRowData[]
  data: object[]
  transitionData: FlattedTableRowData[]
  onChange?: (pagination: Ipagination, sorter: ISorter, extra: IExtra) => void
}

export const useChange = (props: UseChangeProps) => {
  const {
    activeSorterColumn,
    activeSorterType,
    current,
    pageSize,
    columns,
    showData,
    data,
    transitionData,
    onChange,
  } = props

  const changeRef = useRef({
    sort: { activeSorterColumn, activeSorterType },
    pagination: { current, pageSize },
    showData: showData,
    paginationCanChange: false,
    paginationDataChange: false,
    timer: 0,
  })
  changeRef.current.showData = showData

  useEffect(() => {
    if (changeRef.current.paginationCanChange) {
      changeRef.current.paginationDataChange = true
    }
  }, [transitionData])

  useEffect(() => {
    const { sort, pagination, paginationCanChange, paginationDataChange, timer } = changeRef.current
    const sortNotChange =
      sort.activeSorterColumn === activeSorterColumn && sort.activeSorterType === activeSorterType
    const paginationNotChange = pagination.current === current && pagination.pageSize === pageSize
    if (sortNotChange && paginationNotChange && !paginationCanChange) return
    const changeObj = {
      pagination: { current, pageSize },
      sorter: {
        order: activeSorterType,
        column: columns.filter((d) => d.dataKey === activeSorterColumn)[0],
      },
      extra: {
        action: 'sort',
        currentDataSource: showData.map((d) => d.raw),
      },
    }
    if (paginationCanChange && paginationDataChange) {
      changeObj.extra.action = 'paginate'
      onChange?.(changeObj.pagination, changeObj.sorter, changeObj.extra)
      changeRef.current.paginationCanChange = false
      changeRef.current.paginationDataChange = false
      clearTimeout(timer)
    }
    if (!sortNotChange) {
      onChange?.(changeObj.pagination, changeObj.sorter, changeObj.extra)
    } else if (!paginationNotChange) {
      changeObj.extra.action = 'paginate'
      changeRef.current.paginationCanChange = true

      changeRef.current.timer = window.setTimeout(() => {
        changeObj.extra.currentDataSource = changeRef.current.showData.map((d) => d.raw)
        onChange?.(changeObj.pagination, changeObj.sorter, changeObj.extra)
        changeRef.current.paginationCanChange = false
        changeRef.current.paginationDataChange = false
      }, 100)
    }
    sort.activeSorterColumn = activeSorterColumn
    sort.activeSorterType = activeSorterType
    pagination.current = current
    pagination.pageSize = pageSize
  }, [activeSorterColumn, activeSorterType, current, pageSize, columns, showData, data, onChange])
}
