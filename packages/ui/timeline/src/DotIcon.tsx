import React from 'react'
import { isNullish } from '@hi-ui/type-assertion'

export const DotIcon = ({ prefixCls, icon }: DotIconProps) => {
  return isNullish(icon) ? (
    <div className={`${prefixCls}__dot`} />
  ) : (
    <div className={`${prefixCls}__icon`}>{icon}</div>
  )
}

export interface DotIconProps {
  prefixCls: string
  icon?: React.ReactNode
}
