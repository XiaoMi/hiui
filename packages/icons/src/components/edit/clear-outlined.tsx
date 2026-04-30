
import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { IconProps } from '../../@types/props'

const _prefix = getPrefixCls('icon-clear-outlined')

export const ClearOutlined = forwardRef<SVGSVGElement | null, IconProps>(
  ({ prefixCls = _prefix, className, children, size, style: styleProp, ...rest }, ref) => {
    const cls = cx(prefixCls, className)
    const style = { fontSize: size, ...styleProp }

    return (
      <svg className={cls} ref={ref} role="icon" style={style} {...rest}   viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1899"  ><path d="M825.642667 494.272c0 2.346667-1.898667 4.224-4.224 4.224H202.858667a4.373333 4.373333 0 0 1-4.373334-4.373333v-68.437334a25.6 25.6 0 0 1 25.6-25.6h117.376a102.4 102.4 0 0 0 102.4-102.4V170.688a25.6 25.6 0 0 1 25.6-25.621333h85.312a25.6 25.6 0 0 1 25.6 25.6v127.018666a102.4 102.4 0 0 0 102.4 102.4h117.269334a25.6 25.6 0 0 1 25.6 25.6v68.586667zM783.018667 853.333333a25.6 25.6 0 0 1-25.6 25.6H659.413333v-141.184a38.4 38.4 0 0 0-76.8 0V878.933333h-135.573333v-141.184a38.421333 38.421333 0 0 0-76.8 0V878.933333h-103.381333a25.6 25.6 0 0 1-25.6-25.6V575.296h541.76V853.333333z m76.8-287.68a81.002667 81.002667 0 0 0 42.624-71.381333v-68.586667a102.4 102.4 0 0 0-102.4-102.4h-117.269334a25.6 25.6 0 0 1-25.6-25.6V170.666667a102.4 102.4 0 0 0-102.4-102.4h-85.333333a102.4 102.4 0 0 0-102.378667 102.421333v126.997333a25.6 25.6 0 0 1-25.6 25.6h-117.376a102.4 102.4 0 0 0-102.4 102.4v68.437334c0 30.933333 17.301333 57.856 42.773334 71.552V853.333333a102.4 102.4 0 0 0 102.4 102.4h490.56a102.4 102.4 0 0 0 102.4-102.4V565.653333z" p-id="1900"></path></svg>
    )
  }
)

if (__DEV__) {
  ClearOutlined.displayName = 'ClearOutlined'
}
  