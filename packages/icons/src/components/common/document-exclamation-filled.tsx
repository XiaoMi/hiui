
import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { IconProps } from '../../@types/props'

const _role = 'icon-document-exclamation-filled'
const _prefix = getPrefixCls(_role)

export const DocumentExclamationFilled = forwardRef<SVGSVGElement | null, IconProps>(
  ({ prefixCls = _prefix, role = _role, className, children, style, onClick }, ref) => {
    const cls = cx(prefixCls, className)

    return (
      <svg className={cls} ref={ref} role={role} style={style} onClick={onClick}  xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" version="1.1"><path d="M554.666667 109.589333v250.24c0 25.130667 20.373333 45.504 45.504 45.504h250.24c9.258667 0 17.472-2.56 24.277333-6.848L874.666667 810.666667a128 128 0 0 1-128 128H277.333333a128 128 0 0 1-128-128V213.333333a128 128 0 0 1 128-128h284.16c-4.266667 6.805333-6.826667 14.997333-6.826666 24.256zM512 618.666667a64 64 0 1 0 0 128 64 64 0 0 0 0-128z m0-234.666667a42.666667 42.666667 0 0 0-42.666667 42.666667v106.666666a42.666667 42.666667 0 1 0 85.333334 0v-106.666666a42.666667 42.666667 0 0 0-42.666667-42.666667z m128-268.501333a21.333333 21.333333 0 0 1 15.082667 6.250666l183.168 183.168A21.333333 21.333333 0 0 1 823.168 341.333333H661.333333a42.666667 42.666667 0 0 1-42.666666-42.666666V136.832a21.333333 21.333333 0 0 1 21.333333-21.333333z" p-id="14981"></path></svg>
    )
  }
)

if (__DEV__) {
  DocumentExclamationFilled.displayName = 'DocumentExclamationFilled'
}
  