
import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { IconProps } from '../@types/props'

const _role = 'icon-fire-filled'
const _prefix = getPrefixCls(_role)

export const FireFilled = forwardRef<SVGSVGElement | null, IconProps>(
  ({ prefixCls = _prefix, role = _role, className, children, style, onClick }, ref) => {
    const cls = cx(prefixCls, className)

    return (
      <svg className={cls} ref={ref} role={role} style={style} onClick={onClick}  xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" version="1.1"><path d="M458.416 108.97L468.448 64l38.142 25.924c5.214 3.544 13.6 9.926 24.108 19.066a405.892 405.892 0 0 1 50.444 52.604c50.904 63.65 79.164 136.808 74.296 217.502 17.486-18.832 30.524-41.166 37.74-67.428l12.308-44.786 36.922 28.24c5.026 3.842 12.98 10.68 22.916 20.46l0.88 0.87c16.9 16.732 33.728 36.428 49.428 59.048 61.368 88.412 88.646 194.63 62.42 314.67l-0.378 1.962c-1.866 9.284-5.712 23.284-12.16 40.58l-0.476 1.27c-11.88 31.532-28.6 63.03-51.074 92.53-72.376 94.994-185.812 146.964-343.776 133.34l-1.382-0.072c-11.34-0.65-29.226-2.962-51.612-8.034-38.604-8.746-77.234-23.032-113.512-44.246C193.034 842.8 129.06 729.514 136.6 561.474l0.052-1.44c0.536-12.732 3.466-32.524 10.626-57.14 12.188-41.914 33.106-83.736 64.826-122.692 19.986-24.546 43.702-47.158 72.124-67.948l2.24-1.574c0.966-0.688 2.148-1.54 3.532-2.546l1.642-1.198a694.734 694.734 0 0 0 20.6-15.732c21.392-16.948 42.782-35.672 62.65-55.54l2.72-2.74c42.332-42.868 71-84.64 80.12-121.06 0.24-0.97 0.47-1.934 0.684-2.894z" p-id="11885"></path></svg>
    )
  }
)

if (__DEV__) {
  FireFilled.displayName = 'FireFilled'
}
  