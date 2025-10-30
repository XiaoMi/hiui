
import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { IconProps } from '../../@types/props'

const _prefix = getPrefixCls('icon-table-outlined')

export const TableOutlined = forwardRef<SVGSVGElement | null, IconProps>(
  ({ prefixCls = _prefix, className, children, size, style: styleProp, ...rest }, ref) => {
    const cls = cx(prefixCls, className)
    const style = { fontSize: size, ...styleProp }

    return (
      <svg className={cls} ref={ref} role="icon" style={style} {...rest}   viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="9896"  ><path d="M198.4 800a25.6 25.6 0 0 0 25.6 25.6h576a25.6 25.6 0 0 0 25.6-25.6v-576a25.6 25.6 0 0 0-25.6-25.6h-576a25.6 25.6 0 0 0-25.6 25.6v576z m-76.8-576a102.4 102.4 0 0 1 102.4-102.4h576a102.4 102.4 0 0 1 102.4 102.4v576a102.4 102.4 0 0 1-102.4 102.4h-576a102.4 102.4 0 0 1-102.4-102.4v-576z" p-id="9897"></path><path d="M433.066667 853.333333a38.4 38.4 0 1 1-76.8 0V426.666667a38.4 38.4 0 1 1 76.8 0v426.666666zM667.733333 853.333333a38.4 38.4 0 1 1-76.8 0V448a38.4 38.4 0 1 1 76.8 0v405.333333z" p-id="9898"></path><path d="M170.666667 689.066667a38.4 38.4 0 1 1 0-76.8h682.666666a38.4 38.4 0 1 1 0 76.8H170.666667zM170.666667 465.066667a38.4 38.4 0 1 1 0-76.8h682.666666a38.4 38.4 0 1 1 0 76.8H170.666667z" p-id="9899"></path></svg>
    )
  }
)

if (__DEV__) {
  TableOutlined.displayName = 'TableOutlined'
}
  