
import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { IconProps } from '../../@types/props'

const _prefix = getPrefixCls('icon-loudspeaker-filled')

export const LoudspeakerFilled = forwardRef<SVGSVGElement | null, IconProps>(
  ({ prefixCls = _prefix, className, children, size, style: styleProp, ...rest }, ref) => {
    const cls = cx(prefixCls, className)
    const style = { fontSize: size, ...styleProp }

    return (
      <svg className={cls} ref={ref} role="icon" style={style} {...rest}   viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="11203"  ><path d="M733.866667 857.6a38.4 38.4 0 0 0 38.4-38.4V204.8a38.4 38.4 0 0 0-38.4-38.4H290.133333a38.4 38.4 0 0 0-38.4 38.4v614.4a38.4 38.4 0 0 0 38.4 38.4h443.733334z m-443.733334 76.8a115.2 115.2 0 0 1-115.2-115.2V204.8a115.2 115.2 0 0 1 115.2-115.2h443.733334a115.2 115.2 0 0 1 115.2 115.2v614.4a115.2 115.2 0 0 1-115.2 115.2H290.133333z" p-id="11204"></path><path d="M512 571.733333a78.933333 78.933333 0 1 1 0 157.866667 78.933333 78.933333 0 0 1 0-157.866667zM512 294.4a46.933333 46.933333 0 1 1 0 93.866667 46.933333 46.933333 0 0 1 0-93.866667z" p-id="11205"></path><path d="M733.866667 128A76.8 76.8 0 0 1 810.666667 204.8v614.4a76.8 76.8 0 0 1-76.8 76.8H290.133333a76.8 76.8 0 0 1-76.8-76.8V204.8A76.8 76.8 0 0 1 290.133333 128h443.733334zM512 494.933333a155.733333 155.733333 0 1 0 0 311.466667 155.733333 155.733333 0 0 0 0-311.466667z m0-277.333333a123.733333 123.733333 0 1 0 0 247.466667 123.733333 123.733333 0 0 0 0-247.466667z" p-id="11206"></path></svg>
    )
  }
)

if (__DEV__) {
  LoudspeakerFilled.displayName = 'LoudspeakerFilled'
}
  