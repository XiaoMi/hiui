
import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { IconProps } from '../@types/props'

const _role = 'icon-star-filled'
const _prefix = getPrefixCls(_role)

export const StarFilled = forwardRef<SVGSVGElement | null, IconProps>(
  ({ prefixCls = _prefix, role = _role, className, children, style, onClick }, ref) => {
    const cls = cx(prefixCls, className)

    return (
      <svg className={cls} ref={ref} role={role} style={style} onClick={onClick}  xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" version="1.1"><path d="M512 808l-265.198 139.422a16 16 0 0 1-23.214-16.866l50.648-295.3L59.686 426.12a16 16 0 0 1 8.868-27.29l296.5-43.084 132.6-268.674a16 16 0 0 1 28.694 0l132.6 268.674 296.498 43.084a16 16 0 0 1 8.868 27.29L749.764 635.254l50.648 295.3a16 16 0 0 1-23.214 16.868L512 808z" p-id="12025"></path></svg>
    )
  }
)

if (__DEV__) {
  StarFilled.displayName = 'StarFilled'
}
  