
import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { IconProps } from '../../@types/props'

const _prefix = getPrefixCls('icon-alarm-clock-filled')

export const AlarmClockFilled = forwardRef<SVGSVGElement | null, IconProps>(
  ({ prefixCls = _prefix, className, children, size, style: styleProp, ...rest }, ref) => {
    const cls = cx(prefixCls, className)
    const style = { fontSize: size, ...styleProp }

    return (
      <svg className={cls} ref={ref} role="icon" style={style} {...rest}  xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" version="1.1"><path d="M512 149.333333c212.074667 0 384 171.925333 384 384s-171.925333 384-384 384S128 745.408 128 533.333333 299.925333 149.333333 512 149.333333z m0 130.304a42.666667 42.666667 0 0 0-42.666667 42.666667V533.333333l0.106667 3.2A42.666667 42.666667 0 0 0 512 576h169.557333l3.2-0.106667A42.666667 42.666667 0 0 0 724.202667 533.333333l-0.106667-3.2A42.666667 42.666667 0 0 0 681.557333 490.666667h-126.912L554.666667 322.304l-0.106667-3.178667A42.666667 42.666667 0 0 0 512 279.68zM262.314667 97.834667a42.666667 42.666667 0 0 1 2.496 57.621333l-2.496 2.709333-104.149334 104.149334A42.666667 42.666667 0 0 1 95.36 204.693333l2.496-2.730666 104.128-104.128a42.666667 42.666667 0 0 1 60.352 0z m496.853333 0a42.666667 42.666667 0 0 1 60.330667 0l104.149333 104.128 2.496 2.730666a42.666667 42.666667 0 0 1-62.848 57.6l-104.128-104.106666-2.496-2.730667a42.666667 42.666667 0 0 1 2.496-57.621333z" p-id="14871"></path></svg>
    )
  }
)

if (__DEV__) {
  AlarmClockFilled.displayName = 'AlarmClockFilled'
}
  