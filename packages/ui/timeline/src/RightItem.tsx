import React from 'react'
import { getPrefixCls } from '@hi-ui/classname'
import { TimelineDataItem } from './types'
import { DotIcon } from './DotIcon'

const _prefix = getPrefixCls('timeline-item')

export const RightItem: React.FC<TimelineDataItem> = ({
  prefixCls = _prefix,
  title,
  content,
  timestamp,
  extraTime,
  icon,
}) => {
  return (
    <div className={prefixCls}>
      <div className={`${prefixCls}__title`}>{title}</div>
      <div className={`${prefixCls}__content`}>{content}</div>
      <div className={`${prefixCls}__time`}>
        {timestamp} {extraTime}
      </div>
      <DotIcon prefixCls={prefixCls} icon={icon} />
      <div className={`${prefixCls}__line`} />
    </div>
  )
}
