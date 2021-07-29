
import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { IconProps } from '../@types/props'

const _role = 'icon-play-outlined'
const _prefix = getPrefixCls(_role)

export const PlayOutlined = forwardRef<SVGSVGElement | null, IconProps>(
  ({ prefixCls = _prefix, role = _role, className, children, style, onClick }, ref) => {
    const cls = cx(prefixCls, className)

    return (
      <svg className={cls} ref={ref} role={role} style={style} onClick={onClick}  xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" version="1.1"><path d="M871.136 521.14a16 16 0 0 1-3.98 3.976L251.14 954.462a16 16 0 0 1-25.148-13.126V82.644a16 16 0 0 1 25.148-13.126l616.018 429.346a16 16 0 0 1 3.978 22.274z m-125.054-9.15L305.992 205.258v613.46L746.08 511.992z" p-id="13065"></path></svg>
    )
  }
)

if (__DEV__) {
  PlayOutlined.displayName = 'PlayOutlined'
}
  