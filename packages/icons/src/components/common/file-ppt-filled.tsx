
import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { IconProps } from '../../@types/props'

const _prefix = getPrefixCls('icon-file-ppt-filled')

export const FilePptFilled = forwardRef<SVGSVGElement | null, IconProps>(
  ({ prefixCls = _prefix, className, children, size, style: styleProp, ...rest }, ref) => {
    const cls = cx(prefixCls, className)
    const style = { fontSize: size, ...styleProp }

    return (
      <svg className={cls} ref={ref} role="icon" style={style} {...rest}   viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="10526"  ><path d="M529.834667 499.541333c24.192 0 39.530667 15.36 39.552 37.632 0 22.272-15.36 37.248-39.552 37.248h-49.92v-74.88h49.92z" p-id="10527"></path><path d="M613.376 96a44.8 44.8 0 0 1 31.658667 13.12l205.845333 205.845333a44.8 44.8 0 0 1 13.12 31.658667V832a96 96 0 0 1-96 96H256A96 96 0 0 1 160 832V192A96 96 0 0 1 256 96h357.376z m-186.837333 355.925333V725.333333h53.376v-102.912h52.608c56.448 0 90.24-38.784 90.24-85.248s-33.792-85.248-90.24-85.248h-105.984z" p-id="10528"></path></svg>
    )
  }
)

if (__DEV__) {
  FilePptFilled.displayName = 'FilePptFilled'
}
  