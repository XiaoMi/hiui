
import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { IconProps } from '../../@types/props'

const _prefix = getPrefixCls('icon-sort-ascending-outlined')

export const SortAscendingOutlined = forwardRef<SVGSVGElement | null, IconProps>(
  ({ prefixCls = _prefix, className, children, size, style: styleProp, ...rest }, ref) => {
    const cls = cx(prefixCls, className)
    const style = { fontSize: size, ...styleProp }

    return (
      <svg className={cls} ref={ref} role="icon" style={style} {...rest}   viewBox="0 0 1045 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="9457"  ><path d="M317.994667 870.933333a38.4 38.4 0 1 1-76.8 0V156.586667a38.4 38.4 0 1 1 76.8 0v714.346666z" p-id="9458"></path><path d="M186.24 304.106667a38.4 38.4 0 1 1-54.293333-54.314667l120.682666-120.682667a38.4 38.4 0 1 1 54.314667 54.314667L186.24 304.085333z" p-id="9459"></path><path d="M427.605333 249.813333a38.4 38.4 0 1 1-54.293333 54.272l-120.682667-120.661333a38.4 38.4 0 1 1 54.314667-54.314667l120.661333 120.682667zM697.450667 317.888h91.52L743.466667 189.76l-45.994667 128.128z m140.330666 137.045333l-27.221333-76.032h-134.698667l-27.221333 76.032h-73.685333l127.658666-340.266666h81.664l127.658667 340.266666h-74.154667zM692.501333 837.226667h186.325334v65.706666H608.490667v-65.706666l178.346666-209.322667h-176.469333v-65.237333h259.541333v65.237333l-177.408 209.322667z" p-id="9460"></path></svg>
    )
  }
)

if (__DEV__) {
  SortAscendingOutlined.displayName = 'SortAscendingOutlined'
}
  