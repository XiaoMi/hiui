
import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { IconProps } from '../../@types/props'

const _prefix = getPrefixCls('icon-work-order-filled')

export const WorkOrderFilled = forwardRef<SVGSVGElement | null, IconProps>(
  ({ prefixCls = _prefix, className, children, size, style: styleProp, ...rest }, ref) => {
    const cls = cx(prefixCls, className)
    const style = { fontSize: size, ...styleProp }

    return (
      <svg className={cls} ref={ref} role="icon" style={style} {...rest}   viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="5014"  ><path d="M403.221333 602.837333a17.941333 17.941333 0 1 1 0 35.904 17.941333 17.941333 0 0 1 0-35.904z" p-id="5015"></path><path d="M746.666667 85.333333a128 128 0 0 1 128 128v597.333334a128 128 0 0 1-128 128H277.333333a128 128 0 0 1-128-128V213.333333a128 128 0 0 1 128-128h469.333334z m-154.88 278.208c-35.050667-35.029333-82.858667-26.048-117.888 8.96a89.728 89.728 0 0 0-16.128 104.938667l-98.048 98.048a62.784 62.784 0 1 0 88.789333 88.789333l98.048-98.048a89.728 89.728 0 0 0 104.917333-16.128c35.029333-35.029333 44.010667-82.837333 8.981334-117.866666a17.941333 17.941333 0 0 0-25.386667 0l-31.381333 31.381333a4.16 4.16 0 0 1-5.866667 0l-37.44-37.44a4.16 4.16 0 0 1 0-5.866667l31.381333-31.402666a17.941333 17.941333 0 0 0 0-25.365334z" p-id="5016"></path></svg>
    )
  }
)

if (__DEV__) {
  WorkOrderFilled.displayName = 'WorkOrderFilled'
}
  