
import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { IconProps } from '../../@types/props'

const _prefix = getPrefixCls('icon-wash-machine-outlined')

export const WashMachineOutlined = forwardRef<SVGSVGElement | null, IconProps>(
  ({ prefixCls = _prefix, className, children, size, style: styleProp, ...rest }, ref) => {
    const cls = cx(prefixCls, className)
    const style = { fontSize: size, ...styleProp }

    return (
      <svg className={cls} ref={ref} role="icon" style={style} {...rest}   viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="6065"  ><path d="M187.733333 810.666667a25.6 25.6 0 0 0 25.6 25.6h597.333334a25.6 25.6 0 0 0 25.6-25.6V213.333333A25.6 25.6 0 0 0 810.666667 187.733333H213.333333A25.6 25.6 0 0 0 187.733333 213.333333v597.333334zM110.933333 213.333333A102.4 102.4 0 0 1 213.333333 110.933333h597.333334a102.4 102.4 0 0 1 102.4 102.4v597.333334a102.4 102.4 0 0 1-102.4 102.4H213.333333A102.4 102.4 0 0 1 110.933333 810.666667V213.333333z" p-id="6066"></path><path d="M622.933333 597.333333a110.933333 110.933333 0 1 0-221.866666 0 110.933333 110.933333 0 0 0 221.866666 0z m76.8 0a187.733333 187.733333 0 0 1-187.733333 187.733334 187.733333 187.733333 0 0 1-187.733333-187.733334 187.733333 187.733333 0 0 1 187.733333-187.733333 187.733333 187.733333 0 0 1 187.733333 187.733333zM128 358.4v-76.8h757.333333v76.8H128z" p-id="6067"></path></svg>
    )
  }
)

if (__DEV__) {
  WashMachineOutlined.displayName = 'WashMachineOutlined'
}
  