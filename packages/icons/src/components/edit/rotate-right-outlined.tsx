
import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { IconProps } from '../../@types/props'

const _prefix = getPrefixCls('icon-rotate-right-outlined')

export const RotateRightOutlined = forwardRef<SVGSVGElement | null, IconProps>(
  ({ prefixCls = _prefix, className, children, size, style: styleProp, ...rest }, ref) => {
    const cls = cx(prefixCls, className)
    const style = { fontSize: size, ...styleProp }

    return (
      <svg className={cls} ref={ref} role="icon" style={style} {...rest}   viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="8992"  ><path d="M294.4 426.666667a25.6 25.6 0 0 1 25.6-25.6h512a25.6 25.6 0 0 1 25.6 25.6v405.333333a25.6 25.6 0 0 1-25.6 25.6H320a25.6 25.6 0 0 1-25.6-25.6V426.666667z m-76.8 405.333333a102.4 102.4 0 0 0 102.4 102.4h512a102.4 102.4 0 0 0 102.4-102.4V426.666667a102.4 102.4 0 0 0-102.4-102.4H320a102.4 102.4 0 0 0-102.4 102.4v405.333333z" p-id="8993"></path><path d="M166.4 522.666667V426.666667a153.6 153.6 0 0 1 153.6-153.6h192.725333c41.813333 0 62.762667-50.56 33.194667-80.128l-92.096-92.096a38.4 38.4 0 1 0-54.314667 54.293333L440.64 196.266667H320C192.746667 196.266667 89.6 299.413333 89.6 426.666667v96a38.4 38.4 0 1 0 76.8 0z" p-id="8994"></path></svg>
    )
  }
)

if (__DEV__) {
  RotateRightOutlined.displayName = 'RotateRightOutlined'
}
  