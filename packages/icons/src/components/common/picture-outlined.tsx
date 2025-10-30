
import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { IconProps } from '../../@types/props'

const _prefix = getPrefixCls('icon-picture-outlined')

export const PictureOutlined = forwardRef<SVGSVGElement | null, IconProps>(
  ({ prefixCls = _prefix, className, children, size, style: styleProp, ...rest }, ref) => {
    const cls = cx(prefixCls, className)
    const style = { fontSize: size, ...styleProp }

    return (
      <svg className={cls} ref={ref} role="icon" style={style} {...rest}   viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="23327"  ><path d="M836.266667 213.333333A25.6 25.6 0 0 0 810.666667 187.733333H213.333333A25.6 25.6 0 0 0 187.733333 213.333333v597.333334a25.6 25.6 0 0 0 25.6 25.6h597.333334a25.6 25.6 0 0 0 25.6-25.6V213.333333z m76.8 597.333334a102.4 102.4 0 0 1-102.4 102.4H213.333333A102.4 102.4 0 0 1 110.933333 810.666667V213.333333A102.4 102.4 0 0 1 213.333333 110.933333h597.333334a102.4 102.4 0 0 1 102.4 102.4v597.333334z" p-id="23328"></path><path d="M536.704 479.253333a102.4 102.4 0 0 1 140.906667 8.362667l107.776 115.52a38.4 38.4 0 0 1-56.106667 52.416l-107.818667-115.52a25.6 25.6 0 0 0-35.221333-2.090667L291.413333 786.688a38.4 38.4 0 0 1-49.536-58.709333l294.826667-248.746667zM416.426667 373.738667a42.666667 42.666667 0 1 0-85.333334 0.042666 42.666667 42.666667 0 0 0 85.333334-0.042666z m76.778666 0a119.466667 119.466667 0 1 1-238.933333 0 119.466667 119.466667 0 0 1 238.933333 0z" p-id="23329"></path></svg>
    )
  }
)

if (__DEV__) {
  PictureOutlined.displayName = 'PictureOutlined'
}
  