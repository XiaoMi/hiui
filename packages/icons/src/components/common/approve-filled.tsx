
import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { IconProps } from '../../@types/props'

const _prefix = getPrefixCls('icon-approve-filled')

export const ApproveFilled = forwardRef<SVGSVGElement | null, IconProps>(
  ({ prefixCls = _prefix, className, children, size, style: styleProp, ...rest }, ref) => {
    const cls = cx(prefixCls, className)
    const style = { fontSize: size, ...styleProp }

    return (
      <svg className={cls} ref={ref} role="icon" style={style} {...rest}   viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="5992"  ><path d="M870.4 832c0 56.576-45.909333 102.4-102.442667 102.4H256.042667A102.421333 102.421333 0 0 1 153.6 832V192A102.4 102.4 0 0 1 256 89.6h512A102.4 102.4 0 0 1 870.4 192v640z m-181.333333-170.666667a38.4 38.4 0 0 0-38.4-38.4h-277.333334a38.4 38.4 0 1 0 0 76.8h277.333334a38.4 38.4 0 0 0 38.4-38.4z m-21.546667-271.872a38.4 38.4 0 0 0-55.04-53.589333l-138.773333 142.421333-62.208-63.829333a38.4 38.4 0 0 0-54.997334 53.589333l74.410667 76.394667a59.754667 59.754667 0 0 0 85.589333 0l145.28-149.098667 5.717334-5.888z" p-id="5993"></path></svg>
    )
  }
)

if (__DEV__) {
  ApproveFilled.displayName = 'ApproveFilled'
}
  