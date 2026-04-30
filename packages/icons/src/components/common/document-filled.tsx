
import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { IconProps } from '../../@types/props'

const _prefix = getPrefixCls('icon-document-filled')

export const DocumentFilled = forwardRef<SVGSVGElement | null, IconProps>(
  ({ prefixCls = _prefix, className, children, size, style: styleProp, ...rest }, ref) => {
    const cls = cx(prefixCls, className)
    const style = { fontSize: size, ...styleProp }

    return (
      <svg className={cls} ref={ref} role="icon" style={style} {...rest}   viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="9454"  ><path d="M634.709333 96a44.8 44.8 0 0 1 31.658667 13.12l184.512 184.512a44.8 44.8 0 0 1 13.12 31.658667V832a96 96 0 0 1-96 96H256A96 96 0 0 1 160 832V192A96 96 0 0 1 256 96h378.709333z m-229.333333 452.224a38.4 38.4 0 1 0 0 76.8h213.333333a38.4 38.4 0 0 0 0-76.8h-213.333333z m0-149.333333a38.4 38.4 0 1 0 0 76.8h213.333333a38.4 38.4 0 0 0 0-76.8h-213.333333z" p-id="9455"></path></svg>
    )
  }
)

if (__DEV__) {
  DocumentFilled.displayName = 'DocumentFilled'
}
  