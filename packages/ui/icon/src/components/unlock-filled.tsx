
import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { IconProps } from '../@types/props'

const _role = 'icon-unlock-filled'
const _prefix = getPrefixCls(_role)

export const UnlockFilled = forwardRef<SVGSVGElement | null, IconProps>(
  ({ prefixCls = _prefix, role = _role, className, children, style, onClick }, ref) => {
    const cls = cx(prefixCls, className)

    return (
      <svg className={cls} ref={ref} role={role} style={style} onClick={onClick}  xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" version="1.1"><path d="M512 60c102.93 0 190.726 64.796 224.822 155.822l-88.728 0.002C619.884 170.312 569.48 140 512 140c-88.366 0-160 71.634-160 160v40h532a8 8 0 0 1 8 8v608a8 8 0 0 1-8 8H140a8 8 0 0 1-8-8V348a8 8 0 0 1 8-8h132v-40c0-132.548 107.452-240 240-240z m32 504a8 8 0 0 1 8 8v160a8 8 0 0 1-8 8h-64a8 8 0 0 1-8-8v-160a8 8 0 0 1 8-8h64z" p-id="12145"></path></svg>
    )
  }
)

if (__DEV__) {
  UnlockFilled.displayName = 'UnlockFilled'
}
  