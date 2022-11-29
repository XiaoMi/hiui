import React from 'react'
import { useUncontrolledState } from '@hi-ui/use-uncontrolled-state'
import { useLatestCallback } from '@hi-ui/use-latest'
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
    pagination?.pageSizeOptions?.[0] ?? 10,
    pagination.pageSize,
    pagination.onPageSizeChange
  )

  const [internalLoading, setInternalLoading] = React.useState<boolean>(false)
  const loading = dataSource ? internalLoading : loadingProp

  const [internalTotal, setInternalTotal] = React.useState<number>(0)
  const total = dataSource ? internalTotal : pagination.total

  const [remoteTableData, setRemoteTableData] = React.useState<object[]>([])
  const mergedData = dataSource ? remoteTableData : dataProp

  /**
   * 当设置 dataSource 后，则自动获取数据
   */
  const getData = useLatestCallback(() => {
    if (dataSource) {
      const requestConfig = dataSource(currentPage, pageSize)

      setInternalLoading(true)

      axios(requestConfig)
        .then((res) => {
          const { data } = res

          setRemoteTableData(data?.list)
          setInternalTotal(data?.total)
        })
        .finally(() => {
          setInternalLoading(false)
        })
    }
  })

  React.useEffect(() => {
    getData()
  }, [currentPage, getData, pageSize])

  React.useEffect(() => {
    if (dataSource) {
      // 如果已经在第一页则直接刷新数据，否则重置到第一页
      currentPage === 1 ? getData() : trySetCurrentPage(1)
    }
  }, [dataSource, getData, trySetCurrentPage])

  return {
    mergedData,
    pagination,
    currentPage,
    trySetCurrentPage,
    pageSize,
    trySetPageSize,
    loading,
    total,
  }
}
