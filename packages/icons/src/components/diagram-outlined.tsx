
import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { IconProps } from '../@types/props'

const _role = 'icon-diagram-outlined'
const _prefix = getPrefixCls(_role)

export const DiagramOutlined = forwardRef<SVGSVGElement | null, IconProps>(
  ({ prefixCls = _prefix, role = _role, className, children, style, onClick }, ref) => {
    const cls = cx(prefixCls, className)

    return (
      <svg className={cls} ref={ref} role={role} style={style} onClick={onClick}  xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" version="1.1"><path d="M352 756a8 8 0 0 1-8 8H80a8 8 0 0 1-8-8V492a8 8 0 0 1 8-8h264a8 8 0 0 1 8 8v91h100V330h-92a8 8 0 0 1-8-8V58a8 8 0 0 1 8-8h264a8 8 0 0 1 8 8v264a8 8 0 0 1-8 8h-90v143h138V382a8 8 0 0 1 8-8h264a8 8 0 0 1 8 8v264a8 8 0 0 1-8 8H680a8 8 0 0 1-8-8v-91h-138v238.998l138 0.002v-92a8 8 0 0 1 8-8h264a8 8 0 0 1 8 8v264a8 8 0 0 1-8 8H680a8 8 0 0 1-8-8v-90H460a8 8 0 0 1-8-8V665h-100V756z m520 18h-120v120h120v-120zM272 564H152v120h120v-120z m600-110h-120v120h120v-120zM552 130h-120v120h120V130z" p-id="12765"></path></svg>
    )
  }
)

if (__DEV__) {
  DiagramOutlined.displayName = 'DiagramOutlined'
}
  