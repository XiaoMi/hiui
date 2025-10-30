
import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { IconProps } from '../../@types/props'

const _prefix = getPrefixCls('icon-export-outlined')

export const ExportOutlined = forwardRef<SVGSVGElement | null, IconProps>(
  ({ prefixCls = _prefix, className, children, size, style: styleProp, ...rest }, ref) => {
    const cls = cx(prefixCls, className)
    const style = { fontSize: size, ...styleProp }

    return (
      <svg className={cls} ref={ref} role="icon" style={style} {...rest}   viewBox="0 0 1045 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="16567"  ><path d="M115.242667 810.666667V213.333333a102.4 102.4 0 0 1 102.4-102.4h232.746666a38.4 38.4 0 1 1 0 76.8h-232.746666a25.6 25.6 0 0 0-25.6 25.6v597.333334a25.6 25.6 0 0 0 25.6 25.6h597.333333a25.6 25.6 0 0 0 25.6-25.6V577.92a38.4 38.4 0 0 1 76.8 0V810.666667a102.4 102.4 0 0 1-102.4 102.4h-597.333333a102.4 102.4 0 0 1-102.4-102.4z" p-id="16568"></path><path d="M647.850667 434.773333a38.4 38.4 0 1 1-54.293334-54.314666L819.84 154.176a38.4 38.4 0 1 1 54.293333 54.314667L647.850667 434.752z" p-id="16569"></path><path d="M652.714667 189.994667a38.4 38.4 0 1 1 0-76.8h224a38.4 38.4 0 1 1 0 76.8h-224z" p-id="16570"></path><path d="M915.093333 375.594667a38.4 38.4 0 1 1-76.8 0v-224a38.4 38.4 0 1 1 76.8 0v224z" p-id="16571"></path></svg>
    )
  }
)

if (__DEV__) {
  ExportOutlined.displayName = 'ExportOutlined'
}
  