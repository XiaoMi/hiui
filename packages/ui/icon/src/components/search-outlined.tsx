
import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { IconProps } from '../@types/props'

const _role = 'icon-search-outlined'
const _prefix = getPrefixCls(_role)

export const SearchOutlined = forwardRef<SVGSVGElement | null, IconProps>(
  ({ prefixCls = _prefix, role = _role, className, children, style, onClick }, ref) => {
    const cls = cx(prefixCls, className)

    return (
      <svg className={cls} ref={ref} role={role} style={style} onClick={onClick}  xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" version="1.1"><path d="M188.71 189.71c140.588-140.588 368.528-140.588 509.116 0 131.028 131.028 139.94 337.928 26.734 479.276l201.214 201.22c3.762 3.762 4.28 9.344 1.156 12.468l-45.256 45.256c-3.124 3.124-8.706 2.606-12.468-1.156L667.988 725.56c-141.348 113.208-348.25 104.298-479.278-26.732-140.588-140.588-140.588-368.528 0-509.116z m56.568 56.568c-109.346 109.348-109.346 286.634 0 395.98 109.348 109.348 286.634 109.348 395.98 0 109.348-109.346 109.348-286.632 0-395.98-109.346-109.346-286.632-109.346-395.98 0z" p-id="13135"></path></svg>
    )
  }
)

if (__DEV__) {
  SearchOutlined.displayName = 'SearchOutlined'
}
  