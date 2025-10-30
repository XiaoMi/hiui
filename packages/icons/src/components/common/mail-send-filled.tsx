
import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { IconProps } from '../../@types/props'

const _prefix = getPrefixCls('icon-mail-send-filled')

export const MailSendFilled = forwardRef<SVGSVGElement | null, IconProps>(
  ({ prefixCls = _prefix, className, children, size, style: styleProp, ...rest }, ref) => {
    const cls = cx(prefixCls, className)
    const style = { fontSize: size, ...styleProp }

    return (
      <svg className={cls} ref={ref} role="icon" style={style} {...rest}   viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="25834"  ><path d="M608 292.266667a38.4 38.4 0 1 1 0 76.8h-192a38.4 38.4 0 1 1 0-76.8h192z"  p-id="25835"></path><path d="M725.333333 132.266667a102.4 102.4 0 0 1 102.4 102.4v103.381333l15.786667-9.642667 3.776-2.133333c39.168-20.373333 87.104 7.914667 87.104 53.12V789.333333a102.4 102.4 0 0 1-102.4 102.4H192A102.4 102.4 0 0 1 89.6 789.333333V379.370667c0-46.634667 51.072-75.306667 90.88-50.986667l15.786667 9.664V234.666667A102.4 102.4 0 0 1 298.666667 132.266667h426.666666zM298.666667 209.066667a25.6 25.6 0 0 0-25.6 25.6v150.293333l225.578666 137.877333a25.6 25.6 0 0 0 26.709334 0L750.933333 384.96V234.666667A25.6 25.6 0 0 0 725.333333 209.066667H298.666667z"  p-id="25836"></path></svg>
    )
  }
)

if (__DEV__) {
  MailSendFilled.displayName = 'MailSendFilled'
}
  