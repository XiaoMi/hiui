
import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { IconProps } from '../../@types/props'

const _prefix = getPrefixCls('icon-eye-invisible-outlined')

export const EyeInvisibleOutlined = forwardRef<SVGSVGElement | null, IconProps>(
  ({ prefixCls = _prefix, className, children, size, style: styleProp, ...rest }, ref) => {
    const cls = cx(prefixCls, className)
    const style = { fontSize: size, ...styleProp }

    return (
      <svg className={cls} ref={ref} role="icon" style={style} {...rest}   viewBox="0 0 1045 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="16861"  ><path d="M870.186667 328.853333a38.4 38.4 0 0 1 60.245333 47.616l-18.666667 23.616-0.704 0.853334-0.725333 0.853333-40 44.949333c-2.922667 3.285333-5.909333 6.464-8.917333 9.621334l62.634666 80.213333a38.4 38.4 0 1 1-60.501333 47.253333l-60.096-76.864a411.882667 411.882667 0 0 1-137.856 64.682667l24.042667 89.749333a38.4 38.4 0 1 1-74.154667 19.861334l-24.917333-92.992c-49.130667 8.746667-99.392 8.746667-148.501334 0l-24.896 93.013333a38.4 38.4 0 0 1-74.197333-19.882667l24.021333-89.749333a411.946667 411.946667 0 0 1-130.986666-59.818667l-56.234667 72a38.4 38.4 0 0 1-60.522667-47.274666l57.877334-74.090667c-5.056-5.12-10.026667-10.325333-14.848-15.722667l-40-44.928-0.725334-0.853333-0.704-0.874667-18.666666-23.616a38.4 38.4 0 0 1 60.245333-47.616l18.005333 22.762667 39.232 44.074667a335.146667 335.146667 0 0 0 177.130667 104.213333l43.84 9.813333c49.834667 11.136 101.525333 11.136 151.338667 0l43.861333-9.813333a335.146667 335.146667 0 0 0 177.130667-104.213333l39.189333-44.074667 18.026667-22.762667z"  p-id="16862"></path></svg>
    )
  }
)

if (__DEV__) {
  EyeInvisibleOutlined.displayName = 'EyeInvisibleOutlined'
}
  