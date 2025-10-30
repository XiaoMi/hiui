
import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { IconProps } from '../../@types/props'

const _prefix = getPrefixCls('icon-unlock-filled')

export const UnlockFilled = forwardRef<SVGSVGElement | null, IconProps>(
  ({ prefixCls = _prefix, className, children, size, style: styleProp, ...rest }, ref) => {
    const cls = cx(prefixCls, className)
    const style = { fontSize: size, ...styleProp }

    return (
      <svg className={cls} ref={ref} role="icon" style={style} {...rest}   viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="31050"  ><path d="M768 398.933333a102.4 102.4 0 0 1 102.4 102.4v320a102.4 102.4 0 0 1-102.4 102.4H256a102.4 102.4 0 0 1-102.4-102.4v-320a102.4 102.4 0 0 1 102.4-102.4h512z m-256 181.333334a38.4 38.4 0 0 0-38.4 38.4v85.333333a38.4 38.4 0 1 0 76.8 0v-85.333333a38.4 38.4 0 0 0-38.4-38.4z" p-id="31051"></path><path d="M665.6 320c0-78.933333-64-142.933333-142.933333-142.933333H512a153.6 153.6 0 0 0-153.6 153.6V426.666667a38.4 38.4 0 1 1-76.8 0v-96c0-127.253333 103.146667-230.4 230.4-230.4h10.666667c121.365333 0 219.733333 98.368 219.733333 219.733333a38.4 38.4 0 1 1-76.8 0z" p-id="31052"></path></svg>
    )
  }
)

if (__DEV__) {
  UnlockFilled.displayName = 'UnlockFilled'
}
  