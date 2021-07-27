
import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { IconProps } from '../@types/props'

const _role = 'icon-document-exclamation-outlined'
const _prefix = getPrefixCls(_role)

export const DocumentExclamationOutlined = forwardRef<SVGSVGElement | null, IconProps>(
  ({ prefixCls = _prefix, role = _role, className, children, style, onClick }, ref) => {
    const cls = cx(prefixCls, className)

    return (
      <svg className={cls} ref={ref} role={role} style={style} onClick={onClick}  xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" version="1.1"><path d="M696 72v64a8 8 0 0 1-8 8H232v736h560v-120a8 8 0 0 1 8-8h64a8 8 0 0 1 8 8v192a8 8 0 0 1-8 8H160a8 8 0 0 1-8-8V72a8 8 0 0 1 8-8h528a8 8 0 0 1 8 8zM336 280h352a8 8 0 0 1 8 8v64a8 8 0 0 1-8 8H336a8 8 0 0 1-8-8v-64a8 8 0 0 1 8-8zM336 472h352a8 8 0 0 1 8 8v64a8 8 0 0 1-8 8H336a8 8 0 0 1-8-8v-64a8 8 0 0 1 8-8zM336 664h192a8 8 0 0 1 8 8v64a8 8 0 0 1-8 8h-192a8 8 0 0 1-8-8v-64a8 8 0 0 1 8-8zM864 624a8 8 0 0 1 8 8v64a8 8 0 0 1-8 8h-64a8 8 0 0 1-8-8v-64a8 8 0 0 1 8-8h64z m0-560a8 8 0 0 1 8 8v504a8 8 0 0 1-8 8h-64a8 8 0 0 1-8-8V72a8 8 0 0 1 8-8h64z" p-id="12785"></path></svg>
    )
  }
)

if (__DEV__) {
  DocumentExclamationOutlined.displayName = 'DocumentExclamationOutlined'
}
  