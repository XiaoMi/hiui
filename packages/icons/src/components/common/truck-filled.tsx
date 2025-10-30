
import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { IconProps } from '../../@types/props'

const _prefix = getPrefixCls('icon-truck-filled')

export const TruckFilled = forwardRef<SVGSVGElement | null, IconProps>(
  ({ prefixCls = _prefix, className, children, size, style: styleProp, ...rest }, ref) => {
    const cls = cx(prefixCls, className)
    const style = { fontSize: size, ...styleProp }

    return (
      <svg className={cls} ref={ref} role="icon" style={style} {...rest}   viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="30759"  ><path d="M202.666667 717.866667a64 64 0 0 1-64-64v-405.333334a64 64 0 0 1 64-64h384a64 64 0 0 1 64 64v42.666667a42.666667 42.666667 0 0 0 42.666666 42.666667h64a128 128 0 0 1 128 128v192a64 64 0 0 1-64 64h-618.666666z" p-id="30760"></path><path d="M612.266667 248.533333a25.6 25.6 0 0 0-25.6-25.6h-384a25.6 25.6 0 0 0-25.6 25.6v405.333334a25.6 25.6 0 0 0 25.6 25.6h618.666666a25.6 25.6 0 0 0 25.6-25.6v-192a89.6 89.6 0 0 0-89.6-89.6h-64a81.066667 81.066667 0 0 1-81.066666-81.066667v-42.666667z m76.8 42.666667c0 2.346667 1.92 4.266667 4.266666 4.266667h64a166.4 166.4 0 0 1 166.4 166.4v192a102.4 102.4 0 0 1-102.4 102.4h-618.666666a102.4 102.4 0 0 1-102.4-102.4v-405.333334a102.4 102.4 0 0 1 102.4-102.4h384a102.4 102.4 0 0 1 102.4 102.4v42.666667zM352 877.866667a96 96 0 0 0 96-96h-64a32 32 0 0 1-64 0h-64a96 96 0 0 0 96 96zM672 877.866667a96 96 0 0 0 96-96h-64a32 32 0 0 1-64 0h-64a96 96 0 0 0 96 96z" p-id="30761"></path></svg>
    )
  }
)

if (__DEV__) {
  TruckFilled.displayName = 'TruckFilled'
}
  