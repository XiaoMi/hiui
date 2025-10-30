
import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { IconProps } from '../../@types/props'

const _prefix = getPrefixCls('icon-pin-outlined')

export const PinOutlined = forwardRef<SVGSVGElement | null, IconProps>(
  ({ prefixCls = _prefix, className, children, size, style: styleProp, ...rest }, ref) => {
    const cls = cx(prefixCls, className)
    const style = { fontSize: size, ...styleProp }

    return (
      <svg className={cls} ref={ref} role="icon" style={style} {...rest}   viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="23473"  ><path d="M631.829333 93.696a38.4 38.4 0 0 1 44.373334 7.125333l246.954666 246.762667a38.4 38.4 0 0 1-32.618666 65.194667l-81.792-11.733334-132.096 237.44c15.786667 36.181333 25.514667 72.405333 23.914666 108.458667-1.941333 43.797333-20.352 82.794667-54.997333 117.418667a38.4 38.4 0 0 1-54.293333 0l-188.650667-188.501334-247.466667 247.296a38.4 38.4 0 0 1-54.293333-54.336l247.445333-247.253333-189.205333-189.056a38.4 38.4 0 0 1 0-54.314667c34.794667-34.773333 75.050667-53.397333 119.125333-55.637333 36.352-1.834667 72.576 7.616 107.648 24.149333l237.077334-131.306666-11.904-81.877334a38.4 38.4 0 0 1 20.778666-39.829333z m71.338667 142.656a38.4 38.4 0 0 1-19.754667 33.365333l-278.144 154.048a38.4 38.4 0 0 1-37.056 0.085334c-33.386667-18.282667-61.930667-25.813333-86.101333-24.597334a91.84 91.84 0 0 0-37.589333 10.048l369.984 369.706667a85.376 85.376 0 0 0 9.365333-35.477333c1.045333-23.744-6.528-52.650667-24.725333-89.706667a38.4 38.4 0 0 1 0.917333-35.562667l154.410667-277.653333a38.4 38.4 0 0 1 33.28-19.733333l-84.586667-84.522667z" p-id="23474"></path></svg>
    )
  }
)

if (__DEV__) {
  PinOutlined.displayName = 'PinOutlined'
}
  