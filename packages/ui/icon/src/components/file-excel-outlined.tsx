
import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { IconProps } from '../@types/props'

const _role = 'icon-file-excel-outlined'
const _prefix = getPrefixCls(_role)

export const FileExcelOutlined = forwardRef<SVGSVGElement | null, IconProps>(
  ({ prefixCls = _prefix, role = _role, className, children, style, onClick }, ref) => {
    const cls = cx(prefixCls, className)

    return (
      <svg className={cls} ref={ref} role={role} style={style} onClick={onClick}  xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" version="1.1"><path d="M764 304l-132-132v132h132zM552 144H232v736h560V384H560a8 8 0 0 1-8-8V144z m320 160v648a8 8 0 0 1-8 8H160a8 8 0 0 1-8-8V72a8 8 0 0 1 8-8h472l240 240zM440 458l72.666 113.334L586 458h72l-109.498 169.224L658 798h-74l-72.666-113.334L438 798h-72l109.498-169.224L366 458h74z" p-id="11345"></path></svg>
    )
  }
)

if (__DEV__) {
  FileExcelOutlined.displayName = 'FileExcelOutlined'
}
  