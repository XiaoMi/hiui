
import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { IconProps } from '../../@types/props'

const _prefix = getPrefixCls('icon-student-outlined')

export const StudentOutlined = forwardRef<SVGSVGElement | null, IconProps>(
  ({ prefixCls = _prefix, className, children, size, style: styleProp, ...rest }, ref) => {
    const cls = cx(prefixCls, className)
    const style = { fontSize: size, ...styleProp }

    return (
      <svg className={cls} ref={ref} role="icon" style={style} {...rest}  viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="14049"  ><path d="M832 426.666667v328.597333c0 7.466667-1.856 15.018667-5.76 22.229333-6.250667 11.456-17.088 20.650667-30.613333 25.941334l-231.189334 104.128c-33.28 13.013333-71.616 13.013333-104.874666 0l-231.189334-104.128C205.44 794.453333 191.957333 775.210667 192 755.114667V426.666667h640z m-85.333333 0H277.312v305.216l214.4 96.576 3.456 1.173333a61.226667 61.226667 0 0 0 33.664 0l3.434667-1.173333L746.666667 731.882667V426.666667z" p-id="14050"></path><path d="M552.533333 115.413333l400.085334 181.44a48.810667 48.810667 0 0 1 0 88.96L552.533333 567.232a98.154667 98.154667 0 0 1-81.066666 0L71.381333 385.813333a48.810667 48.810667 0 0 1 0-88.96L471.466667 115.434667a98.154667 98.154667 0 0 1 81.066666 0z m-35.242666 77.717334a12.821333 12.821333 0 0 0-8.512-0.725334l-2.069334 0.725334L179.946667 341.333333l326.762666 148.202667a12.821333 12.821333 0 0 0 8.512 0.725333l2.069334-0.725333 326.741333-148.224-326.741333-148.181333z" p-id="14051"></path></svg>
    )
  }
)

if (__DEV__) {
  StudentOutlined.displayName = 'StudentOutlined'
}
  