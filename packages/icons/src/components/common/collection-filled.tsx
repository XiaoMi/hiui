
import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { IconProps } from '../../@types/props'

const _prefix = getPrefixCls('icon-collection-filled')

export const CollectionFilled = forwardRef<SVGSVGElement | null, IconProps>(
  ({ prefixCls = _prefix, className, children, size, style: styleProp, ...rest }, ref) => {
    const cls = cx(prefixCls, className)
    const style = { fontSize: size, ...styleProp }

    return (
      <svg className={cls} ref={ref} role="icon" style={style} {...rest}   viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="9017"  ><path d="M376.576 149.333333c27.434667 0 53.546667 11.733333 71.786667 32.213334l47.146666 53.034666a32 32 0 0 0 23.893334 10.752H832a96 96 0 0 1 96 96v437.418667A95.936 95.936 0 0 1 832 874.666667H192a96 96 0 0 1-96-96v-533.333334A96 96 0 0 1 192 149.333333h184.576z m166.4 275.776c-6.4-19.648-34.218667-19.648-40.597333 0l-20.416 62.848a21.333333 21.333333 0 0 1-20.288 14.741334h-66.090667c-20.672 0-29.269333 26.453333-12.544 38.592l53.461333 38.848a21.333333 21.333333 0 0 1 7.744 23.872l-20.416 62.848c-6.378667 19.648 16.128 35.989333 32.853334 23.850666l53.44-38.848a21.333333 21.333333 0 0 1 25.088 0l53.461333 38.848c16.704 12.16 39.210667-4.202667 32.832-23.850666l-20.416-62.869334a21.333333 21.333333 0 0 1 7.744-23.850666l53.461333-38.848c16.725333-12.16 8.106667-38.592-12.544-38.592h-66.090666a21.333333 21.333333 0 0 1-20.266667-14.741334l-20.437333-62.848z" p-id="9018"></path></svg>
    )
  }
)

if (__DEV__) {
  CollectionFilled.displayName = 'CollectionFilled'
}
  