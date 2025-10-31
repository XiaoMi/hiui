
import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { IconProps } from '../../@types/props'

const _prefix = getPrefixCls('icon-power-off-outlined')

export const PowerOffOutlined = forwardRef<SVGSVGElement | null, IconProps>(
  ({ prefixCls = _prefix, className, children, size, style: styleProp, ...rest }, ref) => {
    const cls = cx(prefixCls, className)
    const style = { fontSize: size, ...styleProp }

    return (
      <svg className={cls} ref={ref} role="icon" style={style} {...rest}   viewBox="0 0 1045 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="23764"  ><path d="M115.242667 530.176c0-124.864 57.728-236.288 147.84-309.333333a38.4 38.4 0 1 1 48.362666 59.648c-72.96 59.157333-119.402667 149.056-119.402666 249.685333 0 177.664 144.96 322.090667 324.266666 322.090667s324.266667-144.426667 324.266667-322.090667c0-100.629333-46.421333-190.506667-119.381333-249.685333a38.4 38.4 0 0 1 48.341333-59.648c90.112 73.045333 147.84 184.469333 147.84 309.333333 0 220.501333-179.776 398.890667-401.066667 398.890667-221.290667 0-401.066667-178.389333-401.066666-398.890667z" p-id="23765"></path><path d="M554.709333 389.333333a38.4 38.4 0 1 1-76.8 0v-256a38.4 38.4 0 1 1 76.8 0v256z" p-id="23766"></path></svg>
    )
  }
)

if (__DEV__) {
  PowerOffOutlined.displayName = 'PowerOffOutlined'
}
  