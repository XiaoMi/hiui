
import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { IconProps } from '../@types/props'

const _role = 'icon-scissor-outlined'
const _prefix = getPrefixCls(_role)

export const ScissorOutlined = forwardRef<SVGSVGElement | null, IconProps>(
  ({ prefixCls = _prefix, role = _role, className, children, style, onClick }, ref) => {
    const cls = cx(prefixCls, className)

    return (
      <svg className={cls} ref={ref} role={role} style={style} onClick={onClick}  xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" version="1.1"><path d="M630.46 663.332c-17.484 27.748-27.6 60.608-27.6 95.83 0 99.41 80.588 180 180 180 99.41 0 180-80.59 180-180 0-99.412-80.59-180-180-180-35.222 0-68.08 10.116-95.828 27.6l-117.754-117.754L863.108 195.18c3.184-3.186 3.404-8.168 0.566-11.316l-0.276-0.29-45.254-45.254c-3.124-3.124-8.32-2.994-11.606 0.29L512.708 432.44 218.588 138.32a8 8 0 0 0-11.314 0L162.02 183.576a8 8 0 0 0 0 11.314l294.12 294.118-117.754 117.754c-27.294-17.198-59.53-27.266-94.098-27.592l-1.73-0.008c-99.41 0-180 80.588-180 180 0 99.41 80.59 180 180 180 99.412 0 180-80.59 180-180 0-35.222-10.116-68.08-27.6-95.83l117.75-117.754 117.752 117.754z m152.4-4.17c55.228 0 100 44.77 100 100 0 55.228-44.772 100-100 100-55.23 0-100-44.772-100-100 0-55.23 44.77-100 100-100z m-640.3 100c0-55.23 44.77-100 100-100 55.226 0 100 44.77 100 100 0 55.228-44.774 100-100 100-55.23 0-100-44.772-100-100z" p-id="13585"></path></svg>
    )
  }
)

if (__DEV__) {
  ScissorOutlined.displayName = 'ScissorOutlined'
}
  