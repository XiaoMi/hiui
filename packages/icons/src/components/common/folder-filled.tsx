
import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { IconProps } from '../../@types/props'

const _prefix = getPrefixCls('icon-folder-filled')

export const FolderFilled = forwardRef<SVGSVGElement | null, IconProps>(
  ({ prefixCls = _prefix, className, children, size, style: styleProp, ...rest }, ref) => {
    const cls = cx(prefixCls, className)
    const style = { fontSize: size, ...styleProp }

    return (
      <svg className={cls} ref={ref} role="icon" style={style} {...rest}   viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="24234"  ><path d="M376.576 142.933333a102.4 102.4 0 0 1 76.544 34.346667l47.146667 53.056c4.864 5.461333 11.84 8.597333 19.157333 8.597333H832a102.4 102.4 0 0 1 102.4 102.4v437.418667A102.314667 102.314667 0 0 1 832 881.066667H192a102.4 102.4 0 0 1-102.4-102.4v-533.333334A102.4 102.4 0 0 1 192 142.933333h184.576z"  p-id="24235"></path></svg>
    )
  }
)

if (__DEV__) {
  FolderFilled.displayName = 'FolderFilled'
}
  