
import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { IconProps } from '../../@types/props'

const _prefix = getPrefixCls('icon-heart2-outlined')

export const Heart2Outlined = forwardRef<SVGSVGElement | null, IconProps>(
  ({ prefixCls = _prefix, className, children, size, style: styleProp, ...rest }, ref) => {
    const cls = cx(prefixCls, className)
    const style = { fontSize: size, ...styleProp }

    return (
      <svg className={cls} ref={ref} role="icon" style={style} {...rest}   viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"  ><path d="M558.229333 214.933333c87.466667-87.466667 229.312-87.466667 316.8 0 85.909333 85.930667 87.445333 224.256 4.586667 312.064l-4.586667 4.736-301.717333 301.696a85.333333 85.333333 0 0 1-117.269333 3.2l-3.413334-3.2L150.954667 531.733333c-87.466667-87.466667-87.466667-229.333333 0-316.8 85.930667-85.909333 224.256-87.445333 312.064-4.586666l4.736 4.586666 45.226666 45.269334 45.269334-45.269334z m63.914667 56.896l-3.562667 3.456-16.042666 16.021334-0.256-0.277334-89.578667 89.578667-105.322667-105.322667-3.584-3.456a138.666667 138.666667 0 0 0-192.512 199.552l301.696 301.696 98.048-98.048 3.456-3.584c1.258667-1.344 2.474667-2.709333 3.669334-4.074666l117.226666-117.226667 0.064 0.490667 79.232-79.253334a138.666667 138.666667 0 0 0-192.533333-199.552z" p-id="10930"></path></svg>
    )
  }
)

if (__DEV__) {
  Heart2Outlined.displayName = 'Heart2Outlined'
}
  