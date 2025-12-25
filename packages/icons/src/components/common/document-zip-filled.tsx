
import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { IconProps } from '../../@types/props'

const _prefix = getPrefixCls('icon-document-zip-filled')

export const DocumentZipFilled = forwardRef<SVGSVGElement | null, IconProps>(
  ({ prefixCls = _prefix, className, children, size, style: styleProp, ...rest }, ref) => {
    const cls = cx(prefixCls, className)
    const style = { fontSize: size, ...styleProp }

    return (
      <svg className={cls} ref={ref} role="icon" style={style} {...rest}   viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="9509"  ><path d="M634.453333 517.12c17.28 0 18.24 17.28 18.24 31.68s-0.96 32-18.24 32h-19.2V517.12h19.2z" p-id="9510"></path><path d="M613.376 96a44.8 44.8 0 0 1 31.658667 13.12l205.845333 205.845333a44.8 44.8 0 0 1 13.12 31.658667V832a96 96 0 0 1-96 96H256A96 96 0 0 1 160 832V192A96 96 0 0 1 256 96h357.376zM344.106667 476.16v40.96h56.96l-60.16 153.28V704h107.52v-40.96H388.266667l60.16-153.28V476.16h-104.32z m138.666666 0V704h45.44V476.16h-45.44z m87.04 0V704h45.44v-82.24h18.901334c49.28 0 64-28.48 64-73.28 0-44.48-14.72-72.32-64-72.32H569.813333z" p-id="9511"></path></svg>
    )
  }
)

if (__DEV__) {
  DocumentZipFilled.displayName = 'DocumentZipFilled'
}
  