
import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { IconProps } from '../../@types/props'

const _prefix = getPrefixCls('icon-picture-filled')

export const PictureFilled = forwardRef<SVGSVGElement | null, IconProps>(
  ({ prefixCls = _prefix, className, children, size, style: styleProp, ...rest }, ref) => {
    const cls = cx(prefixCls, className)
    const style = { fontSize: size, ...styleProp }

    return (
      <svg className={cls} ref={ref} role="icon" style={style} {...rest}   viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="27174"  ><path d="M366.933333 324.266667a42.666667 42.666667 0 1 1 0 85.333333 42.666667 42.666667 0 0 1 0-85.333333z" p-id="27175"></path><path d="M810.666667 110.933333a102.4 102.4 0 0 1 102.4 102.4v597.333334a102.4 102.4 0 0 1-102.4 102.4H213.333333A102.4 102.4 0 0 1 110.933333 810.666667V213.333333A102.4 102.4 0 0 1 213.333333 110.933333h597.333334z m-90.389334 419.349334a102.4 102.4 0 0 0-140.906666-8.362667l-294.826667 248.725333a38.4 38.4 0 0 0 49.557333 58.709334l294.805334-248.746667a25.6 25.6 0 0 1 35.2 2.090667l107.84 115.498666a38.4 38.4 0 0 0 56.106666-52.416l-107.776-115.498666zM366.933333 247.466667a119.466667 119.466667 0 1 0 0.042667 238.933333 119.466667 119.466667 0 0 0-0.042667-238.933333z" p-id="27176"></path></svg>
    )
  }
)

if (__DEV__) {
  PictureFilled.displayName = 'PictureFilled'
}
  