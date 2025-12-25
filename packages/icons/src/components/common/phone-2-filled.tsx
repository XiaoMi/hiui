
import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { IconProps } from '../../@types/props'

const _prefix = getPrefixCls('icon-phone-2-filled')

export const Phone2Filled = forwardRef<SVGSVGElement | null, IconProps>(
  ({ prefixCls = _prefix, className, children, size, style: styleProp, ...rest }, ref) => {
    const cls = cx(prefixCls, className)
    const style = { fontSize: size, ...styleProp }

    return (
      <svg className={cls} ref={ref} role="icon" style={style} {...rest}   viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="5014"  ><path d="M234.112 135.616c68.906667-49.237333 165.824-18.602667 193.898667 61.312l44.885333 127.808a102.4 102.4 0 0 1-27.264 109.290667l-14.144 13.056a25.6 25.6 0 0 0-0.768 36.928l109.269333 109.290666a25.6 25.6 0 0 0 36.928-0.768l13.034667-14.165333a102.4 102.4 0 0 1 109.312-27.264l127.786667 44.906667c79.914667 28.074667 110.570667 124.949333 61.354666 193.877333a292.394667 292.394667 0 0 1-257.258666 121.6 331.264 331.264 0 0 1-173.738667-63.317333l-51.84-37.973334a891.904 891.904 0 0 1-191.744-191.786666L175.786667 566.592a331.264 331.264 0 0 1-63.296-173.717333c-6.741333-100.906667 39.253333-198.421333 121.6-257.258667z"  p-id="5015"></path></svg>
    )
  }
)

if (__DEV__) {
  Phone2Filled.displayName = 'Phone2Filled'
}
  