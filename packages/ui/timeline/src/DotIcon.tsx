import React from 'react'
import { isNullish } from '@hi-ui/type-assertion'

export const DotIcon = ({ prefixCls, icon, type = 'hollow', color }: DotIconProps) => {
  return isNullish(icon) ? (
    <div
      className={`${prefixCls}__dot ${prefixCls}__dot--type-${type}`}
      style={{
        color,
        ...(type === 'hollow' ? { borderColor: color } : { backgroundColor: color }),
      }}
    />
  ) : (
    <div className={`${prefixCls}__icon`}>{icon}</div>
  )
}

export interface DotIconProps {
  prefixCls: string
  icon?: React.ReactNode
  color?: React.CSSProperties['color']
  type?: 'solid' | 'hollow'
}
