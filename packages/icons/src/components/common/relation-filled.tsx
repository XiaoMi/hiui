
import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { IconProps } from '../../@types/props'

const _prefix = getPrefixCls('icon-relation-filled')

export const RelationFilled = forwardRef<SVGSVGElement | null, IconProps>(
  ({ prefixCls = _prefix, className, children, size, style: styleProp, ...rest }, ref) => {
    const cls = cx(prefixCls, className)
    const style = { fontSize: size, ...styleProp }

    return (
      <svg className={cls} ref={ref} role="icon" style={style} {...rest}   viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="27932"  ><path d="M629.333333 725.333333a64 64 0 0 1 64-64h128a64 64 0 0 1 64 64v64a64 64 0 0 1-64 64h-128a64 64 0 0 1-64-64v-64z" p-id="27933"></path><path d="M846.933333 725.333333a25.6 25.6 0 0 0-25.6-25.6h-128a25.6 25.6 0 0 0-25.6 25.6v64a25.6 25.6 0 0 0 25.6 25.6h128a25.6 25.6 0 0 0 25.6-25.6v-64z m76.8 64a102.4 102.4 0 0 1-102.4 102.4h-128a102.4 102.4 0 0 1-102.4-102.4v-64a102.4 102.4 0 0 1 102.4-102.4h128a102.4 102.4 0 0 1 102.4 102.4v64zM138.666667 725.333333a64 64 0 0 1 64-64h128a64 64 0 0 1 64 64v64a64 64 0 0 1-64 64h-128a64 64 0 0 1-64-64v-64z" p-id="27934"></path><path d="M356.266667 725.333333a25.6 25.6 0 0 0-25.6-25.6h-128A25.6 25.6 0 0 0 177.066667 725.333333v64a25.6 25.6 0 0 0 25.6 25.6h128a25.6 25.6 0 0 0 25.6-25.6v-64z m76.8 64a102.4 102.4 0 0 1-102.4 102.4h-128A102.4 102.4 0 0 1 100.266667 789.333333v-64a102.4 102.4 0 0 1 102.4-102.4h128a102.4 102.4 0 0 1 102.4 102.4v64zM394.666667 234.666667a64 64 0 0 1 64-64h128a64 64 0 0 1 64 64v64a64 64 0 0 1-64 64h-128a64 64 0 0 1-64-64v-64z" p-id="27935"></path><path d="M612.266667 234.666667a25.6 25.6 0 0 0-25.6-25.6h-128a25.6 25.6 0 0 0-25.6 25.6v64a25.6 25.6 0 0 0 25.6 25.6h128a25.6 25.6 0 0 0 25.6-25.6v-64z m76.8 64a102.4 102.4 0 0 1-102.4 102.4h-128a102.4 102.4 0 0 1-102.4-102.4v-64a102.4 102.4 0 0 1 102.4-102.4h128a102.4 102.4 0 0 1 102.4 102.4v64zM718.933333 650.666667v-64a25.6 25.6 0 0 0-25.6-25.6h-362.666666a25.6 25.6 0 0 0-25.6 25.6v64a38.4 38.4 0 1 1-76.8 0v-64a102.4 102.4 0 0 1 102.4-102.4h362.666666a102.4 102.4 0 0 1 102.4 102.4v64a38.4 38.4 0 1 1-76.8 0z" p-id="27936"></path><path d="M561.066667 501.333333a38.4 38.4 0 1 1-76.8 0v-128a38.4 38.4 0 1 1 76.8 0v128z" p-id="27937"></path></svg>
    )
  }
)

if (__DEV__) {
  RelationFilled.displayName = 'RelationFilled'
}
  