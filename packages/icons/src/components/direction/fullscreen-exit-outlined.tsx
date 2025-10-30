
import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { IconProps } from '../../@types/props'

const _prefix = getPrefixCls('icon-fullscreen-exit-outlined')

export const FullscreenExitOutlined = forwardRef<SVGSVGElement | null, IconProps>(
  ({ prefixCls = _prefix, className, children, size, style: styleProp, ...rest }, ref) => {
    const cls = cx(prefixCls, className)
    const style = { fontSize: size, ...styleProp }

    return (
      <svg className={cls} ref={ref} role="icon" style={style} {...rest}   viewBox="0 0 1045 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="11049"  ><path d="M428.394667 561.493333a38.4 38.4 0 0 1 38.4 38.4v153.877334a38.4 38.4 0 1 1-76.8 0v-61.162667l-209.194667 209.216a38.4 38.4 0 0 1-54.293333-54.314667l209.194666-209.194666H274.56a38.4 38.4 0 1 1 0-76.8h153.856zM878.976 682.410667a38.4 38.4 0 0 1 38.4 38.4V874.666667a38.4 38.4 0 0 1-38.4 38.4H725.12a38.4 38.4 0 1 1 0-76.8h115.456v-115.456a38.4 38.4 0 0 1 38.4-38.4zM851.84 122.176a38.4 38.4 0 0 1 54.293333 54.314667l-209.194666 209.194666h61.141333a38.4 38.4 0 0 1 0 76.8h-153.856a38.4 38.4 0 0 1-38.4-38.4v-153.856a38.4 38.4 0 0 1 76.8 0v61.162667l209.216-209.216zM307.498667 110.933333a38.4 38.4 0 0 1 0 76.8H192.042667v115.434667a38.4 38.4 0 1 1-76.8 0V149.333333a38.4 38.4 0 0 1 38.4-38.4h153.856z"  p-id="11050"></path></svg>
    )
  }
)

if (__DEV__) {
  FullscreenExitOutlined.displayName = 'FullscreenExitOutlined'
}
  