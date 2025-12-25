
import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { IconProps } from '../../@types/props'

const _prefix = getPrefixCls('icon-rotate-right-filled')

export const RotateRightFilled = forwardRef<SVGSVGElement | null, IconProps>(
  ({ prefixCls = _prefix, className, children, size, style: styleProp, ...rest }, ref) => {
    const cls = cx(prefixCls, className)
    const style = { fontSize: size, ...styleProp }

    return (
      <svg className={cls} ref={ref} role="icon" style={style} {...rest}   viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="5310"  ><path d="M896 426.666667a64 64 0 0 0-64-64H320a64 64 0 0 0-64 64v405.333333a64 64 0 0 0 64 64h512a64 64 0 0 0 64-64V426.666667z" p-id="5311"></path><path d="M217.6 832a102.4 102.4 0 0 0 102.4 102.4h512a102.4 102.4 0 0 0 102.4-102.4V426.666667a102.4 102.4 0 0 0-102.4-102.4H320a102.4 102.4 0 0 0-102.4 102.4v405.333333z m76.8-405.333333a25.6 25.6 0 0 1 25.6-25.6h512a25.6 25.6 0 0 1 25.6 25.6v405.333333a25.6 25.6 0 0 1-25.6 25.6H320a25.6 25.6 0 0 1-25.6-25.6V426.666667z" p-id="5312"></path><path d="M89.6 522.666667a38.4 38.4 0 1 0 76.8 0V426.666667a153.6 153.6 0 0 1 153.6-153.6h192.725333c41.813333 0 62.762667-50.56 33.194667-80.128l-92.096-92.096a38.4 38.4 0 1 0-54.314667 54.293333L440.64 196.266667H320C192.746667 196.266667 89.6 299.413333 89.6 426.666667v96z" p-id="5313"></path></svg>
    )
  }
)

if (__DEV__) {
  RotateRightFilled.displayName = 'RotateRightFilled'
}
  