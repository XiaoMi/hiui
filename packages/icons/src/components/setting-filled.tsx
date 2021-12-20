
import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { IconProps } from '../@types/props'

const _role = 'icon-setting-filled'
const _prefix = getPrefixCls(_role)

export const SettingFilled = forwardRef<SVGSVGElement | null, IconProps>(
  ({ prefixCls = _prefix, role = _role, className, children, style, onClick }, ref) => {
    const cls = cx(prefixCls, className)

    return (
      <svg className={cls} ref={ref} role={role} style={style} onClick={onClick}  xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" version="1.1"><path d="M512 358c-85.052 0-154 68.948-154 154s68.948 154 154 154 154-68.948 154-154-68.948-154-154-154z m119.712-304a8 8 0 0 1 8 8l0.006 109.036a363.6 363.6 0 0 1 103.166 59.544L837.424 176a8 8 0 0 1 10.928 2.928l120 207.846a8 8 0 0 1-2.928 10.928l-94.32 54.46A366.52 366.52 0 0 1 876 512c0 20.286-1.66 40.184-4.85 59.566L965.424 626a8 8 0 0 1 3.132 10.554l-0.204 0.374-120 207.846a8 8 0 0 1-10.554 3.132l-0.374-0.204-94.33-54.456a363.606 363.606 0 0 1-103.376 59.718L639.712 962a8 8 0 0 1-8 8h-240a8 8 0 0 1-8-8l-0.008-109.254a363.624 363.624 0 0 1-103.034-59.694L186 847.7a8 8 0 0 1-10.928-2.928l-120-207.846A8 8 0 0 1 58 626l94.8-54.734A366.56 366.56 0 0 1 148 512c0-20.276 1.658-40.164 4.844-59.536l-94.842-54.76a8 8 0 0 1-3.132-10.556l0.204-0.374 120-207.846a8 8 0 0 1 10.554-3.13L186 176l94.88 54.774a363.62 363.62 0 0 1 102.822-59.52L383.712 62a8 8 0 0 1 8-8h240z" p-id="11995"></path></svg>
    )
  }
)

if (__DEV__) {
  SettingFilled.displayName = 'SettingFilled'
}
  