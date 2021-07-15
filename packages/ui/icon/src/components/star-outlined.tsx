
import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { IconProps } from '../@types/props'

const _role = 'icon-star-outlined'
const _prefix = getPrefixCls(_role)

export const StarOutlined = forwardRef<SVGSVGElement | null, IconProps>(
  ({ prefixCls = _prefix, role = _role, className, children, style, onClick }, ref) => {
    const cls = cx(prefixCls, className)

    return (
      <svg className={cls} ref={ref} role={role} style={style} onClick={onClick}  xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" version="1.1"><path d="M519.08 79.806a16 16 0 0 1 7.268 7.266l132.6 268.674 296.498 43.084a16 16 0 0 1 8.868 27.29L749.764 635.254l50.648 295.3a16 16 0 0 1-23.214 16.868L512 808l-265.198 139.422a16 16 0 0 1-23.214-16.866l50.648-295.3L59.686 426.12a16 16 0 0 1 8.868-27.29l296.5-43.084 132.6-268.674a16 16 0 0 1 21.428-7.266z m86.74 349.06L512 238.764l-93.82 190.102-209.792 30.484 151.806 147.974-35.836 208.942L512 717.618l187.64 98.648-35.834-208.94 151.804-147.976-209.788-30.484z" p-id="12325"></path></svg>
    )
  }
)

if (__DEV__) {
  StarOutlined.displayName = 'StarOutlined'
}
  