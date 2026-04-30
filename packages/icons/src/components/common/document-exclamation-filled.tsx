
import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { IconProps } from '../../@types/props'

const _prefix = getPrefixCls('icon-document-exclamation-filled')

export const DocumentExclamationFilled = forwardRef<SVGSVGElement | null, IconProps>(
  ({ prefixCls = _prefix, className, children, size, style: styleProp, ...rest }, ref) => {
    const cls = cx(prefixCls, className)
    const style = { fontSize: size, ...styleProp }

    return (
      <svg className={cls} ref={ref} role="icon" style={style} {...rest}   viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="9599"  ><path d="M634.709333 96a44.8 44.8 0 0 1 31.658667 13.12l184.512 184.512a44.8 44.8 0 0 1 13.12 31.658667V832a96 96 0 0 1-96 96H256A96 96 0 0 1 160 832V192A96 96 0 0 1 256 96h378.709333zM512 605.866667a42.666667 42.666667 0 1 0 0 85.333333 42.666667 42.666667 0 0 0 0-85.333333z m0-273.066667a38.4 38.4 0 0 0-38.4 38.4v149.333333a38.4 38.4 0 0 0 76.8 0v-149.333333a38.4 38.4 0 0 0-38.4-38.4z" p-id="9600"></path></svg>
    )
  }
)

if (__DEV__) {
  DocumentExclamationFilled.displayName = 'DocumentExclamationFilled'
}
  