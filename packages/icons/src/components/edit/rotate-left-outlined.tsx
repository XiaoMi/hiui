
import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { IconProps } from '../../@types/props'

const _prefix = getPrefixCls('icon-rotate-left-outlined')

export const RotateLeftOutlined = forwardRef<SVGSVGElement | null, IconProps>(
  ({ prefixCls = _prefix, className, children, size, style: styleProp, ...rest }, ref) => {
    const cls = cx(prefixCls, className)
    const style = { fontSize: size, ...styleProp }

    return (
      <svg className={cls} ref={ref} role="icon" style={style} {...rest}   viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="8846"  ><path d="M729.6 426.666667a25.6 25.6 0 0 0-25.6-25.6H192A25.6 25.6 0 0 0 166.4 426.666667v405.333333A25.6 25.6 0 0 0 192 857.6h512a25.6 25.6 0 0 0 25.6-25.6V426.666667z m76.8 405.333333a102.4 102.4 0 0 1-102.4 102.4H192A102.4 102.4 0 0 1 89.6 832V426.666667A102.4 102.4 0 0 1 192 324.266667h512a102.4 102.4 0 0 1 102.4 102.4v405.333333z" p-id="8847"></path><path d="M857.6 522.666667V426.666667a153.6 153.6 0 0 0-153.6-153.6h-192.725333c-41.813333 0-62.762667-50.56-33.194667-80.128l92.096-92.096a38.4 38.4 0 1 1 54.314667 54.293333L583.36 196.266667H704c127.253333 0 230.4 103.146667 230.4 230.4v96a38.4 38.4 0 1 1-76.8 0z" p-id="8848"></path></svg>
    )
  }
)

if (__DEV__) {
  RotateLeftOutlined.displayName = 'RotateLeftOutlined'
}
  