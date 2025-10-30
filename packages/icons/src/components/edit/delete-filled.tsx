
import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { IconProps } from '../../@types/props'

const _prefix = getPrefixCls('icon-delete-filled')

export const DeleteFilled = forwardRef<SVGSVGElement | null, IconProps>(
  ({ prefixCls = _prefix, className, children, size, style: styleProp, ...rest }, ref) => {
    const cls = cx(prefixCls, className)
    const style = { fontSize: size, ...styleProp }

    return (
      <svg className={cls} ref={ref} role="icon" style={style} {...rest}   viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="32091"  ><path d="M853.333333 242.090667a38.4 38.4 0 1 1 0 76.8h-14.933333v505.6a102.4 102.4 0 0 1-102.4 102.4h-448a102.4 102.4 0 0 1-102.4-102.4v-505.6H170.666667a38.4 38.4 0 1 1 0-76.8h682.666666z m-426.666666 187.84a38.4 38.4 0 0 0-38.4 38.4v221.909333a38.4 38.4 0 0 0 76.8 0V468.330667a38.4 38.4 0 0 0-38.4-38.4z m170.666666 0a38.4 38.4 0 0 0-38.4 38.4v221.909333a38.4 38.4 0 1 0 76.8 0V468.330667a38.4 38.4 0 0 0-38.4-38.4z" p-id="32092"></path><path d="M390.08 173.909333a38.4 38.4 0 0 1 0-76.8h243.818667a38.4 38.4 0 1 1 0 76.8H390.08z" p-id="32093"></path></svg>
    )
  }
)

if (__DEV__) {
  DeleteFilled.displayName = 'DeleteFilled'
}
  