
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
      <svg className={cls} ref={ref} role="icon" style={style} {...rest}   viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="8840"  ><path d="M917.034667 276.629333c65.898667 27.946667 65.898667 121.322667 0 149.269334l-365.077334 154.773333a102.4 102.4 0 0 1-79.936 0L106.944 425.898667c-65.898667-27.946667-65.898667-121.322667 0-149.269334l365.077333-154.773333a102.4 102.4 0 0 1 79.936 0l365.077334 154.773333z m-29.973334 70.698667L521.984 192.554667a25.642667 25.642667 0 0 0-19.989333 0L136.917333 347.328c-1.344 0.576-1.770667 1.130667-1.984 1.493333a4.693333 4.693333 0 0 0-0.64 2.432 4.693333 4.693333 0 0 0 0.64 2.474667c0.213333 0.32 0.64 0.896 1.984 1.472l365.077334 154.773333c6.4 2.709333 13.610667 2.709333 20.010666 0L887.04 355.2c1.344-0.576 1.770667-1.152 1.984-1.493333a4.693333 4.693333 0 0 0 0.64-2.453334 4.693333 4.693333 0 0 0-0.64-2.453333c-0.213333-0.341333-0.64-0.896-1.984-1.472z" p-id="8841"></path><path d="M859.136 719.594667a102.4 102.4 0 0 1-67.626667 96.32l-244.821333 88.32c-22.4 8.064-46.933333 8.085333-69.376 0.021333L231.466667 815.893333a102.4 102.4 0 0 1-67.776-96.362666V445.098667h76.8v274.432c0 10.816 6.784 20.437333 16.938666 24.106666l245.888 88.32c5.589333 2.026667 11.733333 2.026667 17.344 0L765.44 743.68a25.6 25.6 0 0 0 16.917333-24.106667V445.098667h76.8v274.517333z" p-id="8842"></path></svg>
    )
  }
)

if (__DEV__) {
  StudentOutlined.displayName = 'StudentOutlined'
}
  