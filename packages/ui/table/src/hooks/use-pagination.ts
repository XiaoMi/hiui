import React from 'react'
import { useUncontrolledState } from '@hi-ui/use-uncontrolled-state'
import { TableColumnItem, TableDataSource } from '../types'
import { PaginationProps } from '@hi-ui/pagination'

export const useTablePagination = ({
  columns: columnsProp,
  pagination,
  dataSource,
}: {
  columns: TableColumnItem[]
  pagination?: PaginationProps
  dataSource?: (current: number) => TableDataSource
}) => {
  const [serverTableConfig, setServerTableConfig] = React.useState({
    data: [],
    columns: [...columnsProp],
  })

  const paginationMemo = React.useMemo(() => {
    return serverTableConfig.pagination || pagination || {}
  }, [serverTableConfig, pagination])

  const [currentPage, trySetCurrentPage] = useUncontrolledState(
    1,
    paginationMemo.current,
    paginationMemo.onPageChange
  )

  React.useEffect(() => {
    if (dataSource) {
      const fetchConfig = dataSource(currentPage)

      fetch(fetchConfig).then((res) => {
        setServerTableConfig(Object.assign({}, serverTableConfig, { data: res.data }))
      })
    }
  }, [dataSource, currentPage, serverTableConfig])

  return { currentPage, trySetCurrentPage, paginationMemo }
}
