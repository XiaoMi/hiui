
import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { IconProps } from '../../@types/props'

const _prefix = getPrefixCls('icon-file-keynote-outlined')

export const FileKeynoteOutlined = forwardRef<SVGSVGElement | null, IconProps>(
  ({ prefixCls = _prefix, className, children, size, style: styleProp, ...rest }, ref) => {
    const cls = cx(prefixCls, className)
    const style = { fontSize: size, ...styleProp }

    return (
      <svg className={cls} ref={ref} role="icon" style={style} {...rest}   viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="17589"  ><path d="M473.642667 703.957333v-64a38.4 38.4 0 1 1 76.8 0v64a38.4 38.4 0 1 1-76.8 0z"  p-id="17590"></path><path d="M576.042667 703.957333a21.333333 21.333333 0 0 1 0 42.666667h-128a21.333333 21.333333 0 1 1 0-42.666667h128z"  p-id="17591"></path><path d="M153.642667 831.957333v-640a102.4 102.4 0 0 1 102.4-102.4H570.88a102.4 102.4 0 0 1 72.384 29.994667l197.205333 197.184a102.4 102.4 0 0 1 29.973334 72.384v442.837333a102.4 102.4 0 0 1-102.4 102.4h-512a102.4 102.4 0 0 1-102.4-102.4z m76.8 0a25.6 25.6 0 0 0 25.6 25.6h512a25.6 25.6 0 0 0 25.6-25.6V389.12a25.6 25.6 0 0 0-7.488-18.069333l-197.205334-197.205334a25.6 25.6 0 0 0-18.069333-7.488H256.042667a25.6 25.6 0 0 0-25.6 25.6v640z"  p-id="17592"></path><path d="M384.042667 469.290667a21.333333 21.333333 0 0 0-21.333334 21.333333v149.333333a21.333333 21.333333 0 0 0 21.333334 21.333334h256a21.333333 21.333333 0 0 0 21.333333-21.333334v-149.333333a21.333333 21.333333 0 0 0-21.333333-21.333333h-256z"  p-id="17593"></path></svg>
    )
  }
)

if (__DEV__) {
  FileKeynoteOutlined.displayName = 'FileKeynoteOutlined'
}
  