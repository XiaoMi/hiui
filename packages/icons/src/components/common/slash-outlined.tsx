
import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { IconProps } from '../../@types/props'

const _prefix = getPrefixCls('icon-slash-outlined')

export const SlashOutlined = forwardRef<SVGSVGElement | null, IconProps>(
  ({ prefixCls = _prefix, className, children, size, style: styleProp, ...rest }, ref) => {
    const cls = cx(prefixCls, className)
    const style = { fontSize: size, ...styleProp }

    return (
      <svg className={cls} ref={ref} role="icon" style={style} {...rest}   viewBox="0 0 1045 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="6211"  ><path d="M291.072 825.237333l384-665.109333a38.4 38.4 0 1 1 66.496 38.4l-384 665.088a38.4 38.4 0 1 1-66.496-38.4z" p-id="6212"></path></svg>
    )
  }
)

if (__DEV__) {
  SlashOutlined.displayName = 'SlashOutlined'
}
  