
import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { IconProps } from '../../@types/props'

const _prefix = getPrefixCls('icon-bookmark-outlined')

export const BookmarkOutlined = forwardRef<SVGSVGElement | null, IconProps>(
  ({ prefixCls = _prefix, className, children, size, style: styleProp, ...rest }, ref) => {
    const cls = cx(prefixCls, className)
    const style = { fontSize: size, ...styleProp }

    return (
      <svg className={cls} ref={ref} role="icon" style={style} {...rest}   viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="12980"  ><path d="M793.6 192A25.6 25.6 0 0 0 768 166.4H256A25.6 25.6 0 0 0 230.4 192v640a25.6 25.6 0 0 0 25.6 25.6h512a25.6 25.6 0 0 0 25.6-25.6V192z m76.8 640a102.4 102.4 0 0 1-102.4 102.4H256A102.4 102.4 0 0 1 153.6 832V192A102.4 102.4 0 0 1 256 89.6h512A102.4 102.4 0 0 1 870.4 192v640z" p-id="12981"></path><path d="M529.066667 356.16l23.296-16.341333a59.733333 59.733333 0 0 1 64.682666-2.538667l3.925334 2.56 23.296 16.32V169.770667h-115.2v186.389333z m192 32.853333c0 48.341333-54.464 76.650667-94.037334 48.874667L586.666667 409.6l-40.362667 28.309333c-39.573333 27.776-94.037333-0.533333-94.037333-48.896V92.970667h268.8v296.021333z" p-id="12982"></path></svg>
    )
  }
)

if (__DEV__) {
  BookmarkOutlined.displayName = 'BookmarkOutlined'
}
  