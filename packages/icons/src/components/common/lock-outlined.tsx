
import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { IconProps } from '../../@types/props'

const _prefix = getPrefixCls('icon-lock-outlined')

export const LockOutlined = forwardRef<SVGSVGElement | null, IconProps>(
  ({ prefixCls = _prefix, className, children, size, style: styleProp, ...rest }, ref) => {
    const cls = cx(prefixCls, className)
    const style = { fontSize: size, ...styleProp }

    return (
      <svg className={cls} ref={ref} role="icon" style={style} {...rest}   viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="21054"  ><path d="M793.6 490.666667a25.6 25.6 0 0 0-25.6-25.6H256a25.6 25.6 0 0 0-25.6 25.6v330.666666a25.6 25.6 0 0 0 25.6 25.6h512a25.6 25.6 0 0 0 25.6-25.6V490.666667z m76.8 330.666666a102.4 102.4 0 0 1-102.4 102.4H256a102.4 102.4 0 0 1-102.4-102.4V490.666667a102.4 102.4 0 0 1 102.4-102.4h512a102.4 102.4 0 0 1 102.4 102.4v330.666666z" p-id="21055"></path><path d="M473.6 618.666667a38.4 38.4 0 1 1 76.8 0v85.333333a38.4 38.4 0 1 1-76.8 0v-85.333333zM665.6 426.666667v-106.666667c0-78.933333-64-142.933333-142.933333-142.933333H512a153.6 153.6 0 0 0-153.6 153.6V426.666667a38.4 38.4 0 1 1-76.8 0v-96c0-127.253333 103.146667-230.4 230.4-230.4h10.666667c121.365333 0 219.733333 98.368 219.733333 219.733333v106.666667a38.4 38.4 0 1 1-76.8 0z" p-id="21056"></path></svg>
    )
  }
)

if (__DEV__) {
  LockOutlined.displayName = 'LockOutlined'
}
  