
import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { IconProps } from '../../@types/props'

const _prefix = getPrefixCls('icon-reset-outlined')

export const ResetOutlined = forwardRef<SVGSVGElement | null, IconProps>(
  ({ prefixCls = _prefix, className, children, size, style: styleProp, ...rest }, ref) => {
    const cls = cx(prefixCls, className)
    const style = { fontSize: size, ...styleProp }

    return (
      <svg className={cls} ref={ref} role="icon" style={style} {...rest}   viewBox="0 0 1045 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="24348"  ><path d="M213.376 160a38.4 38.4 0 0 0-76.8 0v149.333333a38.4 38.4 0 1 0 76.8 0v-149.333333z" p-id="24349"></path><path d="M324.309333 347.733333a38.4 38.4 0 1 0 0-76.8h-149.333333a38.4 38.4 0 1 0 0 76.8h149.333333z" p-id="24350"></path><path d="M938.709333 512c0-233.28-189.12-422.4-422.4-422.4-143.744 0-270.72 71.850667-346.965333 181.418667a38.4 38.4 0 0 0 63.061333 43.882666C294.890667 225.066667 398.762667 166.4 516.309333 166.4c190.869333 0 345.6 154.730667 345.6 345.6s-154.730667 345.6-345.6 345.6-345.6-154.730667-345.6-345.6a38.4 38.4 0 1 0-76.8 0c0 233.28 189.12 422.4 422.4 422.4s422.4-189.12 422.4-422.4z" p-id="24351"></path></svg>
    )
  }
)

if (__DEV__) {
  ResetOutlined.displayName = 'ResetOutlined'
}
  