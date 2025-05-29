import React from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { Select } from '@hi-ui/select'
import { __DEV__ } from '@hi-ui/env'
import { PopperOverlayProps } from '@hi-ui/popper'

const _role = 'pagination'
const _prefix = getPrefixCls(_role)

export const PageOption: React.FC<PageOptionProps> = ({
  prefixCls = _prefix,
  pageSizeOptions,
  pageSizeOptionsOverlay,
  onPageSizeChange,
  pageSize,
  size = 'md',
}) => {
  const cls = cx(`${prefixCls}__option`)

  return (
    <Select
      className={cls}
      style={{ width: 'auto' }}
      optionWidth={'auto'}
      data={pageSizeOptions}
      value={pageSize}
      clearable={false}
      size={size}
      onChange={onPageSizeChange as (value: React.ReactText) => void}
      overlay={pageSizeOptionsOverlay}
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
   *  下拉框选择项浮层配置
   */
  pageSizeOptionsOverlay?: PopperOverlayProps
  /**
   * 	每页条数
   */
  pageSize: number
  /**
   * 设置尺寸
   */
  size?: 'xs' | 'sm' | 'md'
}

if (__DEV__) {
  PageOption.displayName = 'PageOption'
}
