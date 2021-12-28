
import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { IconProps } from '../../@types/props'

const _role = 'icon-bookmark-outlined'
const _prefix = getPrefixCls(_role)

export const BookmarkOutlined = forwardRef<SVGSVGElement | null, IconProps>(
  ({ prefixCls = _prefix, role = _role, className, children, style, onClick }, ref) => {
    const cls = cx(prefixCls, className)

    return (
      <svg className={cls} ref={ref} role={role} style={style} onClick={onClick}  xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" version="1.1"><path d="M746.666667 85.333333a128 128 0 0 1 128 128v597.333334a128 128 0 0 1-128 128H277.333333a128 128 0 0 1-128-128V213.333333a128 128 0 0 1 128-128h469.333334z m0 85.333334h-21.333334v227.562666c0 30.656-31.189333 50.944-58.88 39.466667l-2.858666-1.301333L597.333333 403.242667l-66.261333 33.152c-27.413333 13.696-59.52-5.12-61.632-35.029334L469.333333 398.229333V170.666667h-192a42.666667 42.666667 0 0 0-42.56 39.466666L234.666667 213.333333v597.333334a42.666667 42.666667 0 0 0 39.466666 42.56L277.333333 853.333333h469.333334a42.666667 42.666667 0 0 0 42.56-39.466666L789.333333 810.666667V213.333333a42.666667 42.666667 0 0 0-39.466666-42.56L746.666667 170.666667z m-106.666667 0h-85.333333v158.506666l23.594666-11.776a42.666667 42.666667 0 0 1 34.496-1.621333l3.648 1.621333L640 329.173333V170.666667z" p-id="39175"></path></svg>
    )
  }
)

if (__DEV__) {
  BookmarkOutlined.displayName = 'BookmarkOutlined'
}
  