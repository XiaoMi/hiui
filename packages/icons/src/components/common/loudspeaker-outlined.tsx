
import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { IconProps } from '../../@types/props'

const _prefix = getPrefixCls('icon-loudspeaker-outlined')

export const LoudspeakerOutlined = forwardRef<SVGSVGElement | null, IconProps>(
  ({ prefixCls = _prefix, className, children, size, style: styleProp, ...rest }, ref) => {
    const cls = cx(prefixCls, className)
    const style = { fontSize: size, ...styleProp }

    return (
      <svg className={cls} ref={ref} role="icon" style={style} {...rest}   viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="16550"  ><path d="M733.866667 857.6a38.4 38.4 0 0 0 38.4-38.4V204.8a38.4 38.4 0 0 0-38.4-38.4H290.133333a38.4 38.4 0 0 0-38.4 38.4v614.4a38.4 38.4 0 0 0 38.4 38.4h443.733334z m-443.733334 76.8a115.2 115.2 0 0 1-115.2-115.2V204.8a115.2 115.2 0 0 1 115.2-115.2h443.733334a115.2 115.2 0 0 1 115.2 115.2v614.4a115.2 115.2 0 0 1-115.2 115.2H290.133333z" p-id="16551"></path><path d="M512 388.266667a46.933333 46.933333 0 1 0 0-93.866667 46.933333 46.933333 0 0 0 0 93.866667z m0 76.8a123.733333 123.733333 0 1 1 0-247.466667 123.733333 123.733333 0 0 1 0 247.466667zM512 729.6a78.933333 78.933333 0 1 0 0-157.866667 78.933333 78.933333 0 0 0 0 157.866667z m0 76.8a155.733333 155.733333 0 1 1 0-311.466667 155.733333 155.733333 0 0 1 0 311.466667z" p-id="16552"></path></svg>
    )
  }
)

if (__DEV__) {
  LoudspeakerOutlined.displayName = 'LoudspeakerOutlined'
}
  