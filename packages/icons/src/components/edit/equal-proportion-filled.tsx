
import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { IconProps } from '../../@types/props'

const _prefix = getPrefixCls('icon-equal-proportion-filled')

export const EqualProportionFilled = forwardRef<SVGSVGElement | null, IconProps>(
  ({ prefixCls = _prefix, className, children, size, style: styleProp, ...rest }, ref) => {
    const cls = cx(prefixCls, className)
    const style = { fontSize: size, ...styleProp }

    return (
      <svg className={cls} ref={ref} role="icon" style={style} {...rest}   viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1356"  ><path d="M810.666667 117.333333a96 96 0 0 1 96 96v597.333334a96 96 0 0 1-96 96H213.333333A96 96 0 0 1 117.333333 810.666667V213.333333A96 96 0 0 1 213.333333 117.333333h597.333334zM348.650667 363.690667l-48.853334 38.08v67.2l48.853334-34.944V682.666667h60.032V363.690667h-60.032z m140.16 251.776V682.666667h67.2v-67.2h-67.2z m172.650666-251.776l-48.853333 38.08v67.2l48.853333-34.944V682.666667h60.032V363.690667h-60.032z m-172.672 118.272v67.2h67.2v-67.2h-67.2z" p-id="1357"></path></svg>
    )
  }
)

if (__DEV__) {
  EqualProportionFilled.displayName = 'EqualProportionFilled'
}
  