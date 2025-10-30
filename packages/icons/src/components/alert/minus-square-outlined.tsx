
import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { IconProps } from '../../@types/props'

const _prefix = getPrefixCls('icon-minus-square-outlined')

export const MinusSquareOutlined = forwardRef<SVGSVGElement | null, IconProps>(
  ({ prefixCls = _prefix, className, children, size, style: styleProp, ...rest }, ref) => {
    const cls = cx(prefixCls, className)
    const style = { fontSize: size, ...styleProp }

    return (
      <svg className={cls} ref={ref} role="icon" style={style} {...rest}   viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="9018"  ><path d="M836.266667 213.333333A25.6 25.6 0 0 0 810.666667 187.733333H213.333333A25.6 25.6 0 0 0 187.733333 213.333333v597.333334a25.6 25.6 0 0 0 25.6 25.6h597.333334a25.6 25.6 0 0 0 25.6-25.6V213.333333z m76.8 597.333334a102.4 102.4 0 0 1-102.4 102.4H213.333333A102.4 102.4 0 0 1 110.933333 810.666667V213.333333A102.4 102.4 0 0 1 213.333333 110.933333h597.333334a102.4 102.4 0 0 1 102.4 102.4v597.333334z" p-id="9019"></path><path d="M679.893333 473.6a38.4 38.4 0 1 1 0 76.8H344.106667a38.4 38.4 0 1 1 0-76.8h335.786666z" p-id="9020"></path></svg>
    )
  }
)

if (__DEV__) {
  MinusSquareOutlined.displayName = 'MinusSquareOutlined'
}
  