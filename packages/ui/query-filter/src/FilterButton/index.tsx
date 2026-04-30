import React from 'react'
import { getPrefixCls } from '@hi-ui/classname'
import Button, { ButtonProps } from '@hi-ui/button'
import { FilterOutlined } from '@hi-ui/icons'

const prefixCls = getPrefixCls('query-filter-button')

export const FilterButton: React.FC<FilterButtonProps> = ({ count, children, ...restProps }) => {
  return (
    <Button
      className={`${prefixCls} ${count ? 'has-count' : ''}`}
      appearance="filled"
      {...restProps}
      type={count ? 'secondary' : 'default'}
    >
      {count ? (
        <div
          className={`${prefixCls}-count-wrapper`}
          {...(count > 9 ? { style: { width: 'auto' } } : {})}
        >
          <span className={`${prefixCls}-count`}>{count}</span>
        </div>
      ) : (
        <FilterOutlined />
      )}
      <span className={`${prefixCls}-text`}>{children}</span>
    </Button>
  )
}

export interface FilterButtonProps extends ButtonProps {
  /**
   * 筛选数量，当数量大于 9 时，宽度会自动调整为自适应
   */
  count?: number
  /**
   * 按钮文本
   */
  children?: React.ReactNode
}
