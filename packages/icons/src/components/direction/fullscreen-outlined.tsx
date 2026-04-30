
import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { IconProps } from '../../@types/props'

const _prefix = getPrefixCls('icon-fullscreen-outlined')

export const FullscreenOutlined = forwardRef<SVGSVGElement | null, IconProps>(
  ({ prefixCls = _prefix, className, children, size, style: styleProp, ...rest }, ref) => {
    const cls = cx(prefixCls, className)
    const style = { fontSize: size, ...styleProp }

    return (
      <svg className={cls} ref={ref} role="icon" style={style} {...rest}   viewBox="0 0 1045 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="10904"  ><path d="M401.258667 572.757333a38.4 38.4 0 0 1 54.272 54.314667L246.357333 836.266667h61.162667a38.4 38.4 0 1 1 0 76.8H153.642667a38.4 38.4 0 0 1-38.4-38.4v-153.856a38.4 38.4 0 1 1 76.8 0v61.141333l209.216-209.194667zM878.976 682.410667a38.4 38.4 0 0 1 38.4 38.4V874.666667a38.4 38.4 0 0 1-38.4 38.4H725.12a38.4 38.4 0 1 1 0-76.8h115.456v-115.456a38.4 38.4 0 0 1 38.4-38.4zM878.976 110.933333a38.4 38.4 0 0 1 38.4 38.4v153.856a38.4 38.4 0 1 1-76.8 0v-61.141333l-209.194667 209.194667a38.4 38.4 0 0 1-54.293333-54.314667L786.282667 187.733333H725.12a38.4 38.4 0 1 1 0-76.8h153.856zM307.498667 110.933333a38.4 38.4 0 1 1 0 76.8H192.042667v115.456a38.4 38.4 0 1 1-76.8 0V149.333333a38.4 38.4 0 0 1 38.4-38.4h153.856z"  p-id="10905"></path></svg>
    )
  }
)

if (__DEV__) {
  FullscreenOutlined.displayName = 'FullscreenOutlined'
}
  