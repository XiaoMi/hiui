
import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { IconProps } from '../@types/props'

const _role = 'icon-close-circle-filled'
const _prefix = getPrefixCls(_role)

export const CloseCircleFilled = forwardRef<SVGSVGElement | null, IconProps>(
  ({ prefixCls = _prefix, role = _role, className, children, style, onClick }, ref) => {
    const cls = cx(prefixCls, className)

    return (
      <svg className={cls} ref={ref} role={role} style={style} onClick={onClick}  xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" version="1.1"><path d="M512 64c247.424 0 448 200.576 448 448S759.424 960 512 960 64 759.424 64 512 264.576 64 512 64z m135.764 266.98a8 8 0 0 0-11.314 0L512 455.432l-124.45-124.452a8 8 0 0 0-11.314 0l-45.256 45.256a8 8 0 0 0 0 11.314l124.45 124.448-124.45 124.452a8 8 0 0 0 0 11.314l45.256 45.256a8 8 0 0 0 11.314 0l124.448-124.452 124.452 124.452a8 8 0 0 0 11.314 0l45.256-45.256a8 8 0 0 0 0-11.314L568.568 512l124.452-124.45a8 8 0 0 0 0-11.314z" p-id="11625"></path></svg>
    )
  }
)

if (__DEV__) {
  CloseCircleFilled.displayName = 'CloseCircleFilled'
}
  