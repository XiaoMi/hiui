
import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { IconProps } from '../../@types/props'

const _prefix = getPrefixCls('icon-folder-add-filled')

export const FolderAddFilled = forwardRef<SVGSVGElement | null, IconProps>(
  ({ prefixCls = _prefix, className, children, size, style: styleProp, ...rest }, ref) => {
    const cls = cx(prefixCls, className)
    const style = { fontSize: size, ...styleProp }

    return (
      <svg className={cls} ref={ref} role="icon" style={style} {...rest}   viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="33111"  ><path d="M376.576 142.933333a102.4 102.4 0 0 1 76.544 34.346667l47.146667 53.056c4.864 5.461333 11.84 8.597333 19.157333 8.597333H832a102.4 102.4 0 0 1 102.4 102.4v437.333334a102.4 102.4 0 0 1-102.4 102.4H192a102.4 102.4 0 0 1-102.4-102.4v-533.333334A102.4 102.4 0 0 1 192 142.933333h184.576zM512 398.933333a38.4 38.4 0 0 0-38.4 38.4v78.933334h-78.933333a38.4 38.4 0 1 0 0 76.8h78.933333v78.933333a38.4 38.4 0 1 0 76.8 0v-78.933333h78.933333a38.4 38.4 0 1 0 0-76.8h-78.933333v-78.933334a38.4 38.4 0 0 0-38.4-38.4z" p-id="33112"></path></svg>
    )
  }
)

if (__DEV__) {
  FolderAddFilled.displayName = 'FolderAddFilled'
}
  