import React from 'react'
import { Pagination as HiUIPagination } from '@hi-ui/pagination'
import { mergeProps, Schedular } from '@hi-ui/schema-utils'
import type { PaginationProps as HiUIPaginationProps } from '@hi-ui/pagination'
import { useEditableSchemaTableCtx } from '../../ctx'

export type GetPageDataCtxType = { current: number; pageSize: number }

export type PaginationProps = Omit<Partial<HiUIPaginationProps>, 'current' | 'total'> & {
  /** 总条数 */
  total?: HiUIPaginationProps['total']
  /**
   * pageSize 变化时，自动重置页码至首页
   * - 默认会回到 current > pageCount ? pageCount : current
   */
  autoResetCurrent?: boolean
}

export function Pagination(props: PaginationProps) {
  const { table, paginationState } = useEditableSchemaTableCtx()

  // 分页状态变化时，会由外部触发重渲染
  // 此处不必单独监听 paginationState 状态变化
  const total = paginationState.getValue().rowCount || 0
  const current = table.getState().pagination.pageIndex + 1
  const pageSize = table.getState().pagination.pageSize
  const setPageIndex = (current: number) => table.setPageIndex(current - 1)

  const handleJump: PaginationProps['onJump'] = (current) => {
    setPageIndex(current)
    props.onJump?.(current)
  }

  const handleChange: PaginationProps['onChange'] = (current, prev, size) => {
    // TODO HiUI Pagination 在 onPageSizeChange 的某些特殊情况，会额外触发一次 onChange
    // 例如，分页由一个较小的值 20 变为较大的值 500 时
    // 此处延迟一个队列执行，避免状态更新异常
    Schedular.nextMicro(() => {
      setPageIndex(current)
      props.onChange?.(current, prev, size)
    })
  }

  const handlePageSizeChange: PaginationProps['onPageSizeChange'] = (pageSize, current) => {
    // 开启自动重置 pageSize 变化时，自动重置页码至首页，否则从当前页码减1
    const pageIndex = props.autoResetCurrent ? 0 : current - 1

    table.setPagination((state) => ({ ...state, pageIndex, pageSize }))
    props.onPageSizeChange?.(pageSize, current)
  }

  const finalProps = mergeProps(
    {
      // showJumper: true,
      // showPagers: true,
      // showTotal: true,
      pageSizeOptions: [10, 20, 50, 100],
    } as HiUIPaginationProps,
    props as HiUIPaginationProps,
    {
      current,
      pageSize,
      total,
      onJump: handleJump,
      onChange: handleChange,
      onPageSizeChange: handlePageSizeChange,
    }
  )

  // 仅展示总条数大于等于 pageSize 的选项
  finalProps.pageSizeOptions = finalProps.pageSizeOptions?.filter((size) => size <= total)
  // 如果选项数量小于等于1，则不展示选项
  if ((finalProps.pageSizeOptions?.length ?? 0) <= 1) finalProps.pageSizeOptions = undefined

  // 如果页数小于等于1，则不展示跳转器
  if (total / Math.max(pageSize, 1) <= 1) finalProps.showJumper = false

  return <HiUIPagination {...finalProps} />
}
