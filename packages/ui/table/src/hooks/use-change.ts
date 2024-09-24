import { useEffect, useRef } from 'react'
import { TableColumnItem, FlattedTableRowData } from '../types'
export interface Sorter {
  order: string | null
  column: TableColumnItem
}
export interface Action {
  sorter?: Sorter
}
export interface Extra {
  action: keyof Action
  currentDataSource: object[]
}
export interface UseChangeProps {
  activeSorterColumn: string | null
  activeSorterType: string | null
  columns: TableColumnItem[]
  showData: FlattedTableRowData[]
  onChange?: (action: Action, extra: Extra) => void
}

export const useChange = ({
  activeSorterColumn,
  activeSorterType,
  columns,
  showData,
  onChange,
}: UseChangeProps) => {
  const changeRef = useRef({
    sort: { activeSorterColumn, activeSorterType },
  })

  useEffect(() => {
    const { sort } = changeRef.current
    const sortNotChange =
      sort.activeSorterColumn === activeSorterColumn && sort.activeSorterType === activeSorterType
    if (sortNotChange) return
    const changeObj = {
      sorter: {
        order: activeSorterType,
        column: columns.filter((d) => d.dataKey === activeSorterColumn)[0],
      },
      extra: {
        action: 'sorter',
        currentDataSource: showData.map((d) => d.raw),
      } as Extra,
    }
    onChange?.({ sorter: changeObj.sorter }, changeObj.extra)
    sort.activeSorterColumn = activeSorterColumn
    sort.activeSorterType = activeSorterType
  }, [activeSorterColumn, activeSorterType, columns, showData, onChange])
}
