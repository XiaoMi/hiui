
import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { IconProps } from '../@types/props'

const _role = 'icon-file-keynote-outlined'
const _prefix = getPrefixCls(_role)

export const FileKeynoteOutlined = forwardRef<SVGSVGElement | null, IconProps>(
  ({ prefixCls = _prefix, role = _role, className, children, style, onClick }, ref) => {
    const cls = cx(prefixCls, className)

    return (
      <svg className={cls} ref={ref} role={role} style={style} onClick={onClick}  xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" version="1.1"><path d="M764 304l-132-132v132h132zM552 144H232v736h560V384H560a8 8 0 0 1-8-8V144z m320 160v648a8 8 0 0 1-8 8H160a8 8 0 0 1-8-8V72a8 8 0 0 1 8-8h472l240 240zM432 794v-48h55.998l0.002-44h-124v-52h296v52h-124l-0.002 44H592v48h-160z m228-332v160H364v-160h296z" p-id="11355"></path></svg>
    )
  }
)

if (__DEV__) {
  FileKeynoteOutlined.displayName = 'FileKeynoteOutlined'
}
  