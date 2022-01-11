import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { IconProps } from '../../@types/props'

const _prefix = getPrefixCls('icon-moon-outlined')

export const MoonOutlined = forwardRef<SVGSVGElement | null, IconProps>(
  ({ prefixCls = _prefix, className, children, ...rest }, ref) => {
    const cls = cx(prefixCls, className)

    return (
      <svg
        className={cls}
        ref={ref}
        role="icon"
        {...rest}
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 1024 1024"
        version="1.1"
      >
        <path
          d="M466.56 87.722667C250.666667 110.592 85.333333 293.269333 85.333333 512c0 235.648 191.018667 426.666667 426.666667 426.666667 216.32 0 397.674667-161.792 423.530667-374.741334 5.12-42.389333-48.234667-65.216-75.328-32.213333C809.941333 592.853333 733.525333 629.333333 650.666667 629.333333c-147.605333 0-266.666667-114.965333-266.666667-256 0-83.413333 41.834667-160.170667 111.296-208.042666 36.416-25.109333 15.274667-82.218667-28.714667-77.568z m-133.546667 133.525333l3.52-2.133333-0.085333 0.213333A332.288 332.288 0 0 0 298.666667 373.333333c0 188.864 157.930667 341.333333 352 341.333334l8.533333-0.106667c51.2-1.173333 100.48-13.056 145.002667-33.984l6.464-3.157333-0.426667 0.853333C751.594667 783.168 639.36 853.333333 512 853.333333c-188.522667 0-341.333333-152.810667-341.333333-341.333333 0-122.24 64.576-230.4 162.346666-290.752z"
          p-id="38775"
        ></path>
      </svg>
    )
  }
)

if (__DEV__) {
  MoonOutlined.displayName = 'MoonOutlined'
}
