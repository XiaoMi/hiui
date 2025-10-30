
import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { IconProps } from '../../@types/props'

const _prefix = getPrefixCls('icon-block-outlined')

export const BlockOutlined = forwardRef<SVGSVGElement | null, IconProps>(
  ({ prefixCls = _prefix, className, children, size, style: styleProp, ...rest }, ref) => {
    const cls = cx(prefixCls, className)
    const style = { fontSize: size, ...styleProp }

    return (
      <svg className={cls} ref={ref} role="icon" style={style} {...rest}   viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="12834"  ><path d="M612.266667 202.666667a25.6 25.6 0 0 0-25.6-25.6h-384a25.6 25.6 0 0 0-25.6 25.6v384a25.6 25.6 0 0 0 25.6 25.6h384a25.6 25.6 0 0 0 25.6-25.6v-384z m76.8 384a102.4 102.4 0 0 1-102.4 102.4h-384a102.4 102.4 0 0 1-102.4-102.4v-384a102.4 102.4 0 0 1 102.4-102.4h384a102.4 102.4 0 0 1 102.4 102.4v384z" p-id="12835"></path><path d="M846.933333 437.333333a25.6 25.6 0 0 0-25.6-25.6h-384a25.6 25.6 0 0 0-25.6 25.6v384a25.6 25.6 0 0 0 25.6 25.6h384a25.6 25.6 0 0 0 25.6-25.6v-384z m76.8 384a102.4 102.4 0 0 1-102.4 102.4h-384a102.4 102.4 0 0 1-102.4-102.4v-384a102.4 102.4 0 0 1 102.4-102.4h384a102.4 102.4 0 0 1 102.4 102.4v384z" p-id="12836"></path></svg>
    )
  }
)

if (__DEV__) {
  BlockOutlined.displayName = 'BlockOutlined'
}
  