
import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { IconProps } from '../../@types/props'

const _prefix = getPrefixCls('icon-shrink-outlined')

export const ShrinkOutlined = forwardRef<SVGSVGElement | null, IconProps>(
  ({ prefixCls = _prefix, className, children, size, style: styleProp, ...rest }, ref) => {
    const cls = cx(prefixCls, className)
    const style = { fontSize: size, ...styleProp }

    return (
      <svg className={cls} ref={ref} role="icon" style={style} {...rest}   viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="11661"  ><path d="M635.136 443.136a38.4 38.4 0 1 1-54.293333-54.272l245.333333-245.333333a38.4 38.4 0 1 1 54.293333 54.272l-245.333333 245.333333z"  p-id="11662"></path><path d="M746.666667 465.066667a38.4 38.4 0 1 0 0-76.8h-149.333334a38.4 38.4 0 1 0 0 76.8h149.333334z"  p-id="11663"></path><path d="M635.733333 277.333333v149.333334a38.4 38.4 0 1 1-76.8 0v-149.333334a38.4 38.4 0 1 1 76.8 0zM388.842667 580.842667a38.4 38.4 0 1 1 54.293333 54.293333l-245.333333 245.333333a38.4 38.4 0 1 1-54.293334-54.272l245.333334-245.333333z"  p-id="11664"></path><path d="M277.333333 558.933333a38.4 38.4 0 1 0 0 76.8h149.333334a38.4 38.4 0 1 0 0-76.8h-149.333334z"  p-id="11665"></path><path d="M388.266667 746.666667v-149.333334a38.4 38.4 0 1 1 76.8 0v149.333334a38.4 38.4 0 1 1-76.8 0z"  p-id="11666"></path></svg>
    )
  }
)

if (__DEV__) {
  ShrinkOutlined.displayName = 'ShrinkOutlined'
}
  