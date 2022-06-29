
import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { IconProps } from '../../@types/props'

const _prefix = getPrefixCls('icon-caret-up-filled')

export const CaretUpFilled = forwardRef<SVGSVGElement | null, IconProps>(
  ({ prefixCls = _prefix, className, children, size, style: styleProp, ...rest }, ref) => {
    const cls = cx(prefixCls, className)
    const style = { fontSize: size, ...styleProp }

    return (
      <svg className={cls} ref={ref} role="icon" style={style} {...rest}  xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" version="1.1"><path d="M545.578667 340.501333L797.226667 642.517333a32 32 0 0 1-24.576 52.48H269.312a32 32 0 0 1-24.576-52.48l251.669333-302.016a32 32 0 0 1 49.173334 0z" p-id="49676"></path></svg>
    )
  }
)

if (__DEV__) {
  CaretUpFilled.displayName = 'CaretUpFilled'
}
  