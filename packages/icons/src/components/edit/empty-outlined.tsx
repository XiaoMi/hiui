
import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { IconProps } from '../../@types/props'

const _prefix = getPrefixCls('icon-empty-outlined')

export const EmptyOutlined = forwardRef<SVGSVGElement | null, IconProps>(
  ({ prefixCls = _prefix, className, children, size, style: styleProp, ...rest }, ref) => {
    const cls = cx(prefixCls, className)
    const style = { fontSize: size, ...styleProp }

    return (
      <svg className={cls} ref={ref} role="icon" style={style} {...rest}   viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="26935"  ><path d="M857.6 561.066667h-165.653333a17.642667 17.642667 0 0 0-15.445334 9.109333c-71.36 129.621333-257.642667 129.621333-329.002666 0a17.642667 17.642667 0 0 0-15.445334-9.109333H166.4v238.933333A25.6 25.6 0 0 0 192 825.6h640a25.6 25.6 0 0 0 25.6-25.6V561.066667z m-569.557333-362.666667a25.6 25.6 0 0 0-24.448 18.005333L180.181333 484.266667h151.893334c34.410667 0 66.133333 18.730667 82.709333 48.874666 42.176 76.586667 152.234667 76.586667 194.432 0a94.442667 94.442667 0 0 1 82.730667-48.853333h151.872l-83.413334-267.882667a25.6 25.6 0 0 0-24.448-18.005333H288.042667zM934.4 800a102.4 102.4 0 0 1-102.4 102.4H192a102.4 102.4 0 0 1-102.4-102.4V516.842667l1.728-5.589334L190.293333 193.557333A102.4 102.4 0 0 1 288.042667 121.6h447.914666a102.4 102.4 0 0 1 97.770667 71.957333l98.944 317.696 1.706667 5.589334V800z" p-id="26936"></path></svg>
    )
  }
)

if (__DEV__) {
  EmptyOutlined.displayName = 'EmptyOutlined'
}
  