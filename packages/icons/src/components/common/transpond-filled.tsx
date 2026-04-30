
import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { IconProps } from '../../@types/props'

const _prefix = getPrefixCls('icon-transpond-filled')

export const TranspondFilled = forwardRef<SVGSVGElement | null, IconProps>(
  ({ prefixCls = _prefix, className, children, size, style: styleProp, ...rest }, ref) => {
    const cls = cx(prefixCls, className)
    const style = { fontSize: size, ...styleProp }

    return (
      <svg className={cls} ref={ref} role="icon" style={style} {...rest}   viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="24057"  ><path d="M762.368 433.130667a350.506667 350.506667 0 0 1 134.122667 199.466666 640.426667 640.426667 0 0 1 20.629333 177.130667s-32.490667-50.773333-45.397333-69.546667a424.405333 424.405333 0 0 0-155.285334-124.330666 618.325333 618.325333 0 0 0-229.546666-31.978667v119.061333c0 18.304-20.586667 29.056-35.605334 18.602667L116.394667 488.789333a22.656 22.656 0 0 1 0-37.205333l334.890666-233.194667a22.656 22.656 0 0 1 35.605334 18.581334v121.557333s95.424 7.104 144.96 17.28c47.445333 8.618667 92.330667 27.904 130.517333 57.344z" p-id="24058"></path></svg>
    )
  }
)

if (__DEV__) {
  TranspondFilled.displayName = 'TranspondFilled'
}
  