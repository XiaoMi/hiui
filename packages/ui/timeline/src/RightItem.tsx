import React from 'react'
import { getPrefixCls } from '@hi-ui/classname'
import { TimelineDataItem } from './types'
import { DotIcon } from './DotIcon'
import { GlobalConfig } from '@hi-ui/core'

const _prefix = getPrefixCls('timeline-item')

export const RightItem: React.FC<TimelineDataItem> = ({
  prefixCls: prefixClsProp,
  title,
  content,
  timestamp,
  extraTime,
  icon,
  dotColor,
  dotType,
}) => {
  const globalPrefixCls = GlobalConfig.prefixCls
  const prefixCls =
    prefixClsProp || (globalPrefixCls && getPrefixCls('timeline-item', globalPrefixCls)) || _prefix

  return (
    <div className={prefixCls}>
      <div className={`${prefixCls}__title`}>{title}</div>
      <div className={`${prefixCls}__content`}>{content}</div>
      <div className={`${prefixCls}__time`}>
        {timestamp} {extraTime}
      </div>
      <DotIcon prefixCls={prefixCls} icon={icon} color={dotColor} type={dotType} />
      <div className={`${prefixCls}__line`} />
    </div>
  )
}
