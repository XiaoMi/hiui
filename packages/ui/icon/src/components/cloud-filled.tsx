
import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { IconProps } from '../@types/props'

const _role = 'icon-cloud-filled'
const _prefix = getPrefixCls(_role)

export const CloudFilled = forwardRef<SVGSVGElement | null, IconProps>(
  ({ prefixCls = _prefix, role = _role, className, children, style, onClick }, ref) => {
    const cls = cx(prefixCls, className)

    return (
      <svg className={cls} ref={ref} role={role} style={style} onClick={onClick}  xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" version="1.1"><path d="M512 120c165.686 0 300 134.314 300 300 0 1.6-0.012 3.2-0.038 4.794C911.594 455.494 984 548.292 984 658c0 133.41-107.068 241.812-239.966 243.968L740 902H302c-143.594 0-260-116.406-260-260 0-112.266 71.154-207.914 170.826-244.304C224.226 242.428 353.816 120 512 120z" p-id="11765"></path></svg>
    )
  }
)

if (__DEV__) {
  CloudFilled.displayName = 'CloudFilled'
}
  