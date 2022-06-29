
import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { IconProps } from '../../@types/props'

const _prefix = getPrefixCls('icon-scissor-outlined')

export const ScissorOutlined = forwardRef<SVGSVGElement | null, IconProps>(
  ({ prefixCls = _prefix, className, children, size, style: styleProp, ...rest }, ref) => {
    const cls = cx(prefixCls, className)
    const style = { fontSize: size, ...styleProp }

    return (
      <svg className={cls} ref={ref} role="icon" style={style} {...rest}  xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" version="1.1"><path d="M198.122667 138.005333l2.709333 2.496L512 451.626667 823.168 140.501333l2.709333-2.496a42.666667 42.666667 0 0 1 57.621334 62.826667L572.373333 512l87.616 87.637333a170.666667 170.666667 0 1 1-60.330666 60.330667L512 572.352l-87.637333 87.616a169.728 169.728 0 0 1 23.466666 79.424L448 746.666667a170.666667 170.666667 0 1 1-83.968-147.029334L451.648 512 140.501333 200.832A42.666667 42.666667 0 0 1 198.122667 138.026667zM746.666667 661.333333a85.333333 85.333333 0 1 0 0 170.666667 85.333333 85.333333 0 0 0 0-170.666667z m-469.333334 0a85.333333 85.333333 0 1 0 0 170.666667 85.333333 85.333333 0 0 0 0-170.666667z" p-id="45036"></path></svg>
    )
  }
)

if (__DEV__) {
  ScissorOutlined.displayName = 'ScissorOutlined'
}
  