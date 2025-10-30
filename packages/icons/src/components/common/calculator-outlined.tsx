
import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { IconProps } from '../../@types/props'

const _prefix = getPrefixCls('icon-calculator-outlined')

export const CalculatorOutlined = forwardRef<SVGSVGElement | null, IconProps>(
  ({ prefixCls = _prefix, className, children, size, style: styleProp, ...rest }, ref) => {
    const cls = cx(prefixCls, className)
    const style = { fontSize: size, ...styleProp }

    return (
      <svg className={cls} ref={ref} role="icon" style={style} {...rest}   viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="13712"  ><path d="M853.333333 283.584a38.4 38.4 0 1 1 0 76.8H576a38.4 38.4 0 1 1 0-76.8h277.333333zM853.333333 635.584a38.4 38.4 0 1 1 0 76.8H576a38.4 38.4 0 1 1 0-76.8h277.333333zM853.333333 784.917333a38.4 38.4 0 1 1 0 76.8H576a38.4 38.4 0 1 1 0-76.8h277.333333zM672 204.650667a42.666667 42.666667 0 1 1 85.333333 0 42.666667 42.666667 0 0 1-85.333333 0zM672 439.317333a42.666667 42.666667 0 1 1 85.333333 0 42.666667 42.666667 0 0 1-85.333333 0zM389.525333 617.429333a38.4 38.4 0 1 1 54.293334 54.293334l-196.096 196.096a38.4 38.4 0 1 1-54.314667-54.293334l196.117333-196.096z" p-id="13713"></path><path d="M443.818667 813.525333a38.4 38.4 0 1 1-54.293334 54.293334l-196.117333-196.096a38.4 38.4 0 1 1 54.293333-54.293334l196.117334 196.096zM448 283.584a38.4 38.4 0 1 1 0 76.8H170.666667a38.4 38.4 0 1 1 0-76.8h277.333333z" p-id="13714"></path><path d="M347.733333 460.650667a38.4 38.4 0 1 1-76.8 0v-277.333334a38.4 38.4 0 1 1 76.8 0v277.333334z" p-id="13715"></path></svg>
    )
  }
)

if (__DEV__) {
  CalculatorOutlined.displayName = 'CalculatorOutlined'
}
  