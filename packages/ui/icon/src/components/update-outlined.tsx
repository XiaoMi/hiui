
import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { IconProps } from '../@types/props'

const _role = 'icon-update-outlined'
const _prefix = getPrefixCls(_role)

export const UpdateOutlined = forwardRef<SVGSVGElement | null, IconProps>(
  ({ prefixCls = _prefix, role = _role, className, children, style, onClick }, ref) => {
    const cls = cx(prefixCls, className)

    return (
      <svg className={cls} ref={ref} role={role} style={style} onClick={onClick}  xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" version="1.1"><path d="M545.754 66.09C309.794 53.72 106.926 226.264 77.858 457.016l79.388 9.914C181.2 277.468 347.8 135.824 541.566 145.98c87.33 4.576 165.95 39.24 226.34 93.424l-50.688 41.044a8 8 0 0 0 2.694 13.866l179.546 54.94a8 8 0 0 0 10.31-8.348L893.36 153.86a8 8 0 0 0-13.004-5.518l-49.628 40.188c-74.674-70.942-174.05-116.628-284.972-122.44zM471.39 949.712c235.708 16.48 441.558-152.492 474.648-382.702l-79.204-11.298c-27.256 189.016-196.304 327.73-389.862 314.194-87.238-6.1-165.24-42.132-224.674-97.36l51.396-40.154a8 8 0 0 0-2.452-13.912l-178.56-58.064a8 8 0 0 0-10.454 8.168l13.142 187.302a8 8 0 0 0 12.906 5.744L188.6 822.316c73.422 72.234 171.988 119.648 282.79 127.396zM516.352 321.754a8 8 0 0 1 1.25 1.248l111.354 139.194a8 8 0 0 1-6.246 12.998h-71.356v222a8 8 0 0 1-8 8h-64a8 8 0 0 1-8-8v-222H400a8 8 0 0 1-6.246-12.998l111.354-139.194a8 8 0 0 1 11.244-1.248z" p-id="12485"></path></svg>
    )
  }
)

if (__DEV__) {
  UpdateOutlined.displayName = 'UpdateOutlined'
}
  