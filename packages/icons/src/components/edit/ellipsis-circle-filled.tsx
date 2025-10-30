
import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { IconProps } from '../../@types/props'

const _prefix = getPrefixCls('icon-ellipsis-circle-filled')

export const EllipsisCircleFilled = forwardRef<SVGSVGElement | null, IconProps>(
  ({ prefixCls = _prefix, className, children, size, style: styleProp, ...rest }, ref) => {
    const cls = cx(prefixCls, className)
    const style = { fontSize: size, ...styleProp }

    return (
      <svg className={cls} ref={ref} role="icon" style={style} {...rest}   viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="32674"  ><path d="M512 78.933333c239.168 0 433.066667 193.898667 433.066667 433.066667S751.146667 945.066667 512 945.066667 78.933333 751.146667 78.933333 512 272.853333 78.933333 512 78.933333zM298.666667 469.333333a21.333333 21.333333 0 0 0-21.333334 21.333334v42.666666a21.333333 21.333333 0 0 0 21.333334 21.333334h42.666666a21.333333 21.333333 0 0 0 21.333334-21.333334v-42.666666a21.333333 21.333333 0 0 0-21.333334-21.333334h-42.666666z m192 0a21.333333 21.333333 0 0 0-21.333334 21.333334v42.666666a21.333333 21.333333 0 0 0 21.333334 21.333334h42.666666a21.333333 21.333333 0 0 0 21.333334-21.333334v-42.666666a21.333333 21.333333 0 0 0-21.333334-21.333334h-42.666666z m192 0a21.333333 21.333333 0 0 0-21.333334 21.333334v42.666666a21.333333 21.333333 0 0 0 21.333334 21.333334h42.666666a21.333333 21.333333 0 0 0 21.333334-21.333334v-42.666666a21.333333 21.333333 0 0 0-21.333334-21.333334h-42.666666z" p-id="32675"></path></svg>
    )
  }
)

if (__DEV__) {
  EllipsisCircleFilled.displayName = 'EllipsisCircleFilled'
}
  