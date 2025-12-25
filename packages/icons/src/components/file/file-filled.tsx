
import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { IconProps } from '../../@types/props'

const _prefix = getPrefixCls('icon-file-filled')

export const FileFilled = forwardRef<SVGSVGElement | null, IconProps>(
  ({ prefixCls = _prefix, className, children, size, style: styleProp, ...rest }, ref) => {
    const cls = cx(prefixCls, className)
    const style = { fontSize: size, ...styleProp }

    return (
      <svg className={cls} ref={ref} role="icon" style={style} {...rest}   viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="5044"  ><path d="M192 192a64 64 0 0 1 64-64h357.376a12.8 12.8 0 0 1 9.045333 3.754667l205.824 205.824a12.8 12.8 0 0 1 3.754667 9.066666V832a64 64 0 0 1-64 64H256a64 64 0 0 1-64-64V192z" p-id="5045"></path><path d="M864 832a96 96 0 0 1-96 96H256A96 96 0 0 1 160 832V192A96 96 0 0 1 256 96h357.376a44.8 44.8 0 0 1 31.658667 13.12l205.845333 205.845333a44.8 44.8 0 0 1 13.12 31.658667V832z m-640 0a32 32 0 0 0 32 32h512a32 32 0 0 0 32-32V354.581333L605.418667 160H256A32 32 0 0 0 224 192v640z" p-id="5046"></path></svg>
    )
  }
)

if (__DEV__) {
  FileFilled.displayName = 'FileFilled'
}
  