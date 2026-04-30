
import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { IconProps } from '../../@types/props'

const _prefix = getPrefixCls('icon-sound-outlined')

export const SoundOutlined = forwardRef<SVGSVGElement | null, IconProps>(
  ({ prefixCls = _prefix, className, children, size, style: styleProp, ...rest }, ref) => {
    const cls = cx(prefixCls, className)
    const style = { fontSize: size, ...styleProp }

    return (
      <svg className={cls} ref={ref} role="icon" style={style} {...rest}   viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="8405"  ><path d="M612.266667 243.413333c0-21.248-24.362667-33.258667-41.194667-20.309333l-157.077333 120.810667a102.4 102.4 0 0 1-62.421334 21.226666H224a25.6 25.6 0 0 0-25.6 25.6v256a25.6 25.6 0 0 0 25.6 25.6h129.344c20.821333 0 41.173333 6.378667 58.282667 18.218667l160.469333 111.104a25.6 25.6 0 0 0 40.170667-21.056V243.413333z m76.8 537.194667c0 82.602667-92.778667 131.2-160.682667 84.181333l-160.469333-111.082666c-4.266667-2.965333-9.386667-4.544-14.570667-4.544H224a102.4 102.4 0 0 1-102.4-102.4v-256a102.4 102.4 0 0 1 102.4-102.4h127.573333a25.6 25.6 0 0 0 15.573334-5.333334l157.077333-120.789333c67.349333-51.797333 164.842667-3.797333 164.842667 81.152v537.216zM778.666667 546.474667a38.4 38.4 0 1 1 0-76.8h85.333333a38.4 38.4 0 1 1 0 76.8h-85.333333zM765.12 712a38.4 38.4 0 1 1 38.4-66.517333l73.898667 42.666666a38.4 38.4 0 1 1-38.4 66.517334l-73.898667-42.666667zM803.626667 370.666667a38.4 38.4 0 1 1-38.4-66.517334l73.92-42.666666a38.4 38.4 0 1 1 38.4 66.517333l-73.92 42.666667z" p-id="8406"></path></svg>
    )
  }
)

if (__DEV__) {
  SoundOutlined.displayName = 'SoundOutlined'
}
  