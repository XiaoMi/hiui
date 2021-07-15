
import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { IconProps } from '../@types/props'

const _role = 'icon-folder-open-filled'
const _prefix = getPrefixCls(_role)

export const FolderOpenFilled = forwardRef<SVGSVGElement | null, IconProps>(
  ({ prefixCls = _prefix, role = _role, className, children, style, onClick }, ref) => {
    const cls = cx(prefixCls, className)

    return (
      <svg className={cls} ref={ref} role={role} style={style} onClick={onClick}  xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" version="1.1"><path d="M399.954 284l122.984 104H952a8 8 0 0 1 8 8v512a8 8 0 0 1-8 8H72a8 8 0 0 1-8-8V292a8 8 0 0 1 8-8h327.954zM856 108a8 8 0 0 1 8 8v224h-80V188H242v48H162V116a8 8 0 0 1 8-8h686z" p-id="11855"></path></svg>
    )
  }
)

if (__DEV__) {
  FolderOpenFilled.displayName = 'FolderOpenFilled'
}
  