
import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { IconProps } from '../@types/props'

const _role = 'icon-mail-send-outlined'
const _prefix = getPrefixCls(_role)

export const MailSendOutlined = forwardRef<SVGSVGElement | null, IconProps>(
  ({ prefixCls = _prefix, role = _role, className, children, style, onClick }, ref) => {
    const cls = cx(prefixCls, className)

    return (
      <svg className={cls} ref={ref} role={role} style={style} onClick={onClick}  xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" version="1.1"><path d="M804 84a8 8 0 0 1 8 8v170.886l144.452 96.738a8 8 0 0 1 3.548 6.646V934a8 8 0 0 1-8 8H72a8 8 0 0 1-8-8V366.272a8 8 0 0 1 3.548-6.648L212 262.9V92a8 8 0 0 1 8-8h584zM144 473.352V862h736V473.596L517.972 715.402a8 8 0 0 1-9.356 0.014L144 473.352zM732 164H292v315.424l221.144 136.152L732 480.098V164z m-152 216a8 8 0 0 1 8 8v64a8 8 0 0 1-8 8H356a8 8 0 0 1-8-8v-64a8 8 0 0 1 8-8h224z m232-20.834v64.1l46.446-32.996L812 359.166z m-600 0.008l-46.348 31.034L212 422.934v-63.76zM668 236a8 8 0 0 1 8 8v64a8 8 0 0 1-8 8H356a8 8 0 0 1-8-8v-64a8 8 0 0 1 8-8h312z" p-id="12955"></path></svg>
    )
  }
)

if (__DEV__) {
  MailSendOutlined.displayName = 'MailSendOutlined'
}
  