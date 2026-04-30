
import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { IconProps } from '../../@types/props'

const _prefix = getPrefixCls('icon-file-excel-filled')

export const FileExcelFilled = forwardRef<SVGSVGElement | null, IconProps>(
  ({ prefixCls = _prefix, className, children, size, style: styleProp, ...rest }, ref) => {
    const cls = cx(prefixCls, className)
    const style = { fontSize: size, ...styleProp }

    return (
      <svg className={cls} ref={ref} role="icon" style={style} {...rest}   viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="11400"  ><path d="M613.376 96a44.8 44.8 0 0 1 31.658667 13.12l205.845333 205.845333a44.8 44.8 0 0 1 13.12 31.658667V832a96 96 0 0 1-96 96H256A96 96 0 0 1 160 832V192A96 96 0 0 1 256 96h357.376z m-207.530667 359.466667l79.488 133.248-84.842666 140.16h61.056l52.608-95.232 52.970666 95.232h61.056l-85.248-140.16 79.509334-133.248H562.133333l-48 88.32-47.637333-88.32h-60.672z" p-id="11401"></path></svg>
    )
  }
)

if (__DEV__) {
  FileExcelFilled.displayName = 'FileExcelFilled'
}
  