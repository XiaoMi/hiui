
import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { IconProps } from '../../@types/props'

const _prefix = getPrefixCls('icon-folder-add-outlined')

export const FolderAddOutlined = forwardRef<SVGSVGElement | null, IconProps>(
  ({ prefixCls = _prefix, className, children, size, style: styleProp, ...rest }, ref) => {
    const cls = cx(prefixCls, className)
    const style = { fontSize: size, ...styleProp }

    return (
      <svg className={cls} ref={ref} role="icon" style={style} {...rest}   viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="8260"  ><path d="M376.576 142.933333a102.4 102.4 0 0 1 76.544 34.346667l47.146667 53.056c4.864 5.461333 11.84 8.597333 19.157333 8.597333H832a102.4 102.4 0 0 1 102.4 102.4v437.333334a102.4 102.4 0 0 1-102.4 102.4H192a102.4 102.4 0 0 1-102.4-102.4v-533.333334A102.4 102.4 0 0 1 192 142.933333h184.576zM192 219.733333a25.6 25.6 0 0 0-25.6 25.6v533.333334A25.6 25.6 0 0 0 192 804.266667h640a25.6 25.6 0 0 0 25.6-25.6V341.333333a25.6 25.6 0 0 0-25.6-25.6H519.424a102.4 102.4 0 0 1-76.544-34.389333l-47.146667-53.013333a25.642667 25.642667 0 0 0-19.157333-8.597334H192z m320 179.2a38.4 38.4 0 0 1 38.4 38.4v78.933334h78.933333a38.4 38.4 0 1 1 0 76.8h-78.933333v78.933333a38.4 38.4 0 1 1-76.8 0v-78.933333h-78.933333a38.4 38.4 0 1 1 0-76.8h78.933333v-78.933334a38.4 38.4 0 0 1 38.4-38.4z" p-id="8261"></path></svg>
    )
  }
)

if (__DEV__) {
  FolderAddOutlined.displayName = 'FolderAddOutlined'
}
  