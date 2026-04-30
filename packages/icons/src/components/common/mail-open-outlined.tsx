
import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { IconProps } from '../../@types/props'

const _prefix = getPrefixCls('icon-mail-open-outlined')

export const MailOpenOutlined = forwardRef<SVGSVGElement | null, IconProps>(
  ({ prefixCls = _prefix, className, children, size, style: styleProp, ...rest }, ref) => {
    const cls = cx(prefixCls, className)
    const style = { fontSize: size, ...styleProp }

    return (
      <svg className={cls} ref={ref} role="icon" style={style} {...rest}   viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="21346"  ><path d="M89.6 367.637333l369.002667-225.493333a102.4 102.4 0 0 1 106.794666 0L934.4 367.616v426.88a102.4 102.4 0 0 1-102.4 102.4H192a102.4 102.4 0 0 1-102.4-102.4v-426.88z m409.045333 203.029334c8.192 5.013333 18.517333 5.013333 26.709334 0l297.002666-181.504-297.002666-181.504a25.621333 25.621333 0 0 0-26.709334 0L201.642667 389.162667l297.002666 181.504zM832 820.117333a25.6 25.6 0 0 0 25.6-25.6v-336.853333l-292.202667 178.56a102.4 102.4 0 0 1-106.794666 0L166.4 457.642667v336.853333a25.6 25.6 0 0 0 25.6 25.6h640z" p-id="21347"></path></svg>
    )
  }
)

if (__DEV__) {
  MailOpenOutlined.displayName = 'MailOpenOutlined'
}
  