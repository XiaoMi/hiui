
import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { IconProps } from '../../@types/props'

const _prefix = getPrefixCls('icon-webpage-filled')

export const WebpageFilled = forwardRef<SVGSVGElement | null, IconProps>(
  ({ prefixCls = _prefix, className, children, size, style: styleProp, ...rest }, ref) => {
    const cls = cx(prefixCls, className)
    const style = { fontSize: size, ...styleProp }

    return (
      <svg className={cls} ref={ref} role="icon" style={style} {...rest}   viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="31486"  ><path d="M923.733333 454.4V768a102.4 102.4 0 0 1-102.4 102.4h-618.666666A102.4 102.4 0 0 1 100.266667 768V454.4h823.466666zM100.266667 256a102.4 102.4 0 0 1 102.4-102.4h618.666666a102.4 102.4 0 0 1 102.4 102.4v121.6H100.266667V256z m273.066666 10.666667a32 32 0 1 0 64 0 32 32 0 0 0-64 0z m-85.333333 0a32 32 0 1 0 64 0 32 32 0 0 0-64 0z m-85.333333 0a32 32 0 1 0 64 0 32 32 0 0 0-64 0z" p-id="31487"></path></svg>
    )
  }
)

if (__DEV__) {
  WebpageFilled.displayName = 'WebpageFilled'
}
  