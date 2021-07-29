
import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { IconProps } from '../@types/props'

const _role = 'icon-tool-outlined'
const _prefix = getPrefixCls(_role)

export const ToolOutlined = forwardRef<SVGSVGElement | null, IconProps>(
  ({ prefixCls = _prefix, role = _role, className, children, style, onClick }, ref) => {
    const cls = cx(prefixCls, className)

    return (
      <svg className={cls} ref={ref} role={role} style={style} onClick={onClick}  xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" version="1.1"><path d="M894.744 213.392c88.664 128.568 75.804 306.03-38.58 420.414-89.542 89.542-217.74 116.87-330.876 81.982L286.236 954.832a8 8 0 0 1-11.314 0L68.446 748.36a8 8 0 0 1 0-11.314l239.046-239.05c-34.888-113.138-7.56-241.336 81.98-330.88C503.86 52.734 681.32 39.874 809.89 128.538l-180 180 84.854 84.854 180.002-179.998z m-26.048 141.44l-0.362-1.896-153.592 153.59-197.99-197.988 153.59-153.594-1.892-0.36c-77.536-14.294-160.062 8.48-219.824 66.554l-2.584 2.546c-65.608 65.608-88.776 160.808-62.902 248.092l0.8 2.644 14.202 46.06L175.926 742.7l104.654 104.654 222.222-222.216 46.06 14.202c88 27.136 184.464 4.168 250.734-62.102 59.952-59.952 83.6-143.748 69.1-222.408z" p-id="12405"></path></svg>
    )
  }
)

if (__DEV__) {
  ToolOutlined.displayName = 'ToolOutlined'
}
  