
import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { IconProps } from '../@types/props'

const _role = 'icon-warning-filled'
const _prefix = getPrefixCls(_role)

export const WarningFilled = forwardRef<SVGSVGElement | null, IconProps>(
  ({ prefixCls = _prefix, role = _role, className, children, style, onClick }, ref) => {
    const cls = cx(prefixCls, className)

    return (
      <svg className={cls} ref={ref} role={role} style={style} onClick={onClick}  xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" version="1.1"><path d="M504.574 66.114a16 16 0 0 1 21.6 6.746L965.84 900.574A16 16 0 0 1 951.67 924H72.33a16 16 0 0 1-14.172-23.426L497.828 72.86a16 16 0 0 1 6.746-6.746zM512 732c-26.51 0-48 21.49-48 48s21.49 48 48 48 48-21.49 48-48-21.49-48-48-48z m40-360h-80v312h80V372z" p-id="11655"></path></svg>
    )
  }
)

if (__DEV__) {
  WarningFilled.displayName = 'WarningFilled'
}
  