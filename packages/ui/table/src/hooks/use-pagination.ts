import React from 'react'
import { useUncontrolledState } from '@hi-ui/use-uncontrolled-state'
import { PaginationProps } from '@hi-ui/pagination'
import axios, { AxiosRequestConfig } from 'axios'

export const useTablePagination = ({
  pagination,
  data: dataProp,
  dataSource,
}: {
  data: object[]
  pagination: PaginationProps
  dataSource?: (current: number) => AxiosRequestConfig<any>
}) => {
  const [currentPage, trySetCurrentPage] = useUncontrolledState(
    1,
    pagination.current,
    pagination.onChange
  )

  const [remoteTableData, setRemoteTableData] = React.useState<object[]>([])
  const mergedData = dataSource ? remoteTableData : dataProp

  // 内置远程数据配置 table，包括 data，pagination
  React.useEffect(() => {
    if (dataSource) {
      const requestConfig = dataSource(currentPage)

      axios(requestConfig).then((res) => {
        setRemoteTableData(res.data)
      })
    }
  }, [dataSource, currentPage])

  return { mergedData, pagination, currentPage, trySetCurrentPage }
}
