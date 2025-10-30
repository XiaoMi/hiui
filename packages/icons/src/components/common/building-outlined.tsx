
import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { IconProps } from '../../@types/props'

const _prefix = getPrefixCls('icon-building-outlined')

export const BuildingOutlined = forwardRef<SVGSVGElement | null, IconProps>(
  ({ prefixCls = _prefix, className, children, size, style: styleProp, ...rest }, ref) => {
    const cls = cx(prefixCls, className)
    const style = { fontSize: size, ...styleProp }

    return (
      <svg className={cls} ref={ref} role="icon" style={style} {...rest}   viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="13126"  ><path d="M621.034667 198.826667a25.6 25.6 0 0 0-33.557334-24.298667L194.688 303.253333a25.6 25.6 0 0 0-17.621333 24.32v497.621334a25.6 25.6 0 0 0 25.6 25.6h418.368V198.869333z m76.8 728.768H202.666667a102.4 102.4 0 0 1-102.4-102.4V327.573333a102.4 102.4 0 0 1 70.506666-97.301333L563.562667 101.546667c66.197333-21.696 134.293333 27.626667 134.293333 97.28v728.768z" p-id="13127"></path><path d="M484.266667 424.064a38.4 38.4 0 1 1 0 76.8h-170.666667a38.4 38.4 0 1 1 0-76.8h170.666667zM484.266667 573.397333a38.4 38.4 0 1 1 0 76.8h-170.666667a38.4 38.4 0 1 1 0-76.8h170.666667zM868.266667 825.173333V509.653333a25.6 25.6 0 0 0-16.554667-23.914666L667.242667 416l27.114666-71.829333 184.512 69.696a102.421333 102.421333 0 0 1 66.218667 95.786666v315.52c0 56.533333-45.866667 102.4-102.4 102.4h-161.877333v-76.8H842.666667a25.6 25.6 0 0 0 25.6-25.6z" p-id="13128"></path></svg>
    )
  }
)

if (__DEV__) {
  BuildingOutlined.displayName = 'BuildingOutlined'
}
  