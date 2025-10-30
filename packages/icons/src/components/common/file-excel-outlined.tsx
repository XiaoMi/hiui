
import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { IconProps } from '../../@types/props'

const _prefix = getPrefixCls('icon-file-excel-outlined')

export const FileExcelOutlined = forwardRef<SVGSVGElement | null, IconProps>(
  ({ prefixCls = _prefix, className, children, size, style: styleProp, ...rest }, ref) => {
    const cls = cx(prefixCls, className)
    const style = { fontSize: size, ...styleProp }

    return (
      <svg className={cls} ref={ref} role="icon" style={style} {...rest}   viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="17151"  ><path d="M624.341333 703.957333h-61.056l-52.992-95.232-52.608 95.232h-61.056l84.864-140.16-79.488-133.248h60.672l47.616 88.32 48-88.32h60.288l-79.488 133.248 85.248 140.16z" p-id="17152"></path><path d="M153.642667 831.957333v-640a102.4 102.4 0 0 1 102.4-102.4H570.88a102.4 102.4 0 0 1 72.384 29.994667l197.205333 197.184a102.4 102.4 0 0 1 29.973334 72.384v442.837333a102.4 102.4 0 0 1-102.4 102.4h-512a102.4 102.4 0 0 1-102.4-102.4z m76.8 0a25.6 25.6 0 0 0 25.6 25.6h512a25.6 25.6 0 0 0 25.6-25.6V389.12a25.6 25.6 0 0 0-7.488-18.069333l-197.205334-197.205334a25.6 25.6 0 0 0-18.069333-7.488H256.042667a25.6 25.6 0 0 0-25.6 25.6v640z" p-id="17153"></path></svg>
    )
  }
)

if (__DEV__) {
  FileExcelOutlined.displayName = 'FileExcelOutlined'
}
  