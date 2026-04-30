
import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { IconProps } from '../../@types/props'

const _prefix = getPrefixCls('icon-save-filled')

export const SaveFilled = forwardRef<SVGSVGElement | null, IconProps>(
  ({ prefixCls = _prefix, className, children, size, style: styleProp, ...rest }, ref) => {
    const cls = cx(prefixCls, className)
    const style = { fontSize: size, ...styleProp }

    return (
      <svg className={cls} ref={ref} role="icon" style={style} {...rest}   viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="5600"  ><path d="M733.973333 110.933333a102.4 102.4 0 0 1 71.104 28.714667l76.693334 74.005333a102.4 102.4 0 0 1 31.296 73.685334V810.666667a102.4 102.4 0 0 1-102.4 102.4H213.333333A102.4 102.4 0 0 1 110.933333 810.666667V213.333333A102.4 102.4 0 0 1 213.333333 110.933333h110.933334V234.666667a102.4 102.4 0 0 0 102.4 102.4h170.666666a102.4 102.4 0 0 0 102.4-102.4V110.933333h34.24zM405.333333 644.266667a38.4 38.4 0 1 0 0 76.8h213.333334a38.4 38.4 0 1 0 0-76.8H405.333333z" p-id="5601"></path><path d="M622.933333 234.666667a25.6 25.6 0 0 1-25.6 25.6h-170.666666a25.6 25.6 0 0 1-25.6-25.6V110.933333h221.866666V234.666667z" p-id="5602"></path></svg>
    )
  }
)

if (__DEV__) {
  SaveFilled.displayName = 'SaveFilled'
}
  