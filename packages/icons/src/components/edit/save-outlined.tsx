
import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { IconProps } from '../../@types/props'

const _prefix = getPrefixCls('icon-save-outlined')

export const SaveOutlined = forwardRef<SVGSVGElement | null, IconProps>(
  ({ prefixCls = _prefix, className, children, size, style: styleProp, ...rest }, ref) => {
    const cls = cx(prefixCls, className)
    const style = { fontSize: size, ...styleProp }

    return (
      <svg className={cls} ref={ref} role="icon" style={style} {...rest}   viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="9166"  ><path d="M110.933333 810.666667V213.333333A102.4 102.4 0 0 1 213.333333 110.933333h520.64a102.4 102.4 0 0 1 71.104 28.714667l76.693334 74.005333a102.4 102.4 0 0 1 31.296 73.685334V810.666667a102.4 102.4 0 0 1-102.4 102.4H213.333333A102.4 102.4 0 0 1 110.933333 810.666667z m76.8 0a25.6 25.6 0 0 0 25.6 25.6h597.333334a25.6 25.6 0 0 0 25.6-25.6V287.338667a25.6 25.6 0 0 0-7.829334-18.432l-76.693333-73.984a25.6 25.6 0 0 0-17.770667-7.189334H213.333333A25.6 25.6 0 0 0 187.733333 213.333333v597.333334z" p-id="9167"></path><path d="M405.333333 721.066667a38.4 38.4 0 1 1 0-76.8h213.333334a38.4 38.4 0 1 1 0 76.8H405.333333zM324.266667 320V160h76.8V320c0 2.346667 1.92 4.266667 4.266666 4.266667h213.333334a4.266667 4.266667 0 0 0 4.266666-4.266667V160h76.8V320a81.066667 81.066667 0 0 1-81.066666 81.066667H405.333333a81.066667 81.066667 0 0 1-81.066666-81.066667z" p-id="9168"></path></svg>
    )
  }
)

if (__DEV__) {
  SaveOutlined.displayName = 'SaveOutlined'
}
  