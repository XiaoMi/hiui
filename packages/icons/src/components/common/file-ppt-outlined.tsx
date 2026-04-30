
import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { IconProps } from '../../@types/props'

const _prefix = getPrefixCls('icon-file-ppt-outlined')

export const FilePptOutlined = forwardRef<SVGSVGElement | null, IconProps>(
  ({ prefixCls = _prefix, className, children, size, style: styleProp, ...rest }, ref) => {
    const cls = cx(prefixCls, className)
    const style = { fontSize: size, ...styleProp }

    return (
      <svg className={cls} ref={ref} role="icon" style={style} {...rest}   viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="18113"  ><path d="M622.805333 558.464c0 46.464-33.792 85.248-90.24 85.248h-52.608v102.912h-53.376V473.216h105.984c56.448 0 90.24 38.784 90.24 85.248z m-53.376 0c0-22.272-15.36-37.632-39.552-37.632h-49.92v74.88h49.92c24.192 0 39.552-14.976 39.552-37.248z" p-id="18114"></path><path d="M153.642667 831.957333v-640a102.4 102.4 0 0 1 102.4-102.4H570.88a102.4 102.4 0 0 1 72.384 29.994667l197.205333 197.184a102.4 102.4 0 0 1 29.973334 72.384v442.837333a102.4 102.4 0 0 1-102.4 102.4h-512a102.4 102.4 0 0 1-102.4-102.4z m76.8 0a25.6 25.6 0 0 0 25.6 25.6h512a25.6 25.6 0 0 0 25.6-25.6V389.12a25.6 25.6 0 0 0-7.488-18.069333l-197.205334-197.205334a25.6 25.6 0 0 0-18.069333-7.488H256.042667a25.6 25.6 0 0 0-25.6 25.6v640z" p-id="18115"></path></svg>
    )
  }
)

if (__DEV__) {
  FilePptOutlined.displayName = 'FilePptOutlined'
}
  