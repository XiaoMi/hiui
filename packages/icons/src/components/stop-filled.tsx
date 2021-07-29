
import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { IconProps } from '../@types/props'

const _role = 'icon-stop-filled'
const _prefix = getPrefixCls(_role)

export const StopFilled = forwardRef<SVGSVGElement | null, IconProps>(
  ({ prefixCls = _prefix, role = _role, className, children, style, onClick }, ref) => {
    const cls = cx(prefixCls, className)

    return (
      <svg className={cls} ref={ref} role={role} style={style} onClick={onClick}  xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" version="1.1"><path d="M512 64c247.424 0 448 200.576 448 448 0 244.95-196.584 443.984-440.592 447.94L512 960C264.576 960 64 759.424 64 512S264.576 64 512 64zM225.48 281.046L742.954 798.52a370.22 370.22 0 0 0 56.46-56.676L282.154 224.588a370.22 370.22 0 0 0-56.676 56.458z" p-id="11635"></path></svg>
    )
  }
)

if (__DEV__) {
  StopFilled.displayName = 'StopFilled'
}
  