
import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { IconProps } from '../../@types/props'

const _prefix = getPrefixCls('icon-document-outlined')

export const DocumentOutlined = forwardRef<SVGSVGElement | null, IconProps>(
  ({ prefixCls = _prefix, className, children, size, style: styleProp, ...rest }, ref) => {
    const cls = cx(prefixCls, className)
    const style = { fontSize: size, ...styleProp }

    return (
      <svg className={cls} ref={ref} role="icon" style={style} {...rest}   viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="15900"  ><path d="M153.642667 831.957333v-640a102.4 102.4 0 0 1 102.4-102.4H570.88a102.4 102.4 0 0 1 72.384 29.994667l197.205333 197.184a102.4 102.4 0 0 1 29.973334 72.384v442.837333a102.4 102.4 0 0 1-102.4 102.4h-512a102.4 102.4 0 0 1-102.4-102.4z m76.8 0a25.6 25.6 0 0 0 25.6 25.6h512a25.6 25.6 0 0 0 25.6-25.6V389.12a25.6 25.6 0 0 0-7.488-18.069333l-197.205334-197.205334a25.6 25.6 0 0 0-18.069333-7.488H256.042667a25.6 25.6 0 0 0-25.6 25.6v640z" p-id="15901"></path><path d="M618.709333 398.890667a38.4 38.4 0 1 1 0 76.8h-213.333333a38.4 38.4 0 1 1 0-76.8h213.333333zM618.709333 548.224a38.4 38.4 0 1 1 0 76.8h-213.333333a38.4 38.4 0 1 1 0-76.8h213.333333z" p-id="15902"></path></svg>
    )
  }
)

if (__DEV__) {
  DocumentOutlined.displayName = 'DocumentOutlined'
}
  