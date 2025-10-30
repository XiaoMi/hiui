
import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { IconProps } from '../../@types/props'

const _prefix = getPrefixCls('icon-close-circle-filled')

export const CloseCircleFilled = forwardRef<SVGSVGElement | null, IconProps>(
  ({ prefixCls = _prefix, className, children, size, style: styleProp, ...rest }, ref) => {
    const cls = cx(prefixCls, className)
    const style = { fontSize: size, ...styleProp }

    return (
      <svg className={cls} ref={ref} role="icon" style={style} {...rest}   viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="13820"  ><path d="M512 78.933333c239.168 0 433.066667 193.898667 433.066667 433.066667S751.146667 945.066667 512 945.066667 78.933333 751.146667 78.933333 512 272.853333 78.933333 512 78.933333z m155.157333 277.909334a38.4 38.4 0 0 0-54.314666 0L512 457.728l-100.842667-100.842667a38.4 38.4 0 1 0-54.314666 54.272L457.728 512l-100.842667 100.842667a38.4 38.4 0 1 0 54.272 54.314666L512 566.272l100.842667 100.842667a38.4 38.4 0 1 0 54.314666-54.272L566.272 512l100.842667-100.842667a38.4 38.4 0 0 0 0-54.314666z" p-id="13821"></path></svg>
    )
  }
)

if (__DEV__) {
  CloseCircleFilled.displayName = 'CloseCircleFilled'
}
  