
import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { IconProps } from '../../@types/props'

const _prefix = getPrefixCls('icon-work-order-outlined')

export const WorkOrderOutlined = forwardRef<SVGSVGElement | null, IconProps>(
  ({ prefixCls = _prefix, className, children, size, style: styleProp, ...rest }, ref) => {
    const cls = cx(prefixCls, className)
    const style = { fontSize: size, ...styleProp }

    return (
      <svg className={cls} ref={ref} role="icon" style={style} {...rest}   viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="6212"  ><path d="M768 89.6A102.4 102.4 0 0 1 870.4 192v640c0 56.576-45.909333 102.4-102.442667 102.4H256.042667A102.421333 102.421333 0 0 1 153.6 832V192A102.4 102.4 0 0 1 256 89.6h512zM256 166.4A25.6 25.6 0 0 0 230.4 192v640c0 14.101333 11.477333 25.6 25.642667 25.6h511.914666c14.165333 0 25.642667-11.498667 25.642667-25.6V192A25.6 25.6 0 0 0 768 166.4H256z" p-id="6213"></path><path d="M597.802667 463.637333c1.621333 1.621333 4.266667 1.621333 5.888 0l31.402666-31.402666a17.941333 17.941333 0 0 1 25.365334 0c35.029333 35.029333 26.048 82.837333-8.96 117.866666a89.749333 89.749333 0 0 1-104.938667 16.128l-98.048 98.048a62.784 62.784 0 0 1-88.789333-88.789333l98.048-98.048a89.749333 89.749333 0 0 1 16.128-104.917333c35.029333-35.029333 82.837333-44.010667 117.866666-8.96a17.941333 17.941333 0 0 1 0 25.344l-31.402666 31.402666a4.16 4.16 0 0 0 0 5.888l37.44 37.44z m-194.581334 175.082667a17.92 17.92 0 1 0 0-35.882667 17.92 17.92 0 0 0 0 35.882667z" p-id="6214"></path></svg>
    )
  }
)

if (__DEV__) {
  WorkOrderOutlined.displayName = 'WorkOrderOutlined'
}
  