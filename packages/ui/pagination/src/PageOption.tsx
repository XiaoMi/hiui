import React from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { Select } from '@hi-ui/select'
import { __DEV__ } from '@hi-ui/env'

const _role = 'pagination'
const _prefix = getPrefixCls(_role)

/**
 * TODO: What is PageOption
 */
export const PageOption: React.FC<PageOptionProps> = ({
  prefixCls = _prefix,
  pageSizeOptions,
  onPageSizeChange,
  pageSize,
}) => {
  const cls = cx(`${prefixCls}__option`)

  return (
    <Select
      className={cls}
      style={{ width: 110 }}
      data={pageSizeOptions}
      value={pageSize}
      clearable={false}
      onChange={onPageSizeChange as (value: React.ReactText) => void}
    />
  )
}

export interface PageOptionProps {
  /**
   * 组件默认的选择器类
   */
  prefixCls?: string
  /**
   * 当前页码
   */
  current?: number
  /**
   * 每页显示条数改变的回调函数
   */
  onPageSizeChange?: (value: number) => void
  /**
   * 指定每页可以显示多少条
   */
  pageSizeOptions: { id: React.ReactText; title: string }[]
  /**
   * 	每页条数
   */
  pageSize: number
}

if (__DEV__) {
  PageOption.displayName = 'PageOption'
}
