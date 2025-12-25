
import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { IconProps } from '../../@types/props'

const _prefix = getPrefixCls('icon-lease-outlined')

export const LeaseOutlined = forwardRef<SVGSVGElement | null, IconProps>(
  ({ prefixCls = _prefix, className, children, size, style: styleProp, ...rest }, ref) => {
    const cls = cx(prefixCls, className)
    const style = { fontSize: size, ...styleProp }

    return (
      <svg className={cls} ref={ref} role="icon" style={style} {...rest}   viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="6212"  ><path d="M836.266667 412.693333a25.6 25.6 0 0 0-11.690667-21.482666l-298.666667-193.28a25.621333 25.621333 0 0 0-27.818666 0l-298.666667 193.28a25.6 25.6 0 0 0-11.690667 21.482666v391.850667a25.6 25.6 0 0 0 25.6 25.6h597.333334a25.6 25.6 0 0 0 25.6-25.6V412.693333z m76.8 391.850667a102.4 102.4 0 0 1-102.4 102.4H213.333333a102.4 102.4 0 0 1-102.4-102.4V412.693333a102.4 102.4 0 0 1 46.784-85.973333l298.666667-193.258667a102.4 102.4 0 0 1 111.232 0l298.666667 193.28a102.4 102.4 0 0 1 46.784 85.973334v391.829333z" p-id="6213"></path><path d="M550.4 729.322667a38.4 38.4 0 1 1-76.8 0v-177.770667a38.4 38.4 0 1 1 76.8 0v177.770667z" p-id="6214"></path><path d="M405.333333 572.16a38.4 38.4 0 1 1 0-76.8h213.333334a38.4 38.4 0 1 1 0 76.8H405.333333zM405.333333 678.826667a38.4 38.4 0 1 1 0-76.8h213.333334a38.4 38.4 0 1 1 0 76.8H405.333333z" p-id="6215"></path><path d="M578.176 395.52a38.4 38.4 0 1 1 54.314667 54.272L512 570.304l-120.490667-120.512a38.4 38.4 0 1 1 54.314667-54.272L512 461.696l66.176-66.176z" p-id="6216"></path></svg>
    )
  }
)

if (__DEV__) {
  LeaseOutlined.displayName = 'LeaseOutlined'
}
  