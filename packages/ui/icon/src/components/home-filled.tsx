
import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { IconProps } from '../@types/props'

const _role = 'icon-home-filled'
const _prefix = getPrefixCls(_role)

export const HomeFilled = forwardRef<SVGSVGElement | null, IconProps>(
  ({ prefixCls = _prefix, role = _role, className, children, style, onClick }, ref) => {
    const cls = cx(prefixCls, className)

    return (
      <svg className={cls} ref={ref} role={role} style={style} onClick={onClick}  xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" version="1.1"><path d="M518.334 81.684l391.798 272.87a12 12 0 0 1 5.868 10.316V934.04a12 12 0 0 1-12 12H642v-292c0-4.418-3.61-8-8.062-8H390.062c-4.452 0-8.062 3.582-8.062 8v292H120a12 12 0 0 1-12-12V364.874a12 12 0 0 1 5.874-10.32L506.076 81.682a12 12 0 0 1 12.258 0.002z" p-id="11865"></path></svg>
    )
  }
)

if (__DEV__) {
  HomeFilled.displayName = 'HomeFilled'
}
  