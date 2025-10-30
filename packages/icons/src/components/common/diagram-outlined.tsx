
import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { IconProps } from '../../@types/props'

const _prefix = getPrefixCls('icon-diagram-outlined')

export const DiagramOutlined = forwardRef<SVGSVGElement | null, IconProps>(
  ({ prefixCls = _prefix, className, children, size, style: styleProp, ...rest }, ref) => {
    const cls = cx(prefixCls, className)
    const style = { fontSize: size, ...styleProp }

    return (
      <svg className={cls} ref={ref} role="icon" style={style} {...rest}   viewBox="0 0 1045 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="15607"  ><path d="M462.976 512a53.333333 53.333333 0 1 1 106.666667 0 53.333333 53.333333 0 0 1-106.666667 0z" p-id="15608"></path><path d="M733.909333 512c0-120.170667-97.429333-217.6-217.6-217.6-120.170667 0-217.6 97.429333-217.6 217.6 0 120.170667 97.429333 217.6 217.6 217.6 120.170667 0 217.6-97.429333 217.6-217.6z m76.8 0c0 162.602667-131.797333 294.4-294.4 294.4-162.581333 0-294.4-131.797333-294.4-294.4 0-162.602667 131.818667-294.4 294.4-294.4 162.602667 0 294.4 131.797333 294.4 294.4z" p-id="15609"></path><path d="M932.309333 473.6a38.4 38.4 0 1 1 0 76.8h-149.333333a38.4 38.4 0 1 1 0-76.8h149.333333zM249.642667 473.6a38.4 38.4 0 1 1 0 76.8h-149.333334a38.4 38.4 0 1 1 0-76.8h149.333334z" p-id="15610"></path></svg>
    )
  }
)

if (__DEV__) {
  DiagramOutlined.displayName = 'DiagramOutlined'
}
  