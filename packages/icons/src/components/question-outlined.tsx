
import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { IconProps } from '../@types/props'

const _role = 'icon-question-outlined'
const _prefix = getPrefixCls(_role)

export const QuestionOutlined = forwardRef<SVGSVGElement | null, IconProps>(
  ({ prefixCls = _prefix, role = _role, className, children, style, onClick }, ref) => {
    const cls = cx(prefixCls, className)

    return (
      <svg className={cls} ref={ref} role={role} style={style} onClick={onClick}  xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" version="1.1"><path d="M553.06 765.876V737.12c0-33.756 7.5-63.76 23.754-91.266 12.5-22.506 31.254-45.01 58.76-68.764 55.01-48.76 88.766-81.264 101.268-96.268 31.256-41.258 47.51-90.016 47.51-146.276 0-75.014-23.754-133.776-70.014-176.284C665.58 113.254 601.82 92 521.802 92c-90.016 0-160.028 27.506-210.04 82.516C261.756 227.026 238 297.038 238 384.556h98.768c0-61.262 13.752-108.772 41.258-143.78 30.006-41.256 76.264-61.26 138.776-61.26 52.51 0 93.768 13.752 122.522 43.76 27.506 27.504 42.508 66.26 42.508 116.27 0 35.006-12.5 67.512-37.506 98.768-7.5 10.002-22.504 25.006-42.508 45.008-67.512 60.012-108.77 107.52-126.274 145.028-15.002 31.256-22.504 67.512-22.504 108.77v28.756h100.02zM503.092 932c19.76 0 36.034-6.894 49.982-19.534 13.95-12.64 20.924-28.728 20.924-49.412 0-19.536-6.974-35.624-19.76-48.264-13.95-13.788-31.386-19.534-51.146-19.534s-36.036 5.746-49.984 19.534c-13.95 12.64-19.76 28.728-19.76 48.264 0 19.534 5.81 35.62 19.76 49.412 13.948 12.64 30.222 19.534 49.984 19.534z" p-id="11335"></path></svg>
    )
  }
)

if (__DEV__) {
  QuestionOutlined.displayName = 'QuestionOutlined'
}
  