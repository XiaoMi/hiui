
import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { IconProps } from '../@types/props'

const _role = 'icon-task-outlined'
const _prefix = getPrefixCls(_role)

export const TaskOutlined = forwardRef<SVGSVGElement | null, IconProps>(
  ({ prefixCls = _prefix, role = _role, className, children, style, onClick }, ref) => {
    const cls = cx(prefixCls, className)

    return (
      <svg className={cls} ref={ref} role={role} style={style} onClick={onClick}  xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" version="1.1"><path d="M406 80a8 8 0 0 1 8 8v52h196V88a8 8 0 0 1 8-8h64a8 8 0 0 1 8 8v52h200a8 8 0 0 1 8 8v46h1v694h-1v32a8 8 0 0 1-8 8H126a8 8 0 0 1-8-8V148a8 8 0 0 1 8-8h208V88a8 8 0 0 1 8-8h64z m-72 140H197.998v628H819V220H690v52a8 8 0 0 1-8 8h-64a8 8 0 0 1-8-8v-52h-196v52a8 8 0 0 1-8 8h-64a8 8 0 0 1-8-8v-52z m355.362 153.892l45.256 45.256a8 8 0 0 1 0 11.312L440.46 724.62a7.97 7.97 0 0 1-5.246 2.332l-0.41 0.01a7.974 7.974 0 0 1-5.656-2.342l-135.766-135.766a8 8 0 0 1 0-11.312l45.256-45.256a8 8 0 0 1 11.314 0l84.852 84.852 243.244-243.244a8 8 0 0 1 11.314 0z" p-id="12375"></path></svg>
    )
  }
)

if (__DEV__) {
  TaskOutlined.displayName = 'TaskOutlined'
}
  