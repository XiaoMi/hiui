
import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { IconProps } from '../@types/props'

const _role = 'icon-cloud-outlined'
const _prefix = getPrefixCls(_role)

export const CloudOutlined = forwardRef<SVGSVGElement | null, IconProps>(
  ({ prefixCls = _prefix, role = _role, className, children, style, onClick }, ref) => {
    const cls = cx(prefixCls, className)

    return (
      <svg className={cls} ref={ref} role={role} style={style} onClick={onClick}  xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" version="1.1"><path d="M512 120c165.686 0 300 134.314 300 300 0 1.6-0.012 3.2-0.038 4.794C911.594 455.494 984 548.292 984 658c0 133.41-107.068 241.812-239.966 243.968L740 902H302c-143.594 0-260-116.406-260-260 0-112.266 71.154-207.914 170.826-244.304C224.226 242.428 353.816 120 512 120z m0 80c-114.246 0-209.08 87.432-219.112 200.132l-0.278 3.422-3.786 51.56-48.56 17.73C169.834 498.556 122 565.76 122 642c0 98.418 78.986 178.386 177.024 179.976L302 822h437.588l3.314-0.028 2.512-0.06c87.262-2.816 157.16-73.792 158.564-161.23L904 658c0-71.748-46.506-134.49-113.558-156.112l-2.038-0.64-57.372-17.68 0.94-60.028c0.02-1.18 0.028-2.36 0.028-3.54 0-120.288-96.538-218.028-216.36-219.97L512 200z" p-id="12685"></path></svg>
    )
  }
)

if (__DEV__) {
  CloudOutlined.displayName = 'CloudOutlined'
}
  