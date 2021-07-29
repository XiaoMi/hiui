
import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { IconProps } from '../@types/props'

const _role = 'icon-fullscreen-outlined'
const _prefix = getPrefixCls(_role)

export const FullscreenOutlined = forwardRef<SVGSVGElement | null, IconProps>(
  ({ prefixCls = _prefix, role = _role, className, children, style, onClick }, ref) => {
    const cls = cx(prefixCls, className)

    return (
      <svg className={cls} ref={ref} role={role} style={style} onClick={onClick}  xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" version="1.1"><path d="M618.804 450.45l-45.254-45.254a8 8 0 0 1 0-11.314l186.166-186.166-56.888-56.888a4 4 0 0 1-1.156-2.476l-0.016-0.352a4 4 0 0 1 3.702-3.99l0.3-0.01H876a4 4 0 0 1 3.99 3.7L880 148v170.344a4 4 0 0 1-6.574 3.06l-0.254-0.232-56.888-56.888-186.166 186.166a8 8 0 0 1-11.314 0zM405.196 573.55l45.254 45.254a8 8 0 0 1 0 11.314l-186.166 186.166 56.888 56.888a4 4 0 0 1 1.156 2.476l0.016 0.352a4 4 0 0 1-3.702 3.99l-0.3 0.01H148a4 4 0 0 1-3.99-3.7L144 876v-170.344a4 4 0 0 1 6.574-3.06l0.254 0.232 56.888 56.888 186.166-186.166a8 8 0 0 1 11.314 0zM405.196 450.45l45.254-45.254a8 8 0 0 0 0-11.314l-186.166-186.166 56.888-56.888a4 4 0 0 0 1.156-2.476l0.016-0.352a4 4 0 0 0-3.702-3.99l-0.3-0.01H148a4 4 0 0 0-3.99 3.7L144 148v170.344a4 4 0 0 0 6.574 3.06l0.254-0.232 56.888-56.888 186.166 186.166a8 8 0 0 0 11.314 0zM618.804 573.55l-45.254 45.254a8 8 0 0 0 0 11.314l186.166 186.166-56.888 56.888a4 4 0 0 0-1.156 2.476l-0.016 0.352a4 4 0 0 0 3.702 3.99l0.3 0.01H876a4 4 0 0 0 3.99-3.7L880 876v-170.344a4 4 0 0 0-6.574-3.06l-0.254 0.232-56.888 56.888-186.166-186.166a8 8 0 0 0-11.314 0z" p-id="13715"></path></svg>
    )
  }
)

if (__DEV__) {
  FullscreenOutlined.displayName = 'FullscreenOutlined'
}
  