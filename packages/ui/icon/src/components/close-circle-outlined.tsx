
import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { IconProps } from '../@types/props'

const _role = 'icon-close-circle-outlined'
const _prefix = getPrefixCls(_role)

export const CloseCircleOutlined = forwardRef<SVGSVGElement | null, IconProps>(
  ({ prefixCls = _prefix, role = _role, className, children, style, onClick }, ref) => {
    const cls = cx(prefixCls, className)

    return (
      <svg className={cls} ref={ref} role={role} style={style} onClick={onClick}  xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" version="1.1"><path d="M512 64c247.424 0 448 200.576 448 448S759.424 960 512 960 64 759.424 64 512 264.576 64 512 64z m0 80C308.76 144 144 308.76 144 512s164.76 368 368 368 368-164.76 368-368S715.24 144 512 144zM693.02 376.236a8 8 0 0 1 0 11.314L568.568 512l124.452 124.45a8 8 0 0 1 0 11.314l-45.256 45.256a8 8 0 0 1-11.314 0L512 568.568l-124.448 124.452a8 8 0 0 1-11.314 0l-45.256-45.256a8 8 0 0 1 0-11.314L455.43 512l-124.45-124.448a8 8 0 0 1 0-11.314l45.256-45.256a8 8 0 0 1 11.314 0L512 455.432l124.45-124.452a8 8 0 0 1 11.314 0l45.256 45.256z" p-id="13315"></path></svg>
    )
  }
)

if (__DEV__) {
  CloseCircleOutlined.displayName = 'CloseCircleOutlined'
}
  