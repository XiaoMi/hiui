
import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { IconProps } from '../../@types/props'

const _prefix = getPrefixCls('icon-play-outlined')

export const PlayOutlined = forwardRef<SVGSVGElement | null, IconProps>(
  ({ prefixCls = _prefix, className, children, size, style: styleProp, ...rest }, ref) => {
    const cls = cx(prefixCls, className)
    const style = { fontSize: size, ...styleProp }

    return (
      <svg className={cls} ref={ref} role="icon" style={style} {...rest}  xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" version="1.1"><path d="M512 85.333333c235.648 0 426.666667 191.018667 426.666667 426.666667s-191.018667 426.666667-426.666667 426.666667S85.333333 747.648 85.333333 512 276.352 85.333333 512 85.333333z m0 85.333334C323.477333 170.666667 170.666667 323.477333 170.666667 512s152.810667 341.333333 341.333333 341.333333 341.333333-152.810667 341.333333-341.333333S700.522667 170.666667 512 170.666667z m-128 213.333333c0-33.173333 36.181333-53.653333 64.618667-36.586667l213.333333 128c27.626667 16.576 27.626667 56.597333 0 73.173334l-213.333333 128C420.181333 693.653333 384 673.173333 384 640z m85.333333 75.328v105.322667L557.098667 512 469.333333 459.328z" p-id="38795"></path></svg>
    )
  }
)

if (__DEV__) {
  PlayOutlined.displayName = 'PlayOutlined'
}
  