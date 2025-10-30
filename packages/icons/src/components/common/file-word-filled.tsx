
import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { IconProps } from '../../@types/props'

const _prefix = getPrefixCls('icon-file-word-filled')

export const FileWordFilled = forwardRef<SVGSVGElement | null, IconProps>(
  ({ prefixCls = _prefix, className, children, size, style: styleProp, ...rest }, ref) => {
    const cls = cx(prefixCls, className)
    const style = { fontSize: size, ...styleProp }

    return (
      <svg className={cls} ref={ref} role="icon" style={style} {...rest}   viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="10381"  ><path d="M613.376 96a44.8 44.8 0 0 1 31.658667 13.12l205.845333 205.845333a44.8 44.8 0 0 1 13.12 31.658667V832a96 96 0 0 1-96 96H256A96 96 0 0 1 160 832V192A96 96 0 0 1 256 96h357.376zM343.637333 451.925333L416.597333 725.333333h44.544l50.304-165.888L561.749333 725.333333h44.544l73.344-273.408h-55.68l-42.624 172.416-49.92-172.416h-39.936l-49.92 172.416-42.24-172.416h-55.68z" p-id="10382"></path></svg>
    )
  }
)

if (__DEV__) {
  FileWordFilled.displayName = 'FileWordFilled'
}
  