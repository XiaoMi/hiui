
import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { IconProps } from '../../@types/props'

const _prefix = getPrefixCls('icon-lock-filled')

export const LockFilled = forwardRef<SVGSVGElement | null, IconProps>(
  ({ prefixCls = _prefix, className, children, size, style: styleProp, ...rest }, ref) => {
    const cls = cx(prefixCls, className)
    const style = { fontSize: size, ...styleProp }

    return (
      <svg className={cls} ref={ref} role="icon" style={style} {...rest}   viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="25399"  ><path d="M522.666667 100.266667c121.365333 0 219.733333 98.368 219.733333 219.733333v68.266667H768a102.4 102.4 0 0 1 102.4 102.4v330.666666a102.4 102.4 0 0 1-102.4 102.4H256a102.4 102.4 0 0 1-102.4-102.4V490.666667a102.4 102.4 0 0 1 102.4-102.4h25.6v-57.6c0-127.253333 103.146667-230.4 230.4-230.4h10.666667zM512 580.266667a38.4 38.4 0 0 0-38.4 38.4v85.333333a38.4 38.4 0 1 0 76.8 0v-85.333333a38.4 38.4 0 0 0-38.4-38.4z m0-403.2a153.6 153.6 0 0 0-153.6 153.6v57.6h307.2V320c0-78.933333-64-142.933333-142.933333-142.933333H512z" p-id="25400"></path></svg>
    )
  }
)

if (__DEV__) {
  LockFilled.displayName = 'LockFilled'
}
  