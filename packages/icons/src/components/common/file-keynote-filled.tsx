
import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { IconProps } from '../../@types/props'

const _prefix = getPrefixCls('icon-file-keynote-filled')

export const FileKeynoteFilled = forwardRef<SVGSVGElement | null, IconProps>(
  ({ prefixCls = _prefix, className, children, size, style: styleProp, ...rest }, ref) => {
    const cls = cx(prefixCls, className)
    const style = { fontSize: size, ...styleProp }

    return (
      <svg className={cls} ref={ref} role="icon" style={style} {...rest}   viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="10817"  ><path d="M609.834667 96a53.333333 53.333333 0 0 1 37.717333 15.616l200.832 200.832a53.333333 53.333333 0 0 1 15.616 37.717333V832a96 96 0 0 1-96 96H256A96 96 0 0 1 160 832V192A96 96 0 0 1 256 96h353.834667zM384 458.666667a21.333333 21.333333 0 0 0-21.333333 21.333333v149.333333a21.333333 21.333333 0 0 0 21.333333 21.333334h106.666667v42.666666h-42.666667a21.333333 21.333333 0 1 0 0 42.666667h128a21.333333 21.333333 0 1 0 0-42.666667h-42.666667v-42.666666h106.666667a21.333333 21.333333 0 0 0 21.333333-21.333334v-149.333333a21.333333 21.333333 0 0 0-21.333333-21.333333H384z" p-id="10818"></path></svg>
    )
  }
)

if (__DEV__) {
  FileKeynoteFilled.displayName = 'FileKeynoteFilled'
}
  