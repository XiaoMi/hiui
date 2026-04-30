
import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { IconProps } from '../../@types/props'

const _prefix = getPrefixCls('icon-rmb-outlined')

export const RmbOutlined = forwardRef<SVGSVGElement | null, IconProps>(
  ({ prefixCls = _prefix, className, children, size, style: styleProp, ...rest }, ref) => {
    const cls = cx(prefixCls, className)
    const style = { fontSize: size, ...styleProp }

    return (
      <svg className={cls} ref={ref} role="icon" style={style} {...rest}   viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="24495"  ><path d="M878.933333 512c0-202.666667-164.266667-366.933333-366.933333-366.933333S145.066667 309.333333 145.066667 512 309.333333 878.933333 512 878.933333 878.933333 714.666667 878.933333 512z m76.8 0c0 245.056-198.677333 443.733333-443.733333 443.733333-245.077333 0-443.733333-198.677333-443.733333-443.733333C68.266667 266.922667 266.944 68.266667 512 68.266667S955.733333 266.944 955.733333 512z" p-id="24496"></path><path d="M550.4 669.333333a38.4 38.4 0 1 1-76.8 0v-177.770666a38.4 38.4 0 1 1 76.8 0v177.770666z" p-id="24497"></path><path d="M405.333333 512.170667a38.4 38.4 0 1 1 0-76.8h213.333334a38.4 38.4 0 1 1 0 76.8H405.333333zM405.333333 618.837333a38.4 38.4 0 1 1 0-76.8h213.333334a38.4 38.4 0 1 1 0 76.8H405.333333z" p-id="24498"></path><path d="M578.176 335.509333a38.4 38.4 0 1 1 54.314667 54.314667L512 510.293333l-120.490667-120.490666a38.4 38.4 0 1 1 54.314667-54.314667L512 401.706667l66.176-66.176z" p-id="24499"></path></svg>
    )
  }
)

if (__DEV__) {
  RmbOutlined.displayName = 'RmbOutlined'
}
  