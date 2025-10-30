
import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { IconProps } from '../../@types/props'

const _prefix = getPrefixCls('icon-equal-proportion-outlined')

export const EqualProportionOutlined = forwardRef<SVGSVGElement | null, IconProps>(
  ({ prefixCls = _prefix, className, children, size, style: styleProp, ...rest }, ref) => {
    const cls = cx(prefixCls, className)
    const style = { fontSize: size, ...styleProp }

    return (
      <svg className={cls} ref={ref} role="icon" style={style} {...rest}   viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="27108"  ><path d="M836.266667 213.333333A25.6 25.6 0 0 0 810.666667 187.733333H213.333333A25.6 25.6 0 0 0 187.733333 213.333333v597.333334a25.6 25.6 0 0 0 25.6 25.6h597.333334a25.6 25.6 0 0 0 25.6-25.6V213.333333z m76.8 597.333334a102.4 102.4 0 0 1-102.4 102.4H213.333333A102.4 102.4 0 0 1 110.933333 810.666667V213.333333A102.4 102.4 0 0 1 213.333333 110.933333h597.333334a102.4 102.4 0 0 1 102.4 102.4v597.333334z" p-id="27109"></path><path d="M721.493333 682.666667h-60.032V434.026667l-48.832 34.944v-67.2l48.853334-38.08h60.010666V682.666667zM555.989333 549.162667h-67.2v-67.2h67.2v67.2z m0 133.504h-67.2v-67.2h67.2V682.666667zM408.682667 682.666667h-60.032V434.026667l-48.832 34.944v-67.2l48.832-38.08h60.032V682.666667z" p-id="27110"></path></svg>
    )
  }
)

if (__DEV__) {
  EqualProportionOutlined.displayName = 'EqualProportionOutlined'
}
  