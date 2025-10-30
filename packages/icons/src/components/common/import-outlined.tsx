
import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { IconProps } from '../../@types/props'

const _prefix = getPrefixCls('icon-import-outlined')

export const ImportOutlined = forwardRef<SVGSVGElement | null, IconProps>(
  ({ prefixCls = _prefix, className, children, size, style: styleProp, ...rest }, ref) => {
    const cls = cx(prefixCls, className)
    const style = { fontSize: size, ...styleProp }

    return (
      <svg className={cls} ref={ref} role="icon" style={style} {...rest}   viewBox="0 0 1045 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="20238"  ><path d="M797.76 533.333333V192a25.6 25.6 0 0 0-25.6-25.6h-512a25.6 25.6 0 0 0-25.6 25.6v640c0 14.165333 11.434667 25.6 25.536 25.6h189.845333a38.4 38.4 0 1 1 0 76.8h-189.845333A102.357333 102.357333 0 0 1 157.76 832V192a102.4 102.4 0 0 1 102.4-102.4h512a102.4 102.4 0 0 1 102.4 102.4v341.333333a38.4 38.4 0 1 1-76.8 0z" p-id="20239"></path><path d="M366.805333 443.733333a38.4 38.4 0 1 1 0-76.8h298.666667a38.4 38.4 0 1 1 0 76.8h-298.666667zM366.805333 614.4a38.4 38.4 0 1 1 0-76.8h192a38.4 38.4 0 1 1 0 76.8h-192zM879.146667 844.714667a38.4 38.4 0 1 0 0-76.8h-234.666667a38.4 38.4 0 1 0 0 76.8h234.666667z" p-id="20240"></path><path d="M724.629333 741.824a38.4 38.4 0 1 0-54.293333-54.314667l-90.517333 90.517334a38.4 38.4 0 1 0 54.314666 54.293333l90.496-90.496z" p-id="20241"></path><path d="M670.336 922.837333a38.4 38.4 0 1 0 54.293333-54.314666l-90.496-90.496a38.4 38.4 0 1 0-54.314666 54.293333l90.517333 90.517333z" p-id="20242"></path></svg>
    )
  }
)

if (__DEV__) {
  ImportOutlined.displayName = 'ImportOutlined'
}
  