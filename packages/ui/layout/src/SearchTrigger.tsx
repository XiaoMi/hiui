import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { HiBaseHTMLProps } from '@hi-ui/core'
import { SearchOutlined } from '@hi-ui/icons'

const SEARCH_TRIGGER_PREFIX = getPrefixCls('search-trigger')

/**
 * 搜索触发器组件
 */
export const SearchTrigger = forwardRef<HTMLDivElement | null, SearchTriggerProps>(
  (
    {
      prefixCls = SEARCH_TRIGGER_PREFIX,
      role = 'search-trigger',
      className,
      mini,
      placeholder = '搜索',
      ...rest
    },
    ref
  ) => {
    const cls = cx(prefixCls, className, {
      [`${prefixCls}--mini`]: mini,
    })

    return (
      <div ref={ref} role={role} className={cls} {...rest}>
        <SearchOutlined />
        {!mini && <span className={`${prefixCls}__placeholder`}>{placeholder}</span>}
      </div>
    )
  }
)

export interface SearchTriggerProps extends HiBaseHTMLProps<'div'> {
  mini?: boolean
  placeholder?: string
}

if (__DEV__) {
  SearchTrigger.displayName = 'SearchTrigger'
}
