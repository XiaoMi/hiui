
import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { IconProps } from '../../@types/props'

const _prefix = getPrefixCls('icon-approve-outlined')

export const ApproveOutlined = forwardRef<SVGSVGElement | null, IconProps>(
  ({ prefixCls = _prefix, className, children, size, style: styleProp, ...rest }, ref) => {
    const cls = cx(prefixCls, className)
    const style = { fontSize: size, ...styleProp }

    return (
      <svg className={cls} ref={ref} role="icon" style={style} {...rest}   viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="11727"  ><path d="M768 89.6A102.4 102.4 0 0 1 870.4 192v640c0 56.576-45.909333 102.4-102.442667 102.4H256.042667A102.421333 102.421333 0 0 1 153.6 832V192A102.4 102.4 0 0 1 256 89.6h512zM256 166.4A25.6 25.6 0 0 0 230.4 192v640c0 14.101333 11.477333 25.6 25.642667 25.6h511.914666c14.165333 0 25.642667-11.498667 25.642667-25.6V192A25.6 25.6 0 0 0 768 166.4H256z" p-id="11728"></path><path d="M650.666667 622.933333a38.4 38.4 0 1 1 0 76.8h-277.333334a38.4 38.4 0 1 1 0-76.8h277.333334zM612.48 335.872a38.4 38.4 0 1 1 55.018667 53.589333l-5.738667 5.888-145.28 149.12a59.733333 59.733333 0 0 1-85.546667 0l-74.453333-76.394666a38.4 38.4 0 0 1 55.018667-53.610667l62.208 63.829333 138.794666-142.421333z" p-id="11729"></path></svg>
    )
  }
)

if (__DEV__) {
  ApproveOutlined.displayName = 'ApproveOutlined'
}
  