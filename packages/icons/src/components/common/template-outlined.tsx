
import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { IconProps } from '../../@types/props'

const _prefix = getPrefixCls('icon-template-outlined')

export const TemplateOutlined = forwardRef<SVGSVGElement | null, IconProps>(
  ({ prefixCls = _prefix, className, children, size, style: styleProp, ...rest }, ref) => {
    const cls = cx(prefixCls, className)
    const style = { fontSize: size, ...styleProp }

    return (
      <svg className={cls} ref={ref} role="icon" style={style} {...rest}   viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="9861"  ><path d="M224 198.4a25.6 25.6 0 0 0-25.6 25.6v576a25.6 25.6 0 0 0 25.6 25.6h576a25.6 25.6 0 0 0 25.6-25.6v-576a25.6 25.6 0 0 0-25.6-25.6h-576z m576-76.8a102.4 102.4 0 0 1 102.4 102.4v576a102.4 102.4 0 0 1-102.4 102.4h-576a102.4 102.4 0 0 1-102.4-102.4v-576a102.4 102.4 0 0 1 102.4-102.4h576z" p-id="9862"></path><path d="M384 433.066667H170.666667a38.4 38.4 0 1 1 0-76.8h213.333333a38.4 38.4 0 1 1 0 76.8z" p-id="9863"></path><path d="M356.266667 842.666667v-682.666667a38.4 38.4 0 1 1 76.8 0v682.666667a38.4 38.4 0 1 1-76.8 0z" p-id="9864"></path></svg>
    )
  }
)

if (__DEV__) {
  TemplateOutlined.displayName = 'TemplateOutlined'
}
  