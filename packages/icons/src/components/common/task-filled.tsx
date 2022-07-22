
import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { IconProps } from '../../@types/props'

const _prefix = getPrefixCls('icon-task-filled')

export const TaskFilled = forwardRef<SVGSVGElement | null, IconProps>(
  ({ prefixCls = _prefix, className, children, size, style: styleProp, ...rest }, ref) => {
    const cls = cx(prefixCls, className)
    const style = { fontSize: size, ...styleProp }

    return (
      <svg className={cls} ref={ref} role="icon" style={style} {...rest}  xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" version="1.1"><path d="M874.666667 490.666667a42.666667 42.666667 0 0 1 42.666666 42.666666v256a128 128 0 0 1-128 128H234.666667a128 128 0 0 1-128-128V533.333333a42.666667 42.666667 0 0 1 42.666666-42.666666h725.333334z m-193.834667 87.168a42.666667 42.666667 0 0 0-60.330667 0l-125.418666 125.397333a21.333333 21.333333 0 0 1-30.165334 0l-40.085333-40.064a42.666667 42.666667 0 0 0-60.330667 60.330667l70.250667 70.250666a64 64 0 0 0 90.496 0l155.584-155.584a42.666667 42.666667 0 0 0 0-60.330666zM661.333333 64a42.666667 42.666667 0 0 1 42.666667 42.666667v42.666666h85.333333a128 128 0 0 1 128 128v85.333334a42.666667 42.666667 0 0 1-42.666666 42.666666H149.333333a42.666667 42.666667 0 0 1-42.666666-42.666666v-85.333334a128 128 0 0 1 128-128h85.333333V106.666667a42.666667 42.666667 0 1 1 85.333333 0v42.666666h213.333334V106.666667a42.666667 42.666667 0 0 1 42.666666-42.666667z" p-id="15471"></path></svg>
    )
  }
)

if (__DEV__) {
  TaskFilled.displayName = 'TaskFilled'
}
  