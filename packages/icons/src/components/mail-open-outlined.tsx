
import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { IconProps } from '../@types/props'

const _role = 'icon-mail-open-outlined'
const _prefix = getPrefixCls(_role)

export const MailOpenOutlined = forwardRef<SVGSVGElement | null, IconProps>(
  ({ prefixCls = _prefix, role = _role, className, children, style, onClick }, ref) => {
    const cls = cx(prefixCls, className)

    return (
      <svg className={cls} ref={ref} role={role} style={style} onClick={onClick}  xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" version="1.1"><path d="M516.484 83.352l439.968 274.644A8 8 0 0 1 960 364.64v567.73a8 8 0 0 1-8 8H72a8 8 0 0 1-8-8V364.644a8 8 0 0 1 3.548-6.648L507.58 83.352a8 8 0 0 1 8.904 0zM144 469.042v391.33h736V469.266L517.766 714.134a8 8 0 0 1-8.942 0.014L144 469.04zM512.028 176.652l-344.254 211.8 345.37 225.496 343.192-225.434L512.028 176.652z" p-id="12925"></path></svg>
    )
  }
)

if (__DEV__) {
  MailOpenOutlined.displayName = 'MailOpenOutlined'
}
  