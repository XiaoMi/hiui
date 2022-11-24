import React from 'react'
import { useUncontrolledState } from '@hi-ui/use-uncontrolled-state'
import { PaginationProps } from '@hi-ui/pagination'
import axios from 'axios'

export const useTablePagination = ({
  pagination,
  loadingProp,
  data: dataProp,
  dataSource,
}: {
  loadingProp?: boolean
  data: object[]
  pagination: PaginationProps
  dataSource?: (current: number, pageSize?: number) => any
}) => {
  const [currentPage, trySetCurrentPage] = useUncontrolledState(
    1,
    pagination.current,
    pagination.onChange
  )

  const [pageSize, trySetPageSize] = useUncontrolledState(
    10,
    pagination.pageSize,
    pagination.onPageSizeChange
  )

  const [internalLoading, setInternalLoading] = React.useState<boolean>(false)
  const loading = dataSource ? internalLoading : loadingProp

  const [remoteTableData, setRemoteTableData] = React.useState<object[]>([])
  const mergedData = dataSource ? remoteTableData : dataProp

  // 内置远程数据配置 table，包括 data，pagination
  React.useEffect(() => {
    if (dataSource) {
      const requestConfig = dataSource(currentPage, pageSize)

      setInternalLoading(true)

      axios(requestConfig)
        .then((res) => {
          setRemoteTableData(res.data)
        })
        .finally(() => {
          setInternalLoading(false)
        })
    }
  }, [currentPage, pageSize])

  return {
    mergedData,
    pagination,
    currentPage,
    trySetCurrentPage,
    pageSize,
    trySetPageSize,
    loading,
  }
}
