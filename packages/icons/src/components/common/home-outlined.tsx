
import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { IconProps } from '../../@types/props'

const _prefix = getPrefixCls('icon-home-outlined')

export const HomeOutlined = forwardRef<SVGSVGElement | null, IconProps>(
  ({ prefixCls = _prefix, className, children, size, style: styleProp, ...rest }, ref) => {
    const cls = cx(prefixCls, className)
    const style = { fontSize: size, ...styleProp }

    return (
      <svg className={cls} ref={ref} role="icon" style={style} {...rest}   viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="20093"  ><path d="M836.266667 803.84V425.301333c0-8.426667-4.16-16.32-11.093334-21.12l-298.666666-205.12a25.621333 25.621333 0 0 0-29.013334 0l-298.666666 205.141334c-6.933333 4.778667-11.093333 12.672-11.093334 21.12V803.84a25.6 25.6 0 0 0 25.6 25.6h165.333334a4.266667 4.266667 0 0 0 4.266666-4.266667v-163.136a81.066667 81.066667 0 0 1 81.066667-81.066666h96a81.066667 81.066667 0 0 1 81.066667 81.066666v163.136c0 2.346667 1.92 4.266667 4.266666 4.266667H810.666667a25.6 25.6 0 0 0 25.6-25.6z m76.8 0a102.4 102.4 0 0 1-102.4 102.4h-165.333334a81.066667 81.066667 0 0 1-81.066666-81.066667v-163.136a4.266667 4.266667 0 0 0-4.266667-4.266666h-96a4.266667 4.266667 0 0 0-4.266667 4.266666v163.136a81.066667 81.066667 0 0 1-81.066666 81.066667H213.333333a102.4 102.4 0 0 1-102.4-102.4V425.301333a102.4 102.4 0 0 1 44.416-84.416l298.666667-205.141333a102.4 102.4 0 0 1 115.968 0l298.666667 205.141333a102.421333 102.421333 0 0 1 44.416 84.416V803.84z" p-id="20094"></path></svg>
    )
  }
)

if (__DEV__) {
  HomeOutlined.displayName = 'HomeOutlined'
}
  