
import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { IconProps } from '../@types/props'

const _role = 'icon-picture-outlined'
const _prefix = getPrefixCls(_role)

export const PictureOutlined = forwardRef<SVGSVGElement | null, IconProps>(
  ({ prefixCls = _prefix, role = _role, className, children, style, onClick }, ref) => {
    const cls = cx(prefixCls, className)

    return (
      <svg className={cls} ref={ref} role={role} style={style} onClick={onClick}  xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" version="1.1"><path d="M904 112a8 8 0 0 1 8 8v784a8 8 0 0 1-8 8H120a8 8 0 0 1-8-8V120a8 8 0 0 1 8-8h784zM342.042 570.456L192 676.346V832h640v-2.322L598.812 625.416l-123.416 83.18-133.354-138.14zM832 192H192v386.428l159.958-112.886 134.38 139.204 118.848-80.1L832 723.326V192z m-182 56c66.274 0 120 53.726 120 120s-53.726 120-120 120-120-53.726-120-120 53.726-120 120-120z m0 80c-22.092 0-40 17.908-40 40s17.908 40 40 40 40-17.908 40-40-17.908-40-40-40z" p-id="13055"></path></svg>
    )
  }
)

if (__DEV__) {
  PictureOutlined.displayName = 'PictureOutlined'
}
  