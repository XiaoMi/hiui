
import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { IconProps } from '../@types/props'

const _role = 'icon-eye-outlined'
const _prefix = getPrefixCls(_role)

export const EyeOutlined = forwardRef<SVGSVGElement | null, IconProps>(
  ({ prefixCls = _prefix, role = _role, className, children, style, onClick }, ref) => {
    const cls = cx(prefixCls, className)

    return (
      <svg className={cls} ref={ref} role={role} style={style} onClick={onClick}  xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" version="1.1"><path d="M512 150c230.574 0 425.55 152.416 489.674 361.992C937.554 721.584 742.574 874 512 874c-230.574 0-425.55-152.416-489.674-361.992C86.446 302.416 281.426 150 512 150z m0 80c-181.666 0-341.348 113.156-404.086 278.826l-1.18 3.18 1.18 3.18c62.08 163.918 219.072 276.426 398.356 278.776L512 794c181.666 0 341.348-113.156 404.086-278.826l1.178-3.182-1.18-3.178c-62.076-163.918-219.07-276.426-398.354-278.776L512 230z m0 62c121.502 0 220 98.498 220 220s-98.498 220-220 220-220-98.498-220-220 98.498-220 220-220z m0 80c-77.32 0-140 62.68-140 140s62.68 140 140 140 140-62.68 140-140-62.68-140-140-140z" p-id="12745"></path></svg>
    )
  }
)

if (__DEV__) {
  EyeOutlined.displayName = 'EyeOutlined'
}
  