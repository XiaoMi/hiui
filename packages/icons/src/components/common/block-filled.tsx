
import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { IconProps } from '../../@types/props'

const _prefix = getPrefixCls('icon-block-filled')

export const BlockFilled = forwardRef<SVGSVGElement | null, IconProps>(
  ({ prefixCls = _prefix, className, children, size, style: styleProp, ...rest }, ref) => {
    const cls = cx(prefixCls, className)
    const style = { fontSize: size, ...styleProp }

    return (
      <svg className={cls} ref={ref} role="icon" style={style} {...rest}   viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="6924"  ><path d="M821.333333 341.333333a96 96 0 0 1 96 96v384a96 96 0 0 1-96 96h-384a96 96 0 0 1-96-96v-138.453333a108.437333 108.437333 0 0 0 76.8 31.786667h187.733334a108.8 108.8 0 0 0 108.8-108.8v-187.733334a108.437333 108.437333 0 0 0-31.744-76.8H821.333333zM586.666667 106.666667A96 96 0 0 1 682.666667 202.666667v138.410666a108.437333 108.437333 0 0 0-76.8-31.744h-187.733334a108.8 108.8 0 0 0-108.8 108.8v187.733334c0 29.994667 12.138667 57.130667 31.744 76.8H202.666667A96 96 0 0 1 106.666667 586.666667v-384A96 96 0 0 1 202.666667 106.666667h384z" p-id="6925"></path><path d="M605.866667 373.333333c24.746667 0 44.8 20.053333 44.8 44.8v187.733334a44.8 44.8 0 0 1-44.8 44.8h-187.733334a44.8 44.8 0 0 1-44.8-44.8v-187.733334c0-24.746667 20.053333-44.8 44.8-44.8h187.733334z" p-id="6926"></path></svg>
    )
  }
)

if (__DEV__) {
  BlockFilled.displayName = 'BlockFilled'
}
  