
import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { IconProps } from '../@types/props'

const _role = 'icon-play-filled'
const _prefix = getPrefixCls(_role)

export const PlayFilled = forwardRef<SVGSVGElement | null, IconProps>(
  ({ prefixCls = _prefix, role = _role, className, children, style, onClick }, ref) => {
    const cls = cx(prefixCls, className)

    return (
      <svg className={cls} ref={ref} role={role} style={style} onClick={onClick}  xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" version="1.1"><path d="M871.136 521.14a16 16 0 0 1-3.98 3.976L251.14 954.462a16 16 0 0 1-25.148-13.126V82.644a16 16 0 0 1 25.148-13.126l616.018 429.346a16 16 0 0 1 3.978 22.274z" p-id="11955"></path></svg>
    )
  }
)

if (__DEV__) {
  PlayFilled.displayName = 'PlayFilled'
}
  