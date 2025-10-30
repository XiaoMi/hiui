
import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { IconProps } from '../../@types/props'

const _prefix = getPrefixCls('icon-play-outlined')

export const PlayOutlined = forwardRef<SVGSVGElement | null, IconProps>(
  ({ prefixCls = _prefix, className, children, size, style: styleProp, ...rest }, ref) => {
    const cls = cx(prefixCls, className)
    const style = { fontSize: size, ...styleProp }

    return (
      <svg className={cls} ref={ref} role="icon" style={style} {...rest}   viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="23618"  ><path d="M658.666667 474.752c29.141333 16.277333 29.141333 58.218667 0 74.496l-200.533334 112.042667c-27.52 15.402667-61.269333-3.413333-63.36-34.218667l-0.106666-3.029333V399.957333c0-32.576 35.029333-53.12 63.488-37.248l200.512 112.042667z m-187.2-16.64v107.754667L567.893333 512l-96.426666-53.866667z" p-id="23619"></path><path d="M868.266667 512c0-196.757333-159.509333-356.266667-356.266667-356.266667-196.757333 0-356.266667 159.509333-356.266667 356.266667 0 196.757333 159.509333 356.266667 356.266667 356.266667 196.757333 0 356.266667-159.509333 356.266667-356.266667z m76.8 0c0 239.168-193.898667 433.066667-433.066667 433.066667S78.933333 751.146667 78.933333 512 272.853333 78.933333 512 78.933333 945.066667 272.853333 945.066667 512z" p-id="23620"></path></svg>
    )
  }
)

if (__DEV__) {
  PlayOutlined.displayName = 'PlayOutlined'
}
  