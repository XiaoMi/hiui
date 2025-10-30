
import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { IconProps } from '../../@types/props'

const _prefix = getPrefixCls('icon-cloud-outlined')

export const CloudOutlined = forwardRef<SVGSVGElement | null, IconProps>(
  ({ prefixCls = _prefix, className, children, size, style: styleProp, ...rest }, ref) => {
    const cls = cx(prefixCls, className)
    const style = { fontSize: size, ...styleProp }

    return (
      <svg className={cls} ref={ref} role="icon" style={style} {...rest}   viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="12283"  ><path d="M473.301333 138.730667C321.92 142.08 198.058667 258.154667 182.912 406.656l-5.568 3.285333A255.957333 255.957333 0 0 0 53.333333 629.333333c0 141.376 114.624 256 256 256l432.938667-0.085333C869.589333 881.557333 970.666667 777.706667 970.666667 650.666667l-0.085334-6.144c-2.88-112.448-84.885333-205.226667-192.448-224.746667l-0.128-2.346667C767.786667 261.76 638.293333 138.666667 480 138.666667l-6.698667 0.064zM480 224c117.824 0 213.333333 95.509333 213.333333 213.333333 0 5.973333-0.234667 11.946667-0.725333 17.834667a42.666667 42.666667 0 0 0 43.008 46.165333h0.853333c82.005333 0 148.864 66.858667 148.864 149.333334a149.333333 149.333333 0 0 1-144.896 149.269333L309.333333 800a170.666667 170.666667 0 0 1-170.666666-170.666667 170.688 170.688 0 0 1 102.464-156.501333 42.666667 42.666667 0 0 0 25.6-38.528c1.578667-116.522667 96.576-210.304 213.269333-210.304z" p-id="12284"></path></svg>
    )
  }
)

if (__DEV__) {
  CloudOutlined.displayName = 'CloudOutlined'
}
  