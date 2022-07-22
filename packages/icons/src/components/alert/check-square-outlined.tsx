
import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { IconProps } from '../../@types/props'

const _prefix = getPrefixCls('icon-check-square-outlined')

export const CheckSquareOutlined = forwardRef<SVGSVGElement | null, IconProps>(
  ({ prefixCls = _prefix, className, children, size, style: styleProp, ...rest }, ref) => {
    const cls = cx(prefixCls, className)
    const style = { fontSize: size, ...styleProp }

    return (
      <svg className={cls} ref={ref} role="icon" style={style} {...rest}  xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" version="1.1"><path d="M789.333333 106.666667H234.666667a128 128 0 0 0-128 128v554.666666a128 128 0 0 0 128 128h554.666666a128 128 0 0 0 128-128V234.666667a128 128 0 0 0-128-128zM234.666667 192h554.666666a42.666667 42.666667 0 0 1 42.666667 42.666667v554.666666a42.666667 42.666667 0 0 1-42.666667 42.666667H234.666667a42.666667 42.666667 0 0 1-42.666667-42.666667V234.666667a42.666667 42.666667 0 0 1 42.666667-42.666667zM734.165333 414.165333a42.666667 42.666667 0 0 0-57.621333-62.826666l-2.709333 2.496L448 579.626667l-97.834667-97.813334a42.666667 42.666667 0 0 0-57.621333-2.496l-2.709333 2.496a42.666667 42.666667 0 0 0-2.496 57.621334l2.496 2.709333 128 128a42.666667 42.666667 0 0 0 57.621333 2.496l2.709333-2.496 256-256z" p-id="47661"></path></svg>
    )
  }
)

if (__DEV__) {
  CheckSquareOutlined.displayName = 'CheckSquareOutlined'
}
  